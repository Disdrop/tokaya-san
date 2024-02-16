import { ActivityType, Events, SlashCommandBuilder } from "discord.js";
import { BotEvent, Command } from "../../../lib/types";

const ready: BotEvent = {
  async eventFunction(client) {
    client.on(Events.ClientReady, () => {
      if (!client.user) return;
      console.log(`[Discord] Online als ${client.user.tag}`);
      (async () => {
        const guild = client.guilds.cache.get(client.config!.serverId);
        if (!guild) return;
        setInterval(() => {
          if (!client.user) return;
          client.user.setActivity(`${guild.memberCount} User`, { type: ActivityType.Listening });
        }, 50000);
      })();
    });
  },
};

export default ready;
