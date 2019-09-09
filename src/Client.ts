import WebSocket from "ws";
import { Command, CommandParser } from "./Parser";

//connect to the server
const connection = new WebSocket(`ws://localhost:8080`);
const parser = new CommandParser(handleInput, false); // initalize parser
//when receiving a message from the server <- onMessage?
connection.on("message", (data: any) => {
    let information = JSON.parse(data);
    if (information.bool) {
      console.log(information.message);
      parser.prompt();
    } else {
      console.log(information.neighborActions);
    }
});

// Handles command inputs from player
function handleInput(cmd: Command, arg: String): boolean {
  arg = arg.toLowerCase();
  connection.send(JSON.stringify({ cmd: cmd, arg: arg }));
  return true;
}
