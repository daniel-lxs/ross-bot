import { Client, GatewayIntentBits } from 'discord.js';
import { commands, deployCommands } from './commands/commands';
import { sendRSSPost } from './services/RSS/RSS';
import { getConfig } from './data/repositories/configRepository';
import { initializeConfig } from './services/config/initializeConfig';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

await initializeConfig();

client.on('ready', async () => {
  await deployCommands();
  console.log(`Logged in as ${client.user?.tag}!`);

  // RSS setup
  console.log('Setting up RSS');
  const rssPostInterval = getConfig('RSS_POST_INTERVAL');
  setPostInterval(Number(rssPostInterval));
  console.log('RSS setup complete');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;
  const command = commands[commandName as keyof typeof commands];
  if (command) {
    command.execute(interaction);
  }
});

client.login(process.env.TOKEN);

let postIntervalId: NodeJS.Timeout | null = null;

export async function setPostInterval(rssPostInterval: number) {
  const getActiveChannel = async () => {
    const guild = await client.guilds.resolve(process.env.GUILD_ID);
    if (!guild) {
      throw new Error('Guild not found');
    }
    const channel = guild?.channels.resolve(process.env.CHANNEL_ID);
    if (!channel) {
    }
    return channel;
  };

  const channel = await getActiveChannel();
  if (channel?.isTextBased()) {
    // Clear the existing interval if it's set.
    if (postIntervalId !== null) {
      clearInterval(postIntervalId);
    }

    postIntervalId = setInterval(async () => {
      const isRSSEnabled = getConfig('RSS_ENABLED');
      if (isRSSEnabled === 'false') {
        return;
      }
      await sendRSSPost(channel);
    }, 1000 * 60 * rssPostInterval);
  }
}

Bun.serve({
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  fetch: (req) => {
    if (req.method === 'GET' && req.url === '/health') {
      return new Response('OK', { status: 200 });
    }
    return new Response('Not found', { status: 404 });
  },
});
