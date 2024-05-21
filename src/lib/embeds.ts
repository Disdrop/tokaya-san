import { SlashCommandSubcommandBuilder, User } from "discord.js";
import { TokayaClient } from "../tokaya-client";
import { Field, generalHelpProps } from "./types";

const emptyImgUrl = "https://iili.io/JiC00TF.png";

// General
function generalHelp(data: generalHelpProps, client: TokayaClient) {
  if (!data)
    return {
      color: 0x5865f2,
      description: "# Help\nUse the selectmenu and choose a module.",
      image: {
        url: emptyImgUrl,
      },
    };
  const commands = client.modules[data.name.toLowerCase() as keyof typeof client.modules].commands;
  const fields: Field[] = [];
  for (const commandName in commands) {
    if (commandName in commands) {
      const command = commands[commandName as keyof typeof commands];
      const slashCommands = command.data.options.filter(
        (option) => option instanceof SlashCommandSubcommandBuilder
      );
      if (slashCommands.length === 0) {
        fields.push({
          name: `\`/${command.data.name}\``,
          value: command.data.description,
          inline: false,
        });
      } else {
        slashCommands.forEach((slashCommand) => {
          fields.push({
            name: `\`/${command.data.name} ${slashCommand["name" as keyof typeof slashCommand]}\``,
            value: `${slashCommand["description" as keyof typeof slashCommand]}`,
            inline: false,
          });
        });
      }
    }
  }
  return {
    color: 0x5865f2,
    description: `# Help for "${data.name}" module\n${data.discription}`,
    fields: fields,
    image: {
      url: emptyImgUrl,
    },
  };
}

async function generalInfoUser(user: User, client: TokayaClient) {
  const member = client.guilds.cache.get(client.config!.serverId)?.members.cache.get(user.id);
  if (member) {
    return [
      {
        color: 0x5865f2,
        description: "",
        image: {
          url: user.bannerURL({ extension: "webp", size: 4096 }) as string,
        },
      },
      {
        color: 0x5865f2,
        description: `# User <@${user.id}>
      - Displayname: **\`${user.displayName}\`**
      - Username: **\`${user.tag}\`**
      - Nickname: **\`${member.nickname ? member.nickname : "`-`"}\`**
      - User ID: **\`${user.id}\`**
      - Is member: **${member.joinedTimestamp ? "`yes`" : "`no`"}**
      - User type: **${member.user.bot ? "`Bot" : "`User"}${
          (await member.guild.fetchOwner()).id === member.id ? " (Server Owner)`" : "`"
        }**
      - Global avatar: **${
        user.avatarURL({ extension: "webp", size: 1024 })
          ? "[gif](" +
            user.avatarURL({ extension: "gif", size: 1024 }) +
            ") / [png](" +
            user.avatarURL({ extension: "png", size: 1024 }) +
            ")"
          : "`-`"
      }**
      - Server avatar: **${
        member.avatarURL({ extension: "webp", size: 1024 })
          ? "[gif](" +
            member.avatarURL({ extension: "gif", size: 1024 }) +
            ") / [png](" +
            member.avatarURL({ extension: "png", size: 1024 }) +
            ")"
          : "`-`"
      }**
      - Global banner: **${
        user.bannerURL({ extension: "webp", size: 4096 })
          ? "[gif](" +
            user.bannerURL({ extension: "gif", size: 4096 }) +
            ") / [png](" +
            user.bannerURL({ extension: "png", size: 4096 }) +
            ")"
          : "`-`"
      }**
      - Joined: **${
        member.joinedTimestamp ? `<t:${Math.round(member.joinedTimestamp / 1000)}>` : "`-`"
      }**
      - Created: **<t:${Math.round(user.createdTimestamp / 1000)}>**`,
        thumbnail: {
          url: member.avatarURL({ extension: "webp" })
            ? (member.avatarURL({ extension: "webp" }) as string)
            : (user.avatarURL({ extension: "webp" }) as string),
        },
        image: {
          url: emptyImgUrl,
        },
      },
    ];
  }
  return [
    {
      color: 0x5865f2,
      description: "",
      image: {
        url: user.bannerURL({ extension: "webp", size: 4096 }) as string,
      },
    },
    {
      color: 0x5865f2,
      description: `# User <@${user.id}>
    - Displayname: **\`${user.displayName}\`**
    - Username: **\`${user.tag}\`**
    - Nickname: **\`-\`**
    - User ID: **\`${user.id}\`**
    - Is member: **\`no\`**
    - User type: **${user.bot ? "`Bot`" : "`User`"}**
    - Global avatar: **${
      user.avatarURL({ extension: "webp", size: 1024 })
        ? "[gif](" +
          user.avatarURL({ extension: "gif", size: 1024 }) +
          ") / [png](" +
          user.avatarURL({ extension: "png", size: 1024 }) +
          ")"
        : "`-`"
    }**
    - Server avatar: **\`-\`**
    - Global banner: **${
      user.bannerURL({ extension: "webp", size: 4096 })
        ? "[gif](" +
          user.bannerURL({ extension: "gif", size: 4096 }) +
          ") / [png](" +
          user.bannerURL({ extension: "png", size: 4096 }) +
          ")"
        : "`-`"
    }**
    - Joined: **\`-\`**
    - Created: **<t:${Math.round(user.createdTimestamp / 1000)}>**`,
      thumbnail: {
        url: user.avatarURL({ extension: "webp" }) as string,
      },
      image: {
        url: emptyImgUrl,
      },
    },
  ];
}

export const embeds = { generalHelp, generalInfoUser };
