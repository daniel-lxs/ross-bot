import {
  createConfig,
  getConfig,
} from '../../data/repositories/configRepository';

export const config = {
  RSS_ENABLED: 'true',
  RSS_POST_INTERVAL: '30',
  RSS_MAX_AGE: '24',
};

export function initializeConfig() {
  for (const [key, value] of Object.entries(config)) {
    if (!getConfig(key)) {
      createConfig({
        name: key,
        value,
      });
    }
  }
}
