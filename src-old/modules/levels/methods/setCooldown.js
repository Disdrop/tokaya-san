import { Message } from "discord.js";
import { Module } from "../../../base/Module.js";

/**
 * @param {string} userID
 * @this {Module}
 */
export default async function setCooldown(userId) {
  if (this.data.user[userId].cooldown === true) return;
  this.data.user[userId].cooldown = true;
  this.updateModuleDataJSONFile();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  this.data.user[userId].cooldown = false;
  this.updateModuleDataJSONFile();
}
