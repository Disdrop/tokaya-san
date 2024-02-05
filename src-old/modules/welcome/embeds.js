function welcomeEmbed(userID, avatarURL) {
  return {
    color: 0xffda47,
    description: `# Willkommen <@${userID}>\nWir freuen uns, dass du deinen Weg hier her gefunden hast ^^`,
    thumbnail: {
      url: `${avatarURL}`,
    },
  };
}
function joinEmbed(userID) {
  return {
    color: 0xffda47,
    description: `**<@${userID}> ist dem Server beigetreten.**\n\nSieh dir unsere Ressourcen an, durchsuche und aktiviere Kanäle und passe dein Profil an:\n\n- <id:home>\n- <id:browse>\n- <id:customize>`,
    image: {
      url: "https://cdn.discordapp.com/attachments/870398764190433281/1112077320757452827/echidna.png",
    },
  };
}

export default { welcomeEmbed, joinEmbed };
