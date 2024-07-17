import { Guild, TextChannel, User } from "discord.js";
import { TokayaClient } from "../../tokaya-client";
import set from "./commands/set";
import pointsOnMessage from "./events/pointsOnMessage";
import pointsOnVoicechat from "./events/pointsOnVoicechat";

function startModule(client: TokayaClient) {
  console.log('Starting "level" module');

  // Resetting cooldowns
  for (const keyi in client.data.guilds) {
    for (const keyj in client.data.guilds[keyi]) {
      if (!client.data.guilds[keyi][keyj].cooldown) continue;
      client.data.guilds[keyi][keyj].cooldown = false;
      client.write();
    }
  }
}

function addPoints(member: User, guild: Guild, client: TokayaClient, points: number) {
  if (!client.config || member.bot) return;
  if (!client.data.guilds) {
    client.data.guilds = {
      [guild.id]: {
        [member.id]: {
          name: member.tag,
          points: points,
          level: 1,
          cooldown: false,
        },
      },
    };
  } else if (!client.data.guilds[guild.id]) {
    client.data.guilds[guild.id] = {
      [member.id]: {
        name: member.tag,
        points: points,
        level: 1,
        cooldown: false,
      },
    };
  } else if (!client.data.guilds[guild.id][member.id]) {
    client.data.guilds[guild.id][member.id] = {
      name: member.tag,
      points: points,
      level: 1,
      cooldown: false,
    };
  } else {
    client.data.guilds[guild.id][member.id].points += points;
  }
  client.write();
  client.modules.level.checkLevelUpdate(member.id, guild, client);
  client.modules.level.cooldown(member.id, guild.id, client);
}

async function cooldown(userId: string, guildId: string, client: TokayaClient) {
  client.data.guilds[guildId][userId].cooldown = true;
  await client.write();
  await new Promise((resolve) => setTimeout(resolve, 10000));
  client.data.guilds[guildId][userId].cooldown = false;
  await client.write();
}

async function checkLevelUpdate(userId: string, guild: Guild, client: TokayaClient) {
  if (!client.config) return;

  // Get XP Limit
  let user = client.data.guilds[guild.id][userId];
  let levelXpLimit = Math.floor(user.level * user.level + 100);

  // Get Level Up Channel
  let member = guild.members.cache.get(userId);
  if (!member) return;
  const channel = client.channels.cache.get(client.data.level[guild.id]["levelUpChannelId"]);

  // Test Level Up
  if (user.points < levelXpLimit || !channel || !(channel instanceof TextChannel)) return;
  user.points -= levelXpLimit;
  user.level++;
  await client.write();
  //channel.send({ content: `<@${userId}>`, embeds: client.embeds.levelUp(user.level) });

  // Test for new Level Role
  if (!client.data.level[guild.id].levelRoles[user.level]) return;
  const newRole = guild.roles.cache.get(client.data.level[guild.id].levelRoles[user.level]);
  if (!newRole) return;
  for (const key in Object.keys(client.data.level[guild.id].levelRoles)) {
    if (!key || key === user.level) continue;
    let oldRole = guild.roles.cache.get(client.data.level[guild.id].levelRoles[key]);
    if (!oldRole) continue;
    await member.roles.remove(oldRole);
  }
  await member.roles.add(newRole);
}

async function voicePoints(member: User, guild: Guild, channelId: string, client: TokayaClient) {
  if (
    !client.data.level ||
    !client.data.level[guild.id] ||
    !client.data.level[guild.id].voiceChannels ||
    !client.data.level[guild.id].voiceChannels[channelId]
  )
    return;
  for (let dataUserId of client.data.level[guild.id].voiceChannels[channelId]) {
    if (dataUserId === member.id) {
      let multiplyer =
        client.data.level[guild.id].voiceChannels[channelId].length > 5
          ? 5
          : client.data.level[guild.id].voiceChannels[channelId].length;
      client.modules.level.addPoints(member, guild, client, 5 * multiplyer);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await client.modules.level.voicePoints(member, guild, channelId, client);
    }
  }
}

const level = {
  title: "Level",
  discription: 'The "Level" module contains basic commands for general information and assistance.',
  commands: {
    set,
  },
  events: {
    pointsOnMessage,
    pointsOnVoicechat,
  },
  startModule,
  addPoints,
  cooldown,
  checkLevelUpdate,
  voicePoints,
};

export default level;
