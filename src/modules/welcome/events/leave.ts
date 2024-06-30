import { ActivityType, ChannelType, Events } from "discord.js";
import { BotEvent } from "../../../lib/types";

const leave: BotEvent = {
  async eventFunction(client) {
    client.on(Events.GuildMemberRemove, async (member) => {
      if (!client.config) return;
      if (!client.config.welcome.saveroles) return;
      let roles = member.roles.cache.map((role) => {
        if (!client.config) return;
        if (role.id === client.config.serverId) return;
        return role.id;
      });
      let leaveRoles = roles.filter((item) => item !== null && item !== undefined);
      if (leaveRoles.length === 0) return;
      if (!client.data.guilds) {
        client.data.guilds = {
          [client.config.serverId]: {
            [member.id]: {
              name: member.user.tag,
              rolesAtLeave: leaveRoles,
            },
          },
        };
      } else if (!client.data.guilds[client.config.serverId]) {
        client.data.guilds[client.config.serverId] = {
          [member.id]: {
            name: member.user.tag,
            rolesAtLeave: leaveRoles,
          },
        };
      } else if (!client.data.guilds[client.config.serverId][member.id]) {
        client.data.guilds[client.config.serverId][member.id] = {
          name: member.user.tag,
          rolesAtLeave: leaveRoles,
        };
      } else {
        client.data.guilds[client.config.serverId][member.id].rolesAtLeave = leaveRoles;
      }
      client.write();
    });
  },
};

export default leave;
