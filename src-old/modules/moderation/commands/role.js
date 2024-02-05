import { SlashCommandBuilder, CommandInteraction, Role } from "discord.js";
import { Module } from "../../../base/Module.js";

export default {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Replies with Pong!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("removeall")
        .setDescription("Removes a role from all members.")
        .addRoleOption((option) => option.setName("role").setRequired(true).setDescription("Select a role."))
    ),
  /**
   * @param {Module} module
   * @param {CommandInteraction} interaction
   */
  async execute(module, interaction) {
    if (interaction.options.getSubcommand() === "removeall") {
      /**
       * @type {Role} role
       */
      await interaction.reply("...");
      const role = interaction.options.data[0].options[0].role;
      role.guild.members.fetch().then(async (members) => {
        const roleMembers = members.filter((member) => member.roles.cache.some((userRole) => userRole.id === role.id));
        let count = roleMembers.size;
        for (const member of roleMembers) {
          await interaction.editReply({ embeds: [module.embeds.roleRemoveAllStatusEmbed(role.id, count)] });
          member[1].roles.remove(role);
          count--;
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        await interaction.editReply({ embeds: [module.embeds.roleRemoveAllEmbed(role.id)] });
      });
    }
  },
};
