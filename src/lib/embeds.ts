import { Guild, GuildMember, SlashCommandSubcommandBuilder, User } from "discord.js";
import { TokayaClient } from "../tokaya-client";
import { Command, Field, generalHelpProps } from "./types";

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
      const command = commands[commandName as keyof typeof commands] as Command;
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
  let banner = {
    color: user?.accentColor ? user?.accentColor : 0x5865f2,
    description: "",
    image: {
      url: user.bannerURL({ extension: "webp", size: 4096 }) as string,
    },
  };
  if (member) {
    console.log(member.roles.cache.map((role) => role).length);
    let rolesString = member?.roles.cache
      .map((role) => {
        return { id: `    - <@&${role.id}>\n`, position: role.position };
      })
      .sort((a, b) => {
        return b.position - a.position;
      })
      .map((role) => role.id);
    rolesString.pop();
    let roles = rolesString.join("");
    let info = {
      color: user?.accentColor ? user?.accentColor : 0x5865f2,
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
      - Created: **<t:${Math.round(user.createdTimestamp / 1000)}>**
      - Roles
      ${roles}`,
      thumbnail: {
        url: member.avatarURL({ extension: "webp" })
          ? (member.avatarURL({ extension: "webp" }) as string)
          : (user.avatarURL({ extension: "webp" }) as string),
      },
      image: {
        url: emptyImgUrl,
      },
    };
    if (user.bannerURL({ extension: "webp", size: 4096 })) {
      return [banner, info];
    }
    return [info];
  }
  let info = {
    color: user?.accentColor ? user?.accentColor : 0x5865f2,
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
  };
  if (user.bannerURL({ extension: "webp", size: 4096 })) {
    return [banner, info];
  }
  return [info];
}

async function generalInfoServer(guild: Guild, client: TokayaClient) {
  let info = {
    color: 0x5865f2,
    description: `# Server "${guild.name}"
      - Server Owner: <@${(await guild.fetchOwner()).id}>`,
    thumbnail: {
      url: guild.iconURL({ extension: "webp" }) as string,
    },
    image: {
      url: emptyImgUrl,
    },
  };
  if (guild.bannerURL({ extension: "webp", size: 4096 })) {
    return [
      {
        color: 0x5865f2,
        description: "",
        image: {
          url: guild.bannerURL({ extension: "webp", size: 4096 }) as string,
        },
      },
      info,
    ];
  }
  return [info];
}

function welcomeChannel(member: GuildMember, client: TokayaClient) {
  return [
    {
      color: 0xfee75c,
      description: `# Willkommen <@${member.id}>\nWir freuen uns, dass du deinen Weg hier her gefunden hast ^^`,
      thumbnail: {
        url: member.user.avatarURL({ extension: "webp" }) as string,
      },
    },
  ];
}

function welcomeChannelMain(member: GuildMember, client: TokayaClient) {
  const messages = [
    `Truck-kun hat <@${member.id}> hierher isekai'd!`,
    `Willkommen, <@${member.id}>! Möge dein Abenteuer beginnen!`,
    `<@${member.id}> ist in diese Welt teleportiert worden!`,
    `<@${member.id}> hat den Server mit einem epischen Eintritt betreten!`,
    `Senpai <@${member.id}> ist jetzt hier!`,
    `Ohayou <@${member.id}>! Mach es dir bequem!`,
    `<@${member.id}> wurde von einem Zauber hierher beschworen!`,
    `<@${member.id}> ist durch ein Portal hierher gelangt!`,
    `<@${member.id}> wurde von einer mysteriösen Kraft hergebracht!`,
    `<@${member.id}> scheint Interesse an deiner Mutter zu haben!`,
    `Willkommen, <@${member.id}>! Keine Sorge, die Todesfälle hier sind rein virtuell.`,
    `<@${member.id}> ist gerade beigetreten. Mal sehen, wie lange du überlebst.`,
    `Hallo <@${member.id}>! Vorsicht vor fliegenden Trucks.`,
    `Willkommen an Bord, <@${member.id}>! Unser letzter Held... naja, du machst das schon besser.`,
    `Servus <@${member.id}>! Bereit, deine 99 Leben zu verlieren?`,
    `Hey <@${member.id}>, willkommen in unserer Community! Ignorier die Geister, die sind harmlos.`,
    `Ahoy <@${member.id}>! Wir hoffen du ertrinkst uns nicht wie der vor dir.`,
  ];
  return [
    {
      color: 0xfee75c,
      description: `**${
        messages[Math.floor(Math.random() * messages.length)]
      }**\n\nErfahre mehr über den Server und passe deine Rollen an:\n- <id:home>\n- <id:customize>`,
      thumbnail: {
        url: member.user.avatarURL({ extension: "webp" }) as string,
      },
    },
  ];
}

function levelUp(level: string) {
  return [
    {
      color: 0xffda47,
      description: `Herzlichen Glückwunsch, du hast Level ${level} erreicht!`,
    },
  ];
}

export const embeds = {
  generalHelp,
  generalInfoUser,
  generalInfoServer,
  welcomeChannel,
  welcomeChannelMain,
  levelUp,
};
