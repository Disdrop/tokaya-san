import { Guild, TextChannel, User } from "discord.js";
import { TokayaClient } from "../../tokaya-client";
import pointsOnMessage from "./events/pointsOnMessage";

function startModule(client: TokayaClient) {
  console.log('Starting "level" module');
}

function addPoints(member: User, guild: Guild, client: TokayaClient, points: number) {
  if (!client.config) return;
  if (!client.data.guilds) {
    client.data.guilds = {
      [guild.id]: {
        [member.id]: {
          name: member.tag,
          points: points,
        },
      },
    };
  } else if (!client.data.guilds[guild.id]) {
    client.data.guilds[guild.id] = {
      [member.id]: {
        name: member.tag,
        points: points,
      },
    };
  } else if (!client.data.guilds[guild.id][member.id]) {
    client.data.guilds[guild.id][member.id] = {
      name: member.tag,
      points: points,
    };
  } else {
    client.data.guilds[guild.id][member.id].points += points;
  }
  client.write();
}

function checkLevelUpdate(userId: string, guild: Guild, client: TokayaClient) {
  if (!client.config) return;
  if (true) {
    let user = client.data.guilds[guild.id][userId];
    let levelXpLimit = Math.floor(user.level * user.level + 100);
    const channel = guild.channels.cache.get(client.data.level.levelUpChannelID);
    if (user.points < levelXpLimit || !channel || !(channel instanceof TextChannel)) return;
    user.points -= levelXpLimit;
    user.level++;
    client.write();
    channel.send({ content: `<@${userId}>`, embeds: client.embeds.levelUp(user.level) });

    if (user.level % 10 !== 0 || user.level / 10 >= client.data.level.levelRoleIDs.length) return;
    const member = guild.members.cache.get(userId);
    const newRole = guild.roles.cache.get(client.data.level.levelRoleIDs[user.level / 10]);
    const oldRole = guild.roles.cache.get(client.data.level.levelRoleIDs[user.level / 10 - 1]);
    if (!member || !newRole || !oldRole) return;
    member.roles.add(newRole);
    member.roles.remove(oldRole);
  }
}

const level = {
  title: "Level",
  discription: 'The "Level" module contains basic commands for general information and assistance.',
  commands: {},
  events: {
    pointsOnMessage,
  },
  startModule,
  addPoints,
};

export default level;
