import { Command } from "../../../lib/types";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

const voiceCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("voice")
    .setDescription("manage your Voice Channel")
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName("admin")
        .setDescription("add or remove admin")
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("set")
            .setDescription("set admin")
            .addUserOption((option) =>
              option.setName("user").setDescription("user").setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("remove")
            .setDescription("remove admin")
            .addUserOption((option) =>
              option.setName("user").setDescription("user").setRequired(true)
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("kick")
        .setDescription("kick user from voice channel")
        .addUserOption((option) => option.setName("user").setDescription("user").setRequired(true))
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("ban")
        .setDescription("ban user from voice channel")
        .addUserOption((option) => option.setName("user").setDescription("user").setRequired(true))
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("tempban")
        .setDescription("tempban user from voice channel")
        .addUserOption((option) => option.setName("user").setDescription("user").setRequired(true))
        .addIntegerOption((option) =>
          option.setName("time").setDescription("time").setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("unban")
        .setDescription("unban user from voice channel")
        .addUserOption((option) => option.setName("user").setDescription("user").setRequired(true))
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName("whitelist")
        .setDescription("toggle, add or remove whitelist")
        .addSubcommand(
          new SlashCommandSubcommandBuilder().setName("toggle").setDescription("toggle whitelist")
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("add")
            .setDescription("add user to whitelist")
            .addUserOption((option) =>
              option.setName("user").setDescription("user").setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("remove")
            .setDescription("remove user from whitelist")
            .addUserOption((option) =>
              option.setName("user").setDescription("user").setRequired(true)
            )
        )
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName("manager")
        .setDescription("set or unset manager")
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("set")
            .setDescription("set manager")
            .addUserOption((option) =>
              option.setName("user").setDescription("user").setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("unset")
            .setDescription("unset manager")
            .addUserOption((option) =>
              option.setName("user").setDescription("user").setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("voicename")
            .setDescription("set voice name")
            .addStringOption((option) =>
              option.setName("name").setDescription("name").setRequired(true)
            )
        )
    ),

  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();
  },
};
