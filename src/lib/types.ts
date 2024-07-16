import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ChatInputCommandInteraction,
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
    readonly sport: boolean;
  };
  readonly welcome: {
    readonly saveroles: boolean;
  };
}

export interface Data {
  general: any;
  level: any;
  moderation: any;
  support: any;
  voice: any;
  welcome: any;
  guilds: any;
  sport: any;
}

// Commands
type execute = (client: TokayaClient, interaction: ChatInputCommandInteraction) => void;
export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: execute;
}

// Events
type eventFunction = (client: TokayaClient) => void;
export interface BotEvent {
  eventFunction: eventFunction;
}

// Embeds
export interface Field {
  name: string;
  value: string;
  inline: boolean;
}

// General Help embed
interface generalHelpPropsObj {
  name: string;
  discription: string;
}
export type generalHelpProps = null | generalHelpPropsObj;
