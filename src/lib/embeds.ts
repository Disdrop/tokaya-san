import { TokayaClient } from "../tokaya-client";
import { Command, Field, helpProps } from "./types";

const emptyImgUrl =
  "https://cdn.discordapp.com/attachments/870398764190433281/1112077320757452827/echidna.png";

// General
function help(data: helpProps, client: TokayaClient) {
  if (!data)
    return {
      color: 0x5865f2,
      description: "# Help\nUse the selectmenu and choose a module.",
      image: {
        url: emptyImgUrl,
      },
    };
  const commands = client.modules[data.name.toLowerCase() as keyof typeof client.modules].commands;
  const fields: Field[] = [];
  for (const commandName in commands) {
    if (commandName in commands) {
      const command = commands[commandName as keyof typeof commands];
      fields.push({
        name: `\`/${command.data.name}\``,
        value: command.data.description,
        inline: false,
      });
    }
  }
  return {
    color: 0x5865f2,
    description: `# Help for "${data.name}" module\n${data.discription}`,
    fields: fields,
    image: {
      url: emptyImgUrl,
    },
  };
}

export const embeds = { help };
