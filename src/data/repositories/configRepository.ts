import { eq, sql } from 'drizzle-orm';
import { getDb } from '../connection';
import { configSchema, type Config } from '../models';
import { isValidEntity } from '../../utils/isValidEntity';

export function createConfig(config: Config) {
  const db = getDb();
  const query = sql`INSERT INTO config (name, value) VALUES (${config.name}, ${config.value})
  RETURNING *`;
  const result = db.get<Config>(query);
  if (isValidEntity(result, ['name', 'value'])) {
    return result;
  }
  throw new Error('Failed to create config');
}

export function updateConfig(config: Config) {
  const db = getDb();
  const query = sql`UPDATE config SET value = ${config.value} WHERE name = ${config.name}
  RETURNING *`;
  const result = db.get<Config>(query);
  if (isValidEntity(result, ['name', 'value'])) {
    return result;
  }
  throw new Error('Failed to update config');
}

export function getConfig(name: string): string | null {
  const db = getDb();
  const result = db
    .select()
    .from(configSchema)
    .where(eq(configSchema.name, name))
    .all()[0];

  if (isValidEntity(result, ['name', 'value'])) {
    return result.value;
  }
  return null;
}
