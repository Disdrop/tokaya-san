import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  REST,
  Routes,
  ActionRowBuilder,
  BaseSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  Guild,
  ActivityType,
} from "discord.js";
import { config as dotenv } from "dotenv";
import { readFileSync, writeFileSync } from "node:fs";
import { Command, Config, Data, BotEvent } from "./lib/types";
import modules from "./modules/modules";
import { embeds } from "./lib/embeds";

export class TokayaClient extends Client {
  modules = modules;
  embeds = embeds;
  commands: Collection<string, Command> = new Collection();
  commandsData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  readonly config: Config | null = null;
  data: Data = {
    general: null,
    level: null,
    moderation: null,
    support: null,
    voice: null,
    welcome: null,
    guilds: null,
    sport: null,
  };

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    dotenv();

    // Read 'config.json' file
    try {
      this.config = JSON.parse(readFileSync("./src/config.json", "utf8"));
    } catch (error) {
      console.error('Fehler beim Lesen der "config.json" Datei:', error);
    }

    // Read 'data.json' file
    try {
      this.data = JSON.parse(readFileSync("./src/data.json", "utf8")) as Data;
    } catch (error) {
      console.error('Fehler beim Lesen der "data.json" Datei:', error);
    }
  }

  // Write data to 'data.json' file
  async write() {
    try {
      const jsonData = JSON.stringify(this.data, null, 2);
      writeFileSync("./src/data.json", jsonData, "utf8");
    } catch (error) {
      console.error('Fehler beim Lesen der "data.json" Datei:', error);
    }
  }

  async start() {
    if (!this.config) {
      console.error('"config" ist null');
      return;
    }

    // Error handler
    process.on("unhandledRejection", (error) => {
      console.log("Unhandled promise rejection:", error);
    });
    this.on(Events.Error, (error) => {
      console.log("client error:", error);
    });

    this.on(Events.ClientReady, async (client) => {
      if (!this.config || !this.user) return;
      console.log(`[Discord] Online als ${client.user.tag}`);
      (async () => {
        if (!this.config) return;
        const guild = this.guilds.cache.get(this.config.serverId);
        if (!guild) return;
        setInterval(() => {
          if (!this.user) return;
          this.user.setActivity(`${guild.memberCount} User`, { type: ActivityType.Listening });
        }, 50000);
      })();

      // Load modules
      for (const moduleName in modules) {
        if (moduleName in modules) {
          const module = modules[moduleName as keyof typeof modules];

          // Checking if the module is enabled
          if (this.config.modules[moduleName as keyof typeof this.config.modules] === true) {
            // Start events
            for (const eventName in module.events) {
              if (eventName in module.events) {
                const event = module.events[eventName as keyof typeof module.events] as BotEvent;
                event.eventFunction(this);
              }
            }

            // Load commands
            for (const commandName in module.commands) {
              if (commandName in module.commands) {
                const command = module.commands[
                  commandName as keyof typeof module.commands
                ] as Command;
                this.commands.set(command.data.name, command);
                this.commandsData.push(command.data.toJSON());
              }
            }

            // Start commands
            this.on(Events.InteractionCreate, async (interaction) => {
              if (!interaction.isChatInputCommand()) return;
              const command: Command | undefined = this.commands.get(interaction.commandName);
              if (!command) return;
              try {
                command.execute(this, interaction);
              } catch (error) {
                if (interaction.replied || interaction.deferred) {
                  await interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                  });
                } else {
                  await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                  });
                }
              }
            });

            // Start module
            module.startModule(this);
          }
        }
      }

      // Register Commands
      const rest = new REST().setToken(process.env.TOKEN as string);
      try {
        await rest.put(Routes.applicationGuildCommands(this.config.botId, this.config.serverId), {
          body: this.commandsData,
        });
        console.log(`[Discord] Reloaded ${this.commandsData.length} slashcommands.`);
      } catch (error) {
        console.error(error);
      }
    });

    // Login
    super.login(process.env.TOKEN).then(() => {
      console.log(`[Discord] Eingeloggt als ${this.user!.tag}.`);
    });
  }
}
