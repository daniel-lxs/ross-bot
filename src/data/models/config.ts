import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const configSchema = sqliteTable('config', {
  id: integer('id').primaryKey(),
  name: text('name'),
  value: text('value'),
});

export type Config = {
  id?: number;
  name: string;
  value: string;
};
