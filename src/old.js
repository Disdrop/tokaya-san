import { Client, Collection, Partials, GatewayIntentBits, REST, Routes, ActivityType, Events } from "discord.js";
import { config as dotenvConfig } from "dotenv";
import { readdir, readdirSync } from "node:fs";
import { Module } from "./Module.js";
import * as config from "../config.json" assert { type: "json" };

export class TokayaClient extends Client {
  commands = new Collection();
  commandsData = [];
  modules = {};
  config = config.default;

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildModeration, GatewayIntentBits.MessageContent],
      partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.User],
      allowedMentions: { repliedUser: false, parse: ["users", "roles"] },
      failIfNotExists: false,
    });
    dotenvConfig();
  }

  async login() {
    // Load Moudules
    readdir("./src/modules", (err, folders) => {
      if (err) return console.log(err);
      folders.forEach((folder) => {
        if (this.config[folder].enabled !== true) return;
        this.modules[folder] = new Module(folder, this);
        console.log(`[loadModules] Es wurde das Modul ${folder} geladen.`);
      });
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Register Commands
    const rest = new REST().setToken(process.env.TOKEN);
    (async () => {
      try {
        const data = await rest.put(Routes.applicationGuildCommands("1138481259039965206", "866044524349095996"), { body: this.commandsData });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
      } catch (error) {
        console.error(error);
      }
    })();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Start Commands
    this.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(this.modules[command.moduleName], interaction);
      } catch (error) {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
        } else {
          await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
      }
    });

    // Set Activity
    this.on("ready", () => {
      console.log(`[Discord] Online als ${this.user.tag}`);
      (async () => {
        const guild = this.guilds.cache.get("866044524349095996");
        if (!guild) return;
        setInterval(() => {
          this.user.setActivity(`${guild.memberCount} User`, { type: ActivityType.Listening });
        }, 50000);
      })();
    });

    // Login
    super.login(process.env.TOKEN).then(() => {
      console.log(`[Discord] Eingeloggt als ${this.user.tag}.`);
    });
  }

  loadModules() {
    readdir("./src/modules", (err, folders) => {
      if (err) return console.log(err);
      folders.forEach((folder) => {
        if (this.config[folder].enabled !== true) return;
        this.modules.push(new Module(folder, this));
        console.log(`[loadModules] Es wurde das Modul ${folder} geladen.`);
      });
    });
  }
}
