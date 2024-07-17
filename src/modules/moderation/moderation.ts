import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import { TokayaClient } from "../../tokaya-client";
import logchannel from "./commands/logchannel";
import modroles from "./commands/modroles";
import user from "./commands/user";

async function startModule(client: TokayaClient) {
  console.log('Starting "moderation" module');
}

async function writeLogEntry(interaction: ChatInputCommandInteraction, client: TokayaClient) {
  if (!interaction.guildId) return;
  if (!client.data.moderation[interaction.guildId]["logChannelId"]) return;
  const channel = client.channels.cache.get(
    client.data.moderation[interaction.guildId]["logChannelId"]
  ) as TextChannel;
  await channel.send({embeds: client.embeds.logEntry(interaction)});
}

const moderation = {
  title: "Moderation",
  discription:
    'The "Moderation" module lets you use various moderator tools like temp ban, temp mute and other moderation features',
  events: {},
  commands: {
    logchannel,
    modroles,
    user,
  },
  startModule,
  writeLogEntry,
};

export default moderation;
