import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../../lib/types";

const ping: Command = {
  moduleName: "general",
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
  async execute(client, interaction) {
    await interaction.reply("Pong!");
  },
};

export default ping;
