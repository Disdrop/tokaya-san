import { TokayaClient } from "../../tokaya-client";
import { voiceCommand, voiceManagerCommand } from "./commands/manage";
import createNewVoiceChannel from "./events/create";

const voice = {
  title: "Voice",
  discription: 'The "Voice" module handles and contains event and commands for the voice channel.',
  commands: { voiceCommand, voiceManagerCommand },
  events: { createNewVoiceChannel },
  startModule,
};

function startModule(client: TokayaClient) {
  console.log('Starting "general" module');
}

export default voice;
