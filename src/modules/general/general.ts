import { TokayaClient } from "../../tokaya-client";
import ping from "./commands/ping";
import help from "./commands/help";
import info from "./commands/info";
import helpInteraction from "./events/help-interaction";

function startModule(client: TokayaClient) {
  console.log('Starting "general" module');
}

const general = {
  title: "General",
  discription:
    'The "General" module contains basic commands for general information and assistance.',
  commands: {
    ping,
    help,
    info,
  },
  events: {
    helpInteraction,
  },
  startModule,
};

export default general;
