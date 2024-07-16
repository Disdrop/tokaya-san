import {
  ChannelType,
  Guild,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Command } from "../../../lib/types";

const set: Command = {
  data: new SlashCommandBuilder()
    .setName("levelset")
    .setDescription("Settings for the level module")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("levelupchannel")
        .setDescription("Sets the Level Up Channel")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("Channel to be set").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("levelrole")
        .setDescription("Sets a Level Role")
        .addNumberOption((option) =>
          option.setName("level").setDescription("Level for the Levelrole").setRequired(true)
        )
        .addRoleOption((role) =>
          role.setName("levelrole").setDescription("The Role tha").setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(client, interaction) {
    switch (interaction.options.getSubcommand()) {
      case "levelupchannel":
        let levelUpChannel = interaction.options.getChannel("channel");
        if (
          !levelUpChannel ||
          levelUpChannel.type !== ChannelType.GuildText ||
          !interaction.guildId
        )
          return;
        levelUpChannel = levelUpChannel as TextChannel;
        if (!client.data.level) {
          client.data.level = {
            [interaction.guildId]: {
              ["levelUpChannelId"]: levelUpChannel.id,
            },
          };
        } else if (!client.data.level[interaction.guildId]) {
          client.data.level[interaction.guildId] = {
            ["levelUpChannelId"]: levelUpChannel.id,
          };
        } else {
          client.data.level[interaction.guildId]["levelUpChannelId"] = levelUpChannel.id;
        }
        await interaction.reply({
          content: `\`levelUpChannelId\` was successfully assigned to <#${levelUpChannel.id}>`,
          ephemeral: true,
        });
        client.write();
        break;
      case "levelrole":
        let level = interaction.options.getNumber("level");
        let role = interaction.options.getRole("levelrole");
        console.log(level, role);
        if (!level || !role || !(role instanceof Role) || !interaction.guildId) return;
        console.log(level, role);
        if (!client.data.level) {
          client.data.level = {
            [interaction.guildId]: {
              levelRoles: [{ level: level, roleId: role.id }],
            },
          };
        } else if (!client.data.level[interaction.guildId]) {
          client.data.level[interaction.guildId] = {
            levelRoles: { [level]: role.id },
          };
        } else if (!client.data.level[interaction.guildId].levelRoles) {
          client.data.level[interaction.guildId].levelRoles = {
            [level]: role.id,
          };
        } else {
          client.data.level[interaction.guildId].levelRoles[level] = role.id;
        }
        await interaction.reply({
          content: `Level \`${level}\` was successfully assigned to <@&${role.id}>`,
          ephemeral: true,
        });
        client.write();
    }
  },
};

export default set;
