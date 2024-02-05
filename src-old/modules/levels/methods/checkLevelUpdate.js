import { Guild } from "discord.js";
import { Module } from "../../../base/Module.js";

/**
 * @param {String} userId
 * @param {Guild} guild
 * @this {Module}
 */
export default function checkLevelUpdate(userId, guild) {
  if (this.data.user.hasOwnProperty(`${userId}`)) {
    let user = this.data.user[userId];
    let levelXpLimit = Math.floor(((user.level * user.level) / 100) * 100 + 100);
    const channel = guild.channels.cache.get(this.client.config.levels.levelUpChannelID);
    if (user.points < levelXpLimit || !channel) return;
    user.points -= levelXpLimit;
    user.level++;
    this.updateModuleDataJSONFile();
    channel.send({ content: `<@${userId}>`, embeds: [this.embeds.levelUpEmbed(user.level)] });

    if (user.level % 10 !== 0 || user.level / 10 >= this.client.config.levels.levelRoleIDs.length) return;
    const member = guild.members.cache.get(userId);
    const newRole = guild.roles.cache.get(this.client.config.levels.levelRoleIDs[user.level / 10]);
    const oldRole = guild.roles.cache.get(this.client.config.levels.levelRoleIDs[user.level / 10 - 1]);
    if (!member || !newRole || !oldRole) return;
    member.roles.add(newRole);
    member.roles.remove(oldRole);
  }
}
