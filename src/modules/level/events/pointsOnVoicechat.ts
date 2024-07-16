import { Events } from "discord.js";
import { BotEvent } from "../../../lib/types";

const pointsOnVoicechat: BotEvent = {
  async eventFunction(client) {
    client.on(Events.VoiceStateUpdate, async (voiceOld, voiceNew) => {
      if (!voiceNew.member || !voiceOld.member) return;
      if (voiceNew.channelId) {
        if (!client.data.level) {
          client.data.level = {
            [voiceNew.guild.id]: {
              voiceChannels: {
                [voiceNew.channelId]: [voiceNew.member.id],
              },
            },
          };
        } else if (!client.data.level[voiceNew.guild.id]) {
          client.data.level[voiceNew.guild.id] = {
            voiceChannels: {
              [voiceNew.channelId]: [voiceNew.member.id],
            },
          };
        } else if (!client.data.level[voiceNew.guild.id].voiceChannels) {
          client.data.level[voiceNew.guild.id].voiceChannels = {
            [voiceNew.channelId]: [voiceNew.member.id],
          };
        } else {
          if (client.data.level[voiceNew.guild.id].voiceChannels[voiceNew.channelId]) {
            let index = client.data.level[voiceNew.guild.id].voiceChannels[
              voiceNew.channelId
            ].findIndex((element: string) => {
              if (!voiceNew.member) return;
              return element === voiceNew.member.id;
            });
            if (!index || index == -1)
              return console.log(
                "test1",
                index,
                voiceNew.member.id,
                client.data.level[voiceNew.guild.id].voiceChannels[voiceNew.channelId]
              );
          }
          client.data.level[voiceNew.guild.id].voiceChannels[voiceNew.channelId].push(
            voiceNew.member.id
          );
        }
        client.modules.level.voicePoints(
          voiceNew.member.user,
          voiceNew.guild,
          voiceNew.channelId,
          client
        );
        client.write();
      }
      if (voiceOld.channelId) {
        if (
          client.data.level ||
          client.data.level[voiceOld.guild.id] ||
          client.data.level[voiceOld.guild.id].voiceChannels ||
          client.data.level[voiceOld.guild.id].voiceChannels[voiceOld.channelId]
        ) {
          let index = client.data.level[voiceOld.guild.id].voiceChannels[
            voiceOld.channelId
          ].findIndex((element: string) => {
            if (!voiceOld.member) return;
            return element === voiceOld.member.id;
          });
          if (!index || index == -1)
            return console.log(
              "test2",
              index,
              voiceOld.member.id,
              client.data.level[voiceOld.guild.id].voiceChannels[voiceOld.channelId]
            );
          client.data.level[voiceOld.guild.id].voiceChannels[voiceOld.channelId].splice(index, 1);
          if (client.data.level[voiceOld.guild.id].voiceChannels[voiceOld.channelId].length === 0) {
            delete client.data.level[voiceOld.guild.id].voiceChannels[voiceOld.channelId];
          }
          if (Object.keys(client.data.level[voiceOld.guild.id].voiceChannels).length === 0) {
            delete client.data.level[voiceOld.guild.id].voiceChannels;
          }
          if (Object.keys(client.data.level[voiceOld.guild.id]).length === 0) {
            delete client.data.level[voiceOld.guild.id];
          }
          if (Object.keys(client.data.level).length === 0) {
            client.data.level = null;
          }
          client.write();
        }
      }
    });
  },
};

export default pointsOnVoicechat;
