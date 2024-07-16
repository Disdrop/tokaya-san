import {
  GuildMember,
  SlashCommandBuilder,
  APIInteractionDataResolvedGuildMember,
} from "discord.js";
import { Command } from "../../../lib/types";

const info: Command = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get info about a user or a server!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Info about a user")
        .addUserOption((option) => option.setName("user").setDescription("The user"))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("server").setDescription("Info about the server")
    ),
  async execute(client, interaction) {
    switch (interaction.options.getSubcommand()) {
      case "user":
        const user = await interaction.options.getUser("user")?.fetch();
        if (user) {
          interaction.reply({
            embeds: await client.embeds.generalInfoUser(user, client),
            fetchReply: true,
          });
          return;
        }
        interaction.reply({
          embeds: await client.embeds.generalInfoUser(await interaction.user.fetch(), client),
          fetchReply: true,
        });
        break;
      case "server":
        if (!interaction.guild) return;
        interaction.reply({
          embeds: await client.embeds.generalInfoServer(await interaction.guild.fetch(), client),
          fetchReply: true,
        });
        break;
    }
  },
};

export default info;
