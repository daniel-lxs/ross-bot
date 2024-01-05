import type { CommandInteraction } from 'discord.js';

export async function checkOwnerRole(interaction: CommandInteraction) {
  const member = await interaction.guild?.members.fetch(interaction.user.id);
  const roles = member?.roles.cache;
  if (!roles) {
    return false;
  }
  return roles.has(process.env.OWNER_ROLE_ID);
}
