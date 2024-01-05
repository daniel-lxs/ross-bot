import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { checkOwnerRole } from '../../utils/checkOwnerRole';
import { addFeed } from '../../services/RSS/RSS';

export const data = new SlashCommandBuilder()
  .setName('add-feed')
  .setDescription('Adds a RSS feed')
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('The name of the RSS feed')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('url')
      .setDescription('The URL of the RSS feed')
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
    const url = interaction.options.get('url')?.value as string;

    await addFeed(name, url);

    interaction.reply({
      ephemeral: true,
      content: 'RSS feed added',
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      ephemeral: true,
      content: 'Failed to add RSS feed',
    });
  }
}
