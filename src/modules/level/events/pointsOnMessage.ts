import { ActivityType, ChannelType, Events } from "discord.js";
import { BotEvent } from "../../../lib/types";

const pointsOnMessage: BotEvent = {
  async eventFunction(client) {
    client.on(Events.MessageCreate, (message) => {
      if (!message.guild) return;

      if (
        client.data.guilds &&
        client.data.guilds[message.guild.id] &&
        client.data.guilds[message.guild.id][message.author.id]
      ) {
        if (client.data.guilds[message.guild.id][message.author.id].cooldown) return;
      }
      client.modules.level.addPoints(message.author, message.guild, client, 10);
    });
  },
};

export default pointsOnMessage;
