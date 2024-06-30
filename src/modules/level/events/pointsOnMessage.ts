import { ActivityType, ChannelType, Events } from "discord.js";
import { BotEvent } from "../../../lib/types";

const pointsOnMessage: BotEvent = {
  async eventFunction(client) {
    client.on(Events.MessageCreate, (message) => {
      if (!message.guild) return;
      client.modules.level.addPoints(message.author, message.guild, client, 10);
    });
  },
};

export default pointsOnMessage;
