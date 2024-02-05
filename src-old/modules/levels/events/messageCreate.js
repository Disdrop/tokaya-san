import { Message } from "discord.js";
import { Module } from "../../../base/Module.js";

/**
 * @param {Module} module
 * @param {Message} message
 */
export default async (module, message) => {
  const levelsConfig = module.client.config.levels;
  if (message.author.bot) return;
  module.addPointsOnMessage(message, levelsConfig.levelRoleIDs);
};
