import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const postSchema = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  externalId: text('externalId'),
  title: text('title'),
  categories: text('categories'),
  content: text('content'),
  source: text('source'),
  url: text('url'),
  postedOn: integer('postedOn', { mode: 'timestamp' }),
});

export type NewPost = Omit<Post, 'id' | 'postedOn'> & {
  postedOn?: number;
};

export type Post = {
  id: number;
  externalId: string;
  categories: string[];
  title: string;
  content: string;
  source: string;
  url: string;
  postedOn: Date;
};
