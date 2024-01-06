import { dump, load } from 'js-yaml';
import RSSParser from 'rss-parser';
import path from 'path';
import type { NewPost, Post } from '../../data/models';
import {
  createPost,
  findPostByExternalId,
} from '../../data/repositories/postRepository';
import type { FeedList } from './types/FeedList';
import type {
  NewsChannel,
  PrivateThreadChannel,
  PublicThreadChannel,
  StageChannel,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import { getConfig } from '../../data/repositories/configRepository';

export async function getRSSFeeds(): Promise<FeedList> {
  try {
    const feedList = (await load(
      await Bun.file(path.join(import.meta.dir, '../../../RSS.yml')).text()
    )) as FeedList;
    return feedList;
  } catch (error) {
    console.error(error);
    return { feeds: [] };
  }
}

async function parseRSS(url: string) {
  const parser = new RSSParser();
  const feed = await parser.parseURL(url);
  return feed;
}

export async function getValidPost(): Promise<NewPost | null> {
  const feedList = await getRSSFeeds();
  const randomizedFeeds = shuffle(feedList.feeds);

  for (const feed of randomizedFeeds) {
    const parsedFeed = await parseRSS(feed.url);
    if (parsedFeed.items.length > 0) {
      for (const item of parsedFeed.items) {
        if (!hasValidDate(item)) {
          continue;
        }

        const maxAgeHours = Number(getConfig('RSS_MAX_AGE')) || 24;
        const date = getItemDate(item);

        if (isExpired(date, maxAgeHours)) {
          continue;
        }

        if (isValidPost(item) && !isDuplicatePost(item)) {
          return createPostFromItem(item, feed.name);
        }
      }
    }
  }

  console.log('No valid article found');
  return null;
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => 0.5 - Math.random());
}

function hasValidDate(item: any): boolean {
  return !!item.pubDate || !!item.isoDate;
}

function getItemDate(item: any): Date {
  return new Date(item.pubDate || item.isoDate);
}

function isExpired(date: Date, maxAgeHours: number): boolean {
  return date.getTime() < Date.now() - maxAgeHours * 60 * 60 * 1000;
}

function isValidPost(item: any): boolean {
  return !!item.title && !!item.content && !!item.link;
}

function isDuplicatePost(item: any): boolean {
  return !!findPostByExternalId(item.guid || item.link);
}

function createPostFromItem(item: any, source: string): NewPost {
  return {
    title: item.title,
    content: item.content,
    categories: item.categories || ['No Category'],
    url: item.link,
    externalId: item.guid || item.link,
    source,
  };
}

export function formatCategories(categories: string[], limit = 2) {
  if (categories.length === 0) {
    return '';
  }
  if (categories.length > limit) {
    categories = categories.slice(0, limit);
  }
  categories = categories.map((category) => {
    return `🔷${category}`;
  });
  return categories.join(', ');
}

export async function sendRSSPost(
  channel:
    | NewsChannel
    | StageChannel
    | TextChannel
    | PrivateThreadChannel
    | PublicThreadChannel<boolean>
    | VoiceChannel
) {
  const post = await getValidPost();
  if (post) {
    console.log('Sending message');

    const postCategories =
      post.categories.length > 0 ? post.categories : [post.source];

    const formattedCategories = formatCategories(postCategories, 3);

    const result = await channel.send(
      `📰  | ${post.title} \n\`${formattedCategories}\`\n${post.url}`
    );
    if (!result.hasThread) {
      await result.startThread({
        name: 'Auto-Thread - Please keep your discussion in here!',
        autoArchiveDuration: 60,
      });
    }

    createPost({
      ...post,
      postedOn: result.createdTimestamp,
      categories: postCategories,
    });
    return;
  }
}

async function isRSSFeed(url: string) {
  try {
    const feed = await parseRSS(url);
    return feed.items.length > 0;
  } catch (e) {
    return false;
  }
}

export async function addFeed(name: string, url: string) {
  if (!(await isRSSFeed(url))) {
    throw new Error('Invalid RSS feed');
  }
  const feedList = await getRSSFeeds();
  feedList.feeds.push({ name, url });
  await Bun.write(
    path.join(import.meta.dir, '../../../RSS.yml'),
    dump(feedList)
  );
}

export async function deleteFeed(name: string) {
  const feedList = await getRSSFeeds();

  feedList.feeds = feedList.feeds.filter((feed) => feed.name !== name);
  await Bun.write(
    path.join(import.meta.dir, '../../../RSS.yml'),
    dump(feedList)
  );
}
