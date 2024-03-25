import { TokayaClient } from "../../tokaya-client";
import ping from "./commands/ping";
import help from "./commands/help";
import ready from "./events/ready";

function startModule(client: TokayaClient) {
  console.log('Starting "general" module');
}

const general = {
  startModule,
  commands: {
    ping,
    help,
  },
  events: {
    ready,
  },
};

export default general;
