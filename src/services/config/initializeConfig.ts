import {
  createConfig,
  findConfigByName,
} from '../../data/repositories/configRepository';

export function initializeConfig() {
  if (!findConfigByName('RSS_ENABLED')) {
    createConfig({
      name: 'RSS_ENABLED',
      value: 'true',
    });
  }

  if (!findConfigByName('RSS_POST_INTERVAL')) {
    createConfig({
      name: 'RSS_POST_INTERVAL',
      value: '30',
    });
  }
}
