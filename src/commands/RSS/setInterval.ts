import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { setPostInterval } from '../..';
import { updateConfig } from '../../data/repositories/configRepository';
import { checkOwnerRole } from '../../utils/checkOwnerRole';

export const data = new SlashCommandBuilder()
  .setName('set-interval')
  .setDescription('Sets the interval between RSS posts in minutes')
  .addIntegerOption((option) =>
    option
      .setName('interval')
      .setDescription('The interval between RSS posts in minutes')
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  try {
    if (!(await checkOwnerRole(interaction))) {
      return await interaction.reply({
        ephemeral: true,
        content: 'You dont have permission to use this command',
      });
    }
    const interval = Number(interaction.options.get('interval')?.value);
    if (!interval || interval <= 0) {
      return await interaction.reply({
        ephemeral: true,
        content: 'Interval entered is invalid',
      });
    }
    updateConfig({
      name: 'RSS_POST_INTERVAL',
      value: String(interval),
    });
    setPostInterval(interval);
    await interaction.reply({
      ephemeral: true,
      content: `RSS post interval set to ${interval} minute(s)`,
    });
  } catch (e) {
    console.error(e);
    await interaction.reply({
      ephemeral: true,
      content: 'Failed to set RSS post interval',
    });
  }
}
