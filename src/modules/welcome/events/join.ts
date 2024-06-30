import { ActivityType, ChannelType, Events } from "discord.js";
import { BotEvent } from "../../../lib/types";

const join: BotEvent = {
  async eventFunction(client) {
    client.on(Events.GuildMemberAdd, async (member) => {
      let welcomeChannel = client.channels.cache.get(
        client.data.welcome[member.guild.id]["welcomeChannelId"]
      );
      let mainChannel = client.channels.cache.get(
        client.data.welcome[member.guild.id]["mainChannelId"]
      );
      if (
        !welcomeChannel ||
        welcomeChannel.type !== ChannelType.GuildText ||
        !mainChannel ||
        mainChannel.type !== ChannelType.GuildText
      )
        return;

      welcomeChannel.send({
        embeds: client.embeds.welcomeChannel(member, client),
      });
      mainChannel.send({
        embeds: client.embeds.welcomeChannelMain(member, client),
      });
      if (
        client.data.guilds &&
        member.guild.id in client.data.guilds &&
        member.id in client.data.guilds[member.guild.id] &&
        "rolesAtLeave" in client.data.guilds[member.guild.id][member.id] &&
        client.data.guilds[member.guild.id][member.id].rolesAtLeave
      ) {
        client.data.guilds[member.guild.id][member.id].rolesAtLeave.forEach((roleId: string) => {
          let role = member.guild.roles.cache.get(roleId);
          if (!role) return;
          member.roles.add(role);
        });
        delete client.data.guilds[member.guild.id][member.id].rolesAtLeave;
        client.write();
      }
    });
  },
};

export default join;
