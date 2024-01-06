import { Client, GatewayIntentBits } from 'discord.js';
import { commands, deployCommands } from './commands/commands';
import { sendRSSPost } from './services/RSS/RSS';
import { findConfigByName } from './data/repositories/configRepository';
import { initializeConfig } from './services/config/initializeConfig';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

await initializeConfig();

client.on('ready', async () => {
  await deployCommands();
  console.log(`Logged in as ${client.user?.tag}!`);
  //RSS setup
  console.log('Setting up RSS');
  const postInterval = findConfigByName('RSS_POST_INTERVAL');
  setPostInterval(Number(postInterval));
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

export async function setPostInterval(postInterval: number) {
  const getActiveChannel = async () => {
    const guild = await client.guilds.resolve(process.env.GUILD_ID);
    console.log(`Found guild: ${guild?.name}`);
    const channel = guild?.channels.resolve(process.env.CHANNEL_ID);
    console.log(`Found channel: ${channel?.name}`);
    return channel;
  };

  const channel = await getActiveChannel();
  if (channel?.isTextBased()) {
    // Clear the existing interval if it's set.
    if (postIntervalId !== null) {
      clearInterval(postIntervalId);
    }

    postIntervalId = setInterval(async () => {
      const RSSEnabled = findConfigByName('RSS_ENABLED');
      if (RSSEnabled === 'false') {
        return;
      }
      await sendRSSPost(channel);
    }, 1000 * 60 * postInterval); // Uses the parameter to set interval
  }
}
