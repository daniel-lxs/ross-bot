import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import {
  getConfig,
  updateConfig,
} from '../../data/repositories/configRepository';
import { checkOwnerRole } from '../../utils/checkOwnerRole';

export const data = new SlashCommandBuilder()
  .setName('set-enabled')
  .setDescription('Enables or disables RSS posts');

export async function execute(interaction: CommandInteraction) {
  if (!(await checkOwnerRole(interaction))) {
    return await interaction.reply({
      ephemeral: true,
      content: 'You dont have permission to use this command',
    });
  }
  const rssEnabled = getConfig('RSS_ENABLED');
  const newRssEnabled = rssEnabled === 'true' ? 'false' : 'true';

  updateConfig({
    name: 'RSS_ENABLED',
    value: newRssEnabled,
  });

  const message = `RSS posts are ${
    newRssEnabled === 'true' ? 'enabled' : 'disabled'
  }`;

  interaction.reply({
    content: message,
    ephemeral: true,
  });
}
