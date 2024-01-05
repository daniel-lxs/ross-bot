import { dump, load } from 'js-yaml';
import RSSParser from 'rss-parser';
import path from 'path';
import type { Post } from '../../data/models';
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

export async function getValidPost(): Promise<Post | null> {
  const feedList = await getRSSFeeds();
  for (const feed of feedList.feeds) {
    const parsedFeed = await parseRSS(feed.url);

    if (parsedFeed.items.length > 0) {
      for (const item of parsedFeed.items) {
        if (
          item.title &&
          item.content &&
          item.link &&
          item.guid &&
          item.categories &&
          !findPostByExternalId(item.guid)
        ) {
          console.log(`Found valid article: ${JSON.stringify(item)}`);
          return {
            title: item.title,
            content: item.content,
            categories: item.categories,
            url: item.link,
            externalId: item.guid,
            source: feed.name,
          };
        }
      }
    }
  }
  console.log('No valid article found');
  return null;
}

export function formatCategories(categories: string[]) {
  if (categories.length === 0) {
    return '';
  }
  if (categories.length > 2) {
    categories = categories.slice(0, 2);
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
    const result = await channel.send(
      `📰  | ${post.title} \n\`${formatCategories(post.categories)}\`\n${
        post.url
      }`
    );
    if (!result.hasThread) {
      await result.startThread({
        name: 'Auto-Thread - Please keep your discussion in here!',
        autoArchiveDuration: 60,
      });
    }

    createPost({
      ...post,
      postedOn: new Date(result.createdTimestamp),
    });
    return;
  }
}

export async function addFeed(name: string, url: string) {
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
