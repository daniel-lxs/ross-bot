import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { deleteFeed } from '../../services/RSS/RSS';
import { checkOwnerRole } from '../../utils/checkOwnerRole';

export const data = new SlashCommandBuilder()
  .setName('delete-feed')
  .setDescription('Deletes a RSS feed')
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('The name of the RSS feed')
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
    const name = interaction.options.get('name')?.value as string;
    await deleteFeed(name);
    interaction.reply({
      ephemeral: true,
      content: 'RSS feed deleted',
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      ephemeral: true,
      content: 'Failed to delete RSS feed',
    });
  }
}
