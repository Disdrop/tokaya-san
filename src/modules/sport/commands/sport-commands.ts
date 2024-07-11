import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../../lib/types";

const sport: Command = {
  data: new SlashCommandBuilder()
    .setName("sport")
    .setDescription("Commands for Sport Module!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setdata")
        .setDescription("Set the data that is needed to calculate the food requirement")
        .addStringOption((option) =>
          option
            .setName("gender")
            .setDescription("Select your biological gender")
            .setRequired(true)
            .setChoices({ name: "Male", value: "male" }, { name: "Female", value: "female" })
        )
        .addNumberOption((option) =>
          option.setName("age").setDescription("Select your age in years").setRequired(true)
        )
        .addNumberOption((option) =>
          option.setName("height").setDescription("Select your size in cm").setRequired(true)
        )
        .addNumberOption((option) =>
          option.setName("weight").setDescription("Select your weight in kg").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("activitylevel")
            .setDescription("Select your activity level")
            .setRequired(true)
            .setChoices(
              { name: "sitzend", value: "0" },
              { name: "leicht aktiv", value: "1" },
              { name: "mäßig aktiv", value: "2" },
              { name: "sehr aktiv", value: "3" },
              { name: "extra aktiv", value: "4" }
            )
        )
    ),
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;
    //await interaction.reply(`\`\`\`json\n${JSON.stringify(interaction.options, null, 2)}\n\`\`\``);
    switch (interaction.options.getSubcommand()) {
      case "setdata":
        const gender = interaction.options.getString("gender");
        const activityLevel = interaction.options.getString("activitylevel");
        const age = interaction.options.getNumber("age");
        const height = interaction.options.getNumber("height");
        const weight = interaction.options.getNumber("weight");
        await interaction.reply({
          content: `${gender} ${age} ${height} ${weight} ${activityLevel}`,
          //embeds: await client.embeds.generalInfoUser(await interaction.user.fetch(), client),
          fetchReply: true,
          ephemeral: true,
        });
        break;
      case "server":
        break;
    }
  },
};

export default sport;
