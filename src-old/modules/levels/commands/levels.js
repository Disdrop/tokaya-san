import { SlashCommandBuilder, CommandInteraction, User } from "discord.js";
import { Module } from "../../../base/Module.js";

export default {
  data: new SlashCommandBuilder()
    .setName("levels")
    .setDescription("Replies the Top 15 User with!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Shows the current level of a user.")
        .addUserOption((option) => option.setName("member").setDescription("Select a Member."))
    )
    .addSubcommand((subcommand) => subcommand.setName("top").setDescription("Lists the 15 highest level users.")),
  /**
   * @param {Module} module
   * @param {CommandInteraction} interaction
   */
  async execute(module, interaction) {
    if (interaction.options.getSubcommand() === "top") {
      let users = [];
      for (const key in module.data.user) {
        users.push({ id: key, level: module.data.user[key].level, points: module.data.user[key].points });
      }
      users.sort(function (a, b) {
        if (b.level !== a.level) {
          return b.level - a.level;
        }
        return b.points - a.points;
      });
      await interaction.reply({ embeds: [module.embeds.levelsTopEmbed(users)] });
    }
    if (interaction.options.getSubcommand() === "user") {
      const user = interaction.options.data[0].options;
      if (user.length === 0 || interaction.user.id === user[0].user.id) {
        if (!module.data.user.hasOwnProperty(`${interaction.user.id}`)) {
          await interaction.reply({ embeds: [module.embeds.levelsEmbed(interaction.user.id, 1, 0, true)] });
        }
        await interaction.reply({ embeds: [module.embeds.levelsEmbed(interaction.user.id, module.data.user[interaction.user.id].level, module.data.user[interaction.user.id].points, true)] });
      } else {
        if (!module.data.user.hasOwnProperty(`${user[0].user.id}`)) {
          await interaction.reply({ embeds: [module.embeds.levelsEmbed(interaction.user.id, 1, 0, false)] });
        }
        await interaction.reply({ embeds: [module.embeds.levelsEmbed(user[0].user.id, module.data.user[user[0].user.id].level, module.data.user[user[0].user.id].points, false)] });
      }
    }
  },
};
