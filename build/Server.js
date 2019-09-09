"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const Game_1 = __importDefault(require("./Game"));
const Player_1 = require("./Player");
const Parser_1 = require("./Parser");
const PORT = 8080;
//The server initiates listening once instantiated
const server = new ws_1.default.Server({ port: PORT });
console.log(`Started new WebSocket server on ${PORT}`);
let game = new Game_1.default();
let count = 0;
let clientsPlayer = new Map();
//when receiving a connection from a client
server.on("connection", client => {
    if (!clientsPlayer.has(client)) {
        count++;
        let player = new Player_1.Player(0, count, client);
        game.addPlayer(player);
        clientsPlayer.set(client, player); // maybe move this up into the on connection instead and asssume later to remove double typeing  near count++
        let begin = `Welcome to our Labyrinth Server \n${game.start(player)}`;
        client.send(JSON.stringify({
            bool: true,
            message: begin
        }));
    }
    client.on("message", (response) => {
        let player;
        player = getClient(client);
        let parsedMessage = JSON.parse(response);
        let cmd = parsedMessage.cmd;
        let arg = parsedMessage.arg;
        handleClientInput(cmd, arg, player, client);
    });
});
// get clients in room
function getRoommates(player) {
    let players = [];
    clientsPlayer.forEach((value, key) => {
        if (player !== value) {
            if (player.getCurrentLocation() == value.getCurrentLocation()) {
                players.push(value);
            }
        }
    });
    return players;
}
// notify all
function notifyRoomates(players, message) {
    players.forEach(element => {
        element.getClient().send(JSON.stringify({
            bool: false,
            neighborActions: message
        }));
    });
}
function getClient(client) {
    let player;
    if (clientsPlayer.has(client)) {
        player = clientsPlayer.get(client);
    }
    return player;
}
function handleClientInput(cmd, arg, player, client) {
    let message = "";
    if (player) {
        let neighbors = getRoommates(player);
        if (cmd === Parser_1.Command.GO) {
            message = game.handlePlayerGo(arg.toLowerCase(), player);
        }
        else if (cmd === Parser_1.Command.TAKE) {
            message = game.handleTakeItem(arg, player);
            notifyRoomates(neighbors, "Player " + player.getID() + ": " + message);
        }
        else if (cmd === Parser_1.Command.INVENTORY) {
            message = player.showInventory();
        }
        else if (cmd === Parser_1.Command.LOOK) {
            message = game.handlePlayerLook(player);
        }
        else if (cmd === Parser_1.Command.DROP) {
            message = game.handleDropItem(arg, player);
            notifyRoomates(neighbors, "Player " + player.getID() + ": " + message);
        }
        else if (cmd === Parser_1.Command.QUIT) {
            client.send(JSON.stringify({
                bool: false,
                message: "Hope to see you again."
            }));
        }
        else if (cmd === Parser_1.Command.USE) {
            message = game.handleUseItem(arg.toLowerCase(), player);
            notifyRoomates(neighbors, "Player " + player.getID() + ": " + message);
        }
        game.moveMonster();
        let cond = game.getGameStateInformation(player);
        if (cond !== "") {
            message = game.getGameStateInformation(player);
        }
        client.send(JSON.stringify({
            bool: game.checkGameState(player),
            message: message
        }));
    }
}
//# sourceMappingURL=Server.js.map