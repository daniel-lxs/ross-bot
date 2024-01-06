import { REST, Routes } from 'discord.js';
import * as ping from './utility/ping';
import * as setInterval from './RSS/setInterval';
import * as setEnabled from './RSS/setEnabled';
import * as listFeeds from './RSS/listFeeds';
import * as addFeed from './RSS/addFeed';
import * as deleteFeed from './RSS/deleteFeed';
import * as setMaxAge from './RSS/setMaxAge';

export const commands = {
  ping,
  [listFeeds.data.name]: listFeeds,
  [addFeed.data.name]: addFeed,
  [deleteFeed.data.name]: deleteFeed,
  [setInterval.data.name]: setInterval,
  [setEnabled.data.name]: setEnabled,
  [setMaxAge.data.name]: setMaxAge,
};

export async function deployCommands() {
  const commandData = Object.values(commands).map((command) => command.data);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commandData,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}
