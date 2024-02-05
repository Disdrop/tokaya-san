import { GuildMember, ChannelType } from "discord.js";
import { Module } from "../../../base/Module.js";

/**
 * @param {Module} module
 * @param {GuildMember} member
 */
export default async (module, member) => {
  const welcomeConfig = module.client.config.welcome;

  //Vergeben Standard Rolle
  let userRole = member.guild.roles.cache.get(welcomeConfig.events.guildMemberAdd.userRoleID);
  if (userRole) {
    member.roles.add(userRole);
  } else {
    return console.error("[Welcome > guildMemberAdd] Die User Rolle existiert nicht. Lösung: Editiere config.json");
  }

  // Welcome Nachricht senden
  let welcome = member.guild.channels.cache.get(module.client.config.welcome.events.guildMemberAdd.welcomeChannelID);
  if (welcome && welcome.type == ChannelType.GuildText && welcome.permissionsFor(module.client.user.id, true)) {
    welcome.send({ embeds: [module.embeds.welcomeEmbed(member.user.id, member.user.avatarURL({ extension: "webp" }))] });
  } else {
    return console.error("[Welcome > guildMemberAdd] Fehler beim senden der Welcome Nachricht.");
  }

  // Join Nachricht senden
  let join = member.guild.channels.cache.get(module.client.config.welcome.events.guildMemberAdd.mainChannelID);
  if (join && join.type == ChannelType.GuildText && join.permissionsFor(module.client.user.id, true)) {
    join.send({ embeds: [module.embeds.joinEmbed(member.user.id)] });
  } else {
    return console.error("[Welcome > guildMemberAdd] Fehler beim senden der Join Nachricht.");
  }
};
