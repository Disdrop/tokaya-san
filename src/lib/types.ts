import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  CommandInteraction,
} from "discord.js";
import { TokayaClient } from "../tokaya-client";

export interface Config {
  serverId: string;
  modules: {
    general: boolean;
    level: boolean;
    moderation: boolean;
    support: boolean;
    voice: boolean;
    welcome: boolean;
  };
}

export interface Module {
  commands: Command[];
  functions: {};
}

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
}

interface executeOptions {
  client: TokayaClient;
  interaction: CommandInteraction;
}
