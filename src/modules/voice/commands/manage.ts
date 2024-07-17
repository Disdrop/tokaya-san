import { Command } from "../../../lib/types";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";

export const voiceCommand: Command = {
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
    ),
  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();
    const subcommandGroup = interaction.options.getSubcommandGroup();

    if (!interaction.member) return;

    const member = interaction.member as GuildMember;

    const currentChannel = member?.voice.channel;

    const adminsOfCurrentChannel = new Array<string>();
    const ownersOfCurrentChannel = new Array<string>();

    if (!client.data.voice.admin) {
      client.data.voice.admin = {
        channels: {},
        users: {},
      };
    }

    if (!client.data.voice.owner) {
      client.data.voice.owner = {
        channels: {},
        users: {},
      };
    }

    if (currentChannel) {
      const adminsOfCurrentChannel = client.data.voice.admin.channels[currentChannel?.id] || [];
      const ownersOfCurrentChannel = client.data.voice.owner.channels[currentChannel?.id] || [];
    }

    const isAdminOfCurrentChannel = adminsOfCurrentChannel.includes(member.id);
    const isOwnerOfCurrentChannel = ownersOfCurrentChannel.includes(member.id);

    const user = interaction.options.getUser("user")!;

    switch (subcommandGroup) {
      case "admin":
        if (!currentChannel) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "You are not in a voice channel"),
            ephemeral: true,
          });
          return;
        }

        if (!isOwnerOfCurrentChannel) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "You are not the owner of this voice channel"),
            ephemeral: true,
          });
          return;
        }

        switch (subcommand) {
          case "set":
            if (adminsOfCurrentChannel.includes(user.id)) {
              await interaction.reply({
                embeds: client.embeds.error("Voice", "User is already an admin"),
                ephemeral: true,
              });
              return;
            }

            client.data.voice.admin.channels[currentChannel.id] = adminsOfCurrentChannel;

            await interaction.reply({
              embeds: client.embeds.success("Voice", `Added ${user} as an admin`),
              ephemeral: true,
            });
            break;
          case "remove":
            if (!adminsOfCurrentChannel.includes(user.id)) {
              await interaction.reply({
                embeds: client.embeds.error("Voice", "User is not an admin"),
                ephemeral: true,
              });
              return;
            }

            const index = adminsOfCurrentChannel.indexOf(user.id);
            adminsOfCurrentChannel.splice(index, 1);

            client.data.voice.admin.channels[currentChannel.id] = adminsOfCurrentChannel;

            await interaction.reply({
              embeds: client.embeds.success("Voice", `Removed ${user} as an admin`),
              ephemeral: true,
            });
            break;
        }
        break;
      case "whitelist":
        if (!currentChannel) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "You are not in a voice channel"),
            ephemeral: true,
          });
          return;
        }

        if (!isAdminOfCurrentChannel) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "You are not an admin of this voice channel"),
            ephemeral: true,
          });
          return;
        }

        switch (subcommand) {
          case "toggle":
            const memberOfChannel = currentChannel.members
              .filter((member) => !member.user.bot)
              .map((member) => member);

            for (const member1 of memberOfChannel) {
              await currentChannel.permissionOverwrites.edit(member1, {
                Connect: true,
              });
            }

            await currentChannel.permissionOverwrites.edit(member.guild.roles.everyone, {
              Connect: false,
            });
            break;
          case "add":
            await currentChannel.permissionOverwrites.edit(user, {
              Connect: true,
            });
            break;
          case "remove":
            await currentChannel.permissionOverwrites.edit(user, {
              Connect: false,
            });
            break;
        }
        break;
      case "kick":
        if (!currentChannel) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "You are not in a voice channel"),
            ephemeral: true,
          });
          return;
        }

        if (!isAdminOfCurrentChannel) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "You are not an admin of this voice channel"),
            ephemeral: true,
          });
          return;
        }

        if (!currentChannel.members.has(user.id)) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "User is not in the voice channel"),
            ephemeral: true,
          });
          return;
        }

        const memberToKick = currentChannel.members.get(user.id);
        await memberToKick?.voice.setChannel(null);
        break;
      case "ban":
        if (!currentChannel) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "You are not in a voice channel"),
            ephemeral: true,
          });
          return;
        }

        if (!isAdminOfCurrentChannel) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "You are not an admin of this voice channel"),
            ephemeral: true,
          });
          return;
        }

        await currentChannel.permissionOverwrites.edit(user, {
          Connect: false,
        });

        if (currentChannel.members.has(user.id)) {
          const memberToBan = currentChannel.members.get(user.id);
          await memberToBan?.voice.setChannel(null);
        }

        await interaction.reply({
          embeds: client.embeds.success("Voice", `Banned ${user} from the voice channel`),
          ephemeral: true,
        });

        break;
      // case "tempban":
      //   break;
      case "unban":
        if (!currentChannel) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "You are not in a voice channel"),
            ephemeral: true,
          });
          return;
        }

        if (!isAdminOfCurrentChannel) {
          await interaction.reply({
            embeds: client.embeds.error("Voice", "You are not an admin of this voice channel"),
            ephemeral: true,
          });
          return;
        }

        await currentChannel.permissionOverwrites.edit(user, {
          Connect: true,
        });

        await interaction.reply({
          embeds: client.embeds.success("Voice", `Unbanned ${user} from the voice channel`),
          ephemeral: true,
        });
        break;
    }
  },
};

//Admin only permmision
export const voiceManagerCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("voicemanager")
    .setDescription("manage voice channels")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("set")
        .setDescription("set voice channel")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("channel").setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("unset")
        .setDescription("unset voice channel")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("channel").setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("voicename")
        .setDescription("set voice channel name")
        .addStringOption((option) =>
          option.setName("name").setDescription("name").setRequired(true)
        )
    ),
  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!client.data.voice.manager) {
      client.data.voice.manager = {
        channels: {},
        name: "Voice Channel",
      };
      await client.write();
    }

    switch (subcommand) {
      case "set":
        const channel = interaction.options.getChannel("channel")!;
        client.data.voice.manager.channels[channel.id] = true;
        await client.write();
        await interaction.reply({
          embeds: client.embeds.success("Voice", `Set ${channel} as a voice channel`),
          ephemeral: true,
        });
        break;
      case "unset":
        const channelToUnset = interaction.options.getChannel("channel")!;
        delete client.data.voice.manager.channels[channelToUnset.id];
        await client.write();
        await interaction.reply({
          embeds: client.embeds.success("Voice", `Unset ${channelToUnset} as a voice channel`),
          ephemeral: true,
        });
        break;
      case "voicename":
        const name = interaction.options.getString("name")!;
        client.data.voice.manager.name = name;
        await client.write();
        await interaction.reply({
          embeds: client.embeds.success("Voice", `Set voice channel name to ${name}`),
          ephemeral: true,
        });

        break;
    }
  },
};
