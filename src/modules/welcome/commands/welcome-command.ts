import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../../lib/types";

const welcome: Command = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Settings for the welcome module")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Info about a user")
        .addStringOption((option) =>
          option
            .setName("channeltype")
            .setDescription("Channel type to be set")
            .setRequired(true)
            .setChoices(
              { name: "Welcome Channel", value: "welcomeChannel" },
              { name: "Main Channel", value: "mainChannel" }
            )
        )
        .addChannelOption((option) =>
          option.setName("channel").setDescription("Channel to be set").setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;
    switch (interaction.options.getSubcommand()) {
      case "set":
        let channel = interaction.options.getChannel("channel");
        let channelType = interaction.options.getString("channeltype");
        if (
          !channel ||
          channel.type !== ChannelType.GuildText ||
          !channelType ||
          !interaction.guildId
        )
          return;
        channel = channel as TextChannel;
        if (!client.data.welcome) {
          client.data.welcome = {
            [interaction.guildId]: {
              [channelType + "Id"]: channel.id,
            },
          };
        } else if (!client.data.welcome[interaction.guildId]) {
          client.data.welcome[interaction.guildId] = {
            [channelType + "Id"]: channel.id,
          };
        } else {
          client.data.welcome[interaction.guildId][channelType + "Id"] = channel.id;
        }
        await interaction.reply({
          content: `\`${channelType}Id\` was successfully assigned to <#${channel.id}>`,
          ephemeral: true,
        });
        client.write();
        break;
    }
  },
};

export default welcome;
