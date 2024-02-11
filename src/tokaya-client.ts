import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  REST,
  Routes,
  ActivityType,
} from "discord.js";
import { config as dotenv } from "dotenv";
import { readdir, readFile, readFileSync } from "node:fs";
import { Command, Config } from "./lib/types";

export class TokayaClient extends Client {
  commands = new Collection();
  commandsData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  readonly config: Config | null = null;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    dotenv();

    // Read 'config.json' file
    try {
      this.config = JSON.parse(readFileSync("./src/config.json", "utf8"));
    } catch (error) {
      console.error('Fehler beim Lesen der "config.json" Datei:', error);
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

    // Load modules
    readdir("./src/modules", (err, folders) => {
      if (err) return console.error(err);
      folders.forEach((folder) => {
        // Checking if the module is enabled
        if (this.config!.modules![folder as keyof typeof this.config.modules] === false) return;

        // Start module (Unfinished)
        const module = import(`./modules/${folder}/index.ts`);

        // Load commands
        readdir(`./src/modules/${folder}/commands`, (err, files) => {
          if (err) return console.error(err);
          files.forEach(async (file) => {
            if (!file.endsWith(".js")) return;
            const command: Command = await import(`../modules/${folder}/commands/${file}`);
            this.commands.set(command.data.name, command);
            this.commandsData.push(command.data.toJSON());
          });
          console.log(`[${folder}] Es wurden ${files.length} commands geladen.`);
        });

        // Load functions

        // Start module

        console.log(`[loadModules] Es wurde das Modul "${folder}" geladen.`);
      });
    });

    // Register Commands
    const rest = new REST().setToken(process.env.TOKEN as string);
    try {
      await rest.put(Routes.applicationGuildCommands(this.config.botId, this.config.serverId), {
        body: this.commandsData,
      });
      console.log(`Successfully reloaded ${this.commandsData.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }

    // Start commands
    /*
    this.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(this.modules[command.moduleName], interaction);
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
    */

    // Set activity
    this.on("ready", () => {
      if (!this.user) return;
      console.log(`[Discord] Online als ${this.user.tag}`);
      (async () => {
        const guild = this.guilds.cache.get(this.config!.serverId);
        if (!guild) return;
        setInterval(() => {
          if (!this.user) return;
          this.user.setActivity(`${guild.memberCount} User`, { type: ActivityType.Listening });
        }, 50000);
      })();
    });

    // Login
    super.login(process.env.TOKEN).then(() => {
      console.log(`[Discord] Eingeloggt als ${this.user!.tag}.`);
    });
  }
}
