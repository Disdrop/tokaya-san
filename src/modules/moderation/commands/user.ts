import { PermissionFlagsBits, SlashCommandBuilder, GuildMember } from "discord.js";
import { Command } from "../../../lib/types";

const user: Command = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Various user related commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ban")
        .setDescription("Bans given User")
        .addUserOption((option) =>
          option.setName("user").setDescription("User to be banned").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason why the User should be banned")
            .setRequired(true)
        )
    ),
  async execute(client, interaction) {
    let user = interaction.options.getUser("user");
    switch (interaction.options.getSubcommand()) {
      case "ban":
        if (!user) return;

        //TODO: check if the defined user is bannable (not an admin or modrole)
        //TODO: maybe extract the admin/modrole check to moderation and call it from here
        const member: GuildMember | null = interaction.member as GuildMember | null;
        if (!member || !interaction.guild) return;
        const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
        let modRoleIds = [];
        if (client.data.moderation[interaction.guild.id].modroleIds) {
          modRoleIds = client.data.moderation[interaction.guild.id].modroleIds;
        }
        const hasModRole = modRoleIds.some((roleId: string) => member.roles.cache.has(roleId));

        if (isAdmin || hasModRole) {
          //TODO: execute the ban
          await client.modules.moderation.writeLogEntry(interaction, client);
          await interaction.reply({
            content: `\`user\` <@${user.id}> has (not) been banned`,
            ephemeral: true,
          });
        } else {
          return await interaction.reply({
            content: "You do not have permission to ban this user.",
            ephemeral: true,
          });
        }
        break;
    }
  },
};

export default user;
