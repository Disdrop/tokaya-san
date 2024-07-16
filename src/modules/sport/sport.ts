import { TokayaClient } from "../../tokaya-client";
import sportCommands from "./commands/sport-commands";

async function startModule(client: TokayaClient) {
  console.log('Starting "sport" module');
}

const sport = {
  title: "Sport",
  discription:
    'The "Sport" module lets you track your workouts and food intake and allows users to compare themselves with other users.',
  commands: {
    sportCommands,
  },
  events: {},
  startModule,
};

export default sport;
