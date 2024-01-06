import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { getRSSFeeds } from '../../services/RSS/RSS';

export const data = new SlashCommandBuilder()
  .setName('list-feeds')
  .setDescription('Lists all RSS feeds');

export async function execute(interaction: CommandInteraction) {
  const feeds = await getRSSFeeds();
  interaction.reply({
    content: feeds.feeds.map((feed) => feed.name).join('\n'),
    ephemeral: true,
  });
}
