import {
  ActionRowBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Command } from "../../../lib/types";

const help: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lists all commands with associated descriptions"),
  async execute(client, interaction) {
    const options: StringSelectMenuOptionBuilder[] = [];
    for (const moduleName in client.modules) {
      options.push(
        new StringSelectMenuOptionBuilder()
          .setLabel(moduleName.charAt(0).toUpperCase() + moduleName.slice(1))
          .setValue(moduleName)
      );
    }
    const select = new StringSelectMenuBuilder()
      .setCustomId("helpmoduleselector")
      .setPlaceholder("Select a module!")
      .addOptions(...options);
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
    const msg = await interaction.reply({
      embeds: [client.embeds.help(null, client)],
      components: [row],
      //ephemeral: true,
      fetchReply: true,
    });
    console.log(msg.id, msg.channelId);
  },
};

export default help;
