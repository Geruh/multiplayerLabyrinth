"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const Parser_1 = require("./Parser");
//connect to the server
const connection = new ws_1.default(`ws://localhost:8080`);
const parser = new Parser_1.CommandParser(handleInput, false); // initalize parser
//when receiving a message from the server <- onMessage?
connection.on("message", (data) => {
    let information = JSON.parse(data);
    if (information.bool) {
        console.log(information.message);
        parser.prompt();
    }
    else {
        console.log(information.neighborActions);
    }
});
// Handles command inputs from player
function handleInput(cmd, arg) {
    arg = arg.toLowerCase();
    connection.send(JSON.stringify({ cmd: cmd, arg: arg }));
    return true;
}
//# sourceMappingURL=Client.js.map