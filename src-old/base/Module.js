import { TokayaClient } from "./TokayaClient.js";
import { readdir, readFileSync, writeFileSync, existsSync } from "node:fs";

export class Module {
  /**
   * @param {string} name
   * @param {TokayaClient} client
   */
  constructor(name, client) {
    this.name = name;
    this.client = client;
    this.readModuleDataJSONFile();

    // Import Embeds
    (async () => {
      try {
        if (existsSync(`./src/modules/${name}/embeds.js`)) {
          this.embeds = (await import(`../modules/${name}/embeds.js`)).default;
          console.log(`[${name}] Embeds wurden geladen.`);
        } else {
          console.log(`[${name}] Embeds Datei existiert nicht.`);
        }
      } catch {
        console.log(`[${name}] Embeds konnten nicht geladen werden.`);
      }
    })();

    // Import Methods
    readdir(`./src/modules/${name}/methods`, (err, files) => {
      if (err) return console.error(err);
      files.forEach(async (file) => {
        if (!file.endsWith(".js")) return;
        this[file.split(".")[0]] = (await import(`../modules/${name}/methods/${file}`)).default.bind(this);
        console.log(`[${name}] ${file.split(".")[0]} wurde geladen.`);
      });
      console.log(`[${name}] Es wurden ${files.length} Methoden geladen.`);
    });

    // Load Events
    readdir(`./src/modules/${name}/events`, (err, files) => {
      if (err) return console.error(err);
      files.forEach(async (file) => {
        if (!file.endsWith(".js")) return;
        const event = (await import(`../modules/${name}/events/${file}`)).default;
        this.client.on(file.split(".")[0], (data) => {
          event(this, data);
        });
      });
      console.log(`[${name}] Es wurden ${files.length} events geladen.`);
    });

    // Load Commands
    readdir(`./src/modules/${name}/commands`, (err, files) => {
      if (err) return console.error(err);
      files.forEach(async (file) => {
        if (!file.endsWith(".js")) return;
        const command = (await import(`../modules/${name}/commands/${file}`)).default;
        command.moduleName = name;
        this.client.commands.set(command.data.name, command);
        this.client.commandsData.push(command.data.toJSON());
      });
      console.log(`[${name}] Es wurden ${files.length} commands geladen.`);
    });
  }

  readModuleDataJSONFile() {
    try {
      this.data = JSON.parse(readFileSync(`./src/modules/${this.name}/${this.name}.json`, "utf8"));
    } catch (error) {
      console.error("Fehler beim Lesen der JSON-Datei:", error);
    }
  }

  updateModuleDataJSONFile() {
    try {
      writeFileSync(`./src/modules/${this.name}/${this.name}.json`, JSON.stringify(this.data, null, 2), "utf8");
    } catch (error) {
      console.error("Fehler beim Aktualisieren der JSON-Datei:", error);
    }
  }
}
