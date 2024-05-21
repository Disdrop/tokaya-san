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

export interface Data {
  readonly general: any;
  readonly level: any;
  readonly moderation: any;
  readonly support: any;
  readonly voice: any;
  readonly welcome: any;
}

// Commands
type execute = (client: TokayaClient, interaction: CommandInteraction) => void;
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
