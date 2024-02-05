function levelUpEmbed(level) {
  return {
    color: 0xffda47,
    description: `Herzlichen Glückwunsch, du hast Level ${level} erreicht!`,
  };
}

function levelsEmbed(id, level, points, bool) {
  if (bool) {
    return {
      color: 0xffda47,
      description: `Du hast derzeit ${points} von ${((level * level) / 100) * 100 + 100} xp um Level ${level + 1} zu erreichen.`,
    };
  }
  return {
    color: 0xffda47,
    description: `<@${id}> hat derzeit ${points} von ${((level * level) / 100) * 100 + 100} xp um Level ${level + 1} zu erreichen.`,
  };
}

function levelsTopEmbed(users) {
  let description = "";
  users.forEach((user, i) => {
    if (i > 14) return;
    description += `\n${i + 1}. <@${users[i].id}>  **Level ${users[i].level}** (${users[i].points}/${((users[i].level * users[i].level) / 100) * 100 + 100} xp)`;
  });
  return {
    color: 0xffda47,
    description: `# Top 15 User${description}`,
  };
}

export default { levelUpEmbed, levelsEmbed, levelsTopEmbed };
