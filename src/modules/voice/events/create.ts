import { BotEvent } from "../../../lib/types";
import { Events, ChannelType } from "discord.js";

const createNewVoiceChannel: BotEvent = {
  async eventFunction(client) {
    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
      //   client.config?.modules.voice;

      console.log("AGSADKJHASJKDHJKAHSKDHAKJSHD");

      if (!newState.channelId) return;

      const member = newState.member!;

      if (!client.data.voice.manager) {
        client.data.voice.manager = {
          channels: new Map(),
        };
        await client.write();
      }

      if (!client.data.voice.admin) {
        client.data.voice.admin = {
          channels: {},
        };
        await client.write();
      }

      const createChannels: string[] = client.data.voice.manager.channels.keys();

      if (!createChannels.includes(newState.channelId)) return;
      const name = (client.config?.modules.voice as any).name;

      const channel = await newState.guild.channels.create({
        name: name,
        parent: newState.channel?.parentId,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          {
            id: member.id,
            allow: ["Connect", "ManageChannels", "ViewChannel"],
          },
        ],
      });

      await member.voice.setChannel(channel);

      client.data.voice.admin.channels[channel.id] = member.id;
      await client.write();
    });
  },
};

export default createNewVoiceChannel;
