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
          .setLabel(client.modules[moduleName as keyof typeof client.modules].title)
          .setValue(moduleName)
      );
    }
    const select = new StringSelectMenuBuilder()
      .setCustomId("helpmoduleselector")
      .setPlaceholder("Select a module!")
      .addOptions(...options);
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
    const msg = await interaction.reply({
      embeds: [client.embeds.generalHelp(null, client)],
      components: [row],
      fetchReply: true,
    });
    console.log(msg.channelId, msg.id);
  },
};

export default help;
