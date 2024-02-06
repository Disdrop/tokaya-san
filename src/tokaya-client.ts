import { Client, GatewayIntentBits, Collection } from "discord.js";
import { config as dotenv } from "dotenv";
import { readdir, readFile, readFileSync } from "node:fs";
import { Config } from "./lib/types";

export class TokayaClient extends Client {
  commands = new Collection();
  config: Config;

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
    // Load modules
    readdir("./src/modules", (err, folders) => {
      if (err) return console.error(err);
      folders.forEach((folder) => {
        // Checking if the module is enabled
        if (this.config.modules[folder] == false) return;

        // Import Module (Unfinished)
        const module = import(`./modules/${folder}/index.ts`);
        console.log(`[loadModules] Es wurde das Modul ${folder} geladen.`);
      });
    });

    // Login
    super.login(process.env.TOKEN).then(() => {
      console.log(`[Discord] Eingeloggt als ${this.user!.tag}.`);
    });
  }
}
