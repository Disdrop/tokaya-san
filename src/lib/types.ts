import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  CommandInteraction,
} from "discord.js";
import { TokayaClient } from "../tokaya-client";

export interface Config {
  readonly serverId: string;
  readonly botId: string;
  readonly modules: {
    readonly general: boolean;
    readonly level: boolean;
    readonly moderation: boolean;
    readonly support: boolean;
    readonly voice: boolean;
    readonly welcome: boolean;
  };
}

interface commandOptions {
  client: TokayaClient;
  interaction: CommandInteraction;
}

type commandFunction = (options: commandOptions) => void;

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  command: commandFunction;
}
