import { Message } from "discord.js";
import { Module } from "../../../base/Module.js";

/**
 * @param {Message} message
 * @this {Module}
 */
export default function addPointsOnMessage(message) {
  if (this.data.user.hasOwnProperty(`${message.author.id}`)) {
    let user = this.data.user[message.author.id];
    user.messages += 1;
    if (user.cooldown === true) return;
    user.points += 10;
  } else {
    this.data.user[message.author.id] = {
      name: message.author.displayName,
      level: 1,
      points: 10,
      messages: 1,
      cooldown: false,
    };
  }
  this.setCooldown(message.author.id);
  this.checkLevelUpdate(message.author.id, message.guild);
  this.updateModuleDataJSONFile();
}
