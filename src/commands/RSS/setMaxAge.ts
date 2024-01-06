import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { updateConfig } from '../../data/repositories/configRepository';
import { checkOwnerRole } from '../../utils/checkOwnerRole';

export const data = new SlashCommandBuilder()
  .setName('set-max-age')
  .setDescription('Sets the maximum age of articles in hours')
  .addIntegerOption((option) =>
    option
      .setName('max-age')
      .setDescription('The maximum age of articles in hours')
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
    const maxAge = Number(interaction.options.get('max-age')?.value);
    if (!maxAge || maxAge <= 0) {
      return await interaction.reply({
        ephemeral: true,
        content: 'Max age entered is invalid',
      });
    }
    updateConfig({
      name: 'RSS_MAX_AGE',
      value: String(maxAge),
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      ephemeral: true,
      content: 'Failed to set max age',
    });
  }
}
