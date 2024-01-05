import { sql, eq } from 'drizzle-orm';
import { getDb } from '../connection';
import { postSchema, type Post } from '../models';
import { isValidEntity } from '../../utils/isValidEntity';

export function createPost({
  externalId,
  title,
  content,
  source,
  url,
  postedOn,
}: Post) {
  try {
    const db = getDb();
    const query = sql`INSERT INTO posts (externalId, title, content, source, url, postedOn) VALUES (${externalId}, ${title}, ${content}, ${source}, ${url}, ${postedOn})
    RETURNING *`;

    const result = db.get<Post>(query);

    if (
      isValidEntity(result, ['title', 'content', 'source', 'url', 'postedOn'])
    ) {
      return result;
    }
    throw new Error('Failed to create post');
  } catch (error) {
    throw new Error('Failed to create post');
  }
}

export function findPostByExternalId(externalId: string): Post | null {
  const db = getDb();
  const result = db
    .select()
    .from(postSchema)
    .where(eq(postSchema.externalId, externalId))
    .all()[0];

  if (
    result &&
    isValidEntity(result, ['title', 'content', 'source', 'url', 'postedOn'])
  ) {
    return { ...result } as Post;
  }
  return null;
}
