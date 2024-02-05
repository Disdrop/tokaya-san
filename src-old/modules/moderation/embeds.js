function pingEmbed() {
  return {
    color: 0xffda47,
    description: "Pong",
  };
}
function roleRemoveAllEmbed(roleID) {
  return {
    color: 0xed4245,
    description: `<@&${roleID}> wurde von allen Mitgliedern entfernt.`,
  };
}
function roleRemoveAllStatusEmbed(roleID, count) {
  return {
    color: 0xed4245,
    description: `<@&${roleID}> wird von allen Mitgliedern entfernt. ${count} verbleibend.`,
  };
}

export default { pingEmbed, roleRemoveAllEmbed, roleRemoveAllStatusEmbed };
