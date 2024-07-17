import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../../lib/types";

const logchannel: Command = {
  data: new SlashCommandBuilder()
    .setName("logchannel")
    .setDescription("Commands for the moderation module")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Sets the Log Channel")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("Channel to be set").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("unset").setDescription("Unsets the Log Channel")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;
    let channel = interaction.options.getChannel("channel");
    switch (interaction.options.getSubcommand()) {
      case "set":
        if (!channel || channel.type !== ChannelType.GuildText || !interaction.guildId) return;
        channel = channel as TextChannel;
        if (!client.data.moderation) {
          client.data.moderation = {
            [interaction.guildId]: {
              ["logChannelId"]: channel.id,
            },
          };
        } else if (!client.data.moderation[interaction.guildId]) {
          client.data.moderation[interaction.guildId] = {
            ["logChannelId"]: channel.id,
          };
        } else {
          client.data.moderation[interaction.guildId]["logChannelId"] = channel.id;
        }
        await interaction.reply({
          content: `\`logChannelId\` was successfully assigned to <#${channel.id}>`,
          ephemeral: true,
        });
        await client.write();
        break;
      case "unset":
        if (!interaction.guildId) return;
        if (client.data.moderation[interaction.guildId].logChannelId) {
          delete client.data.moderation[interaction.guildId]["logChannelId"];
          if (
            !client.data.moderation[interaction.guildId] ||
            Object.keys(client.data.moderation[interaction.guildId]).length === 0 ||
            Object.keys(client.data.moderation[interaction.guildId]["modroleIds"]).length === 0
          ) {
            delete client.data.moderation[interaction.guildId];
          }
          if (Object.keys(client.data.moderation).length === 0) {
            client.data.moderation = null;
          }
        }
        await interaction.reply({
          content: `\`logChannelId\` was successfully unset`,
          ephemeral: true,
        });
        await client.write();
        break;
    }
  },
};

export default logchannel;
