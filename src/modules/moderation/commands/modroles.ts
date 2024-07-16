import { Role, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../../lib/types";

const modrole: Command = {
  data: new SlashCommandBuilder()
    .setName("modrole")
    .setDescription("Commands for the moderation module")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds a Role to the modroles")
        .addRoleOption((option) =>
          option.setName("role").setDescription("Role to be added").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a Role to the modroles")
        .addRoleOption((option) =>
          option.setName("role").setDescription("Role to be removed").setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(client, interaction) {
    let role = interaction.options.getRole("role");
    switch (interaction.options.getSubcommand()) {
      case "add":
        if (!role || !(role instanceof Role) || !interaction.guildId) return;
        if (!client.data.moderation) {
          client.data.moderation = {
            [interaction.guildId]: {
              ["modroleIds"]: [role.id],
            },
          };
        } else if (!client.data.moderation[interaction.guildId]) {
          client.data.moderation[interaction.guildId] = {
            ["modroleIds"]: [role.id],
          };
        } else if (!client.data.moderation[interaction.guildId]["modroleIds"]) {
          client.data.moderation[interaction.guildId]["modroleIds"] = [role.id];
        } else if (client.data.moderation[interaction.guildId]["modroleIds"].includes(role.id)) {
          client.write();
          await interaction.reply({
            content: `\`modrole\` <@&${role.id}> has already been added`,
            ephemeral: true,
          });
          break;
        } else {
          client.data.moderation[interaction.guildId]["modroleIds"].push(role.id);
        }
        client.write();
        await interaction.reply({
          content: `\`modrole\` <@&${role.id}> was successfully added`,
          ephemeral: true,
        });
        break;

      case "remove":
        if (!interaction.guildId) return;
        if (!role || !(role instanceof Role) || !interaction.guildId) return;
        role = role as Role;
        if (client.data.moderation[interaction.guildId]["modroleIds"].includes(role.id)) {
          client.data.moderation[interaction.guildId]["modroleIds"] = client.data.moderation[
            interaction.guildId
          ]["modroleIds"].filter((id: string) => id !== role?.id);

          if (
            !client.data.moderation[interaction.guildId] ||
            (Object.keys(client.data.moderation[interaction.guildId]["modroleIds"]).length === 0 &&
              !client.data.moderation[interaction.guildId]["logChannelId"])
          ) {
            delete client.data.moderation[interaction.guildId];
          }
          if (Object.keys(client.data.moderation).length === 0) {
            client.data.moderation = null;
          }

          await interaction.reply({
            content: `\`modrole\` <@&${role.id}> was successfully removed`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `\`modrole\` <@&${role.id}> is not a modrole`,
            ephemeral: true,
          });
        }

        client.write();
        break;
    }
  },
};

export default modrole;
