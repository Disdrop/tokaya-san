import {
  ActionRowBuilder,
  ActivityType,
  Events,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { BotEvent, Command } from "../../../lib/types";

const helpInteraction: BotEvent = {
  async eventFunction(client) {
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isStringSelectMenu()) return;
      const component = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(interaction.customId)
          .setPlaceholder(interaction.component.placeholder!)
          .addOptions(
            ...interaction.component.options.map((option) => {
              if (option.value === interaction.values[0]) {
                return new StringSelectMenuOptionBuilder()
                  .setLabel(option.label)
                  .setValue(option.value)
                  .setDefault(true);
              }
              if (option.default) {
                return new StringSelectMenuOptionBuilder()
                  .setLabel(option.label)
                  .setValue(option.value);
              }
              return option;
            })
          )
      );
      await interaction.message.edit({
        embeds: [
          client.embeds.generalHelp(
            {
              name: client.modules[interaction.values[0] as keyof typeof client.modules].title,
              discription:
                client.modules[interaction.values[0] as keyof typeof client.modules].discription,
            },
            client
          ),
        ],
        components: [component],
      });
      await interaction.deferUpdate();
    });
  },
};

export default helpInteraction;
