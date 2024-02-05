import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Module } from "../../../base/Module.js";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
  /**
   * @param {Module} module
   * @param {CommandInteraction} interaction
   */
  async execute(module, interaction) {
    await interaction.reply({ embeds: [module.embeds.pingEmbed()] });
  },
};
