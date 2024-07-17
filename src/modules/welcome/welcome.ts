import { TokayaClient } from "../../tokaya-client";
import join from "./events/join";
import leave from "./events/leave";
import welcomeSetup from "./commands/welcome-command";

async function startModule(client: TokayaClient) {
  console.log('Starting "welcome" module');
  if (!client.config?.serverId) return;
  let guild = client.guilds.cache.get(client.config.serverId);
  if (!guild) return;
  guild.members.fetch().then(async (members) => {
    members;
  });
}

const welcome = {
  title: "Welcome",
  discription:
    'The "Welcome" module contains basic commands for general information and assistance.',
  commands: {
    welcomeSetup,
  },
  events: {
    join,
    leave,
  },
  startModule,
};

export default welcome;
