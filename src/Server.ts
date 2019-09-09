import WebSocket from "ws";
import Game from "./Game";
import { Player } from "./Player";
import { Command } from "./Parser";

const PORT = 8080;

//The server initiates listening once instantiated
const server = new WebSocket.Server({ port: PORT });
console.log(`Started new WebSocket server on ${PORT}`);
let game = new Game();
let count: number = 0;
let clientsPlayer: Map<WebSocket, Player> = new Map<WebSocket, Player>();

//when receiving a connection from a client
server.on("connection", client => {
  if (!clientsPlayer.has(client)) {
    count++;
    let player = new Player(0, count, client);
    game.addPlayer(player);
    clientsPlayer.set(client, player); // maybe move this up into the on connection instead and asssume later to remove double typeing  near count++
    let begin = `Welcome to our Labyrinth Server \n${game.start(player)}`;
    client.send(
      JSON.stringify({
        bool: true,
        message: begin
      })
    );
  }
  client.on("message", (response: string) => {
    let player: Player | undefined;
    player = getClient(client);
    let parsedMessage = JSON.parse(response);
    let cmd = parsedMessage.cmd;
    let arg = parsedMessage.arg;
    handleClientInput(cmd, arg, player, client);
  });
});

// get clients in room
function getRoommates(player: Player): Player[] {
  let players: Player[] = [];
  clientsPlayer.forEach((value: Player, key: WebSocket) => {
    if (player !== value) {
      if (player.getCurrentLocation() == value.getCurrentLocation()) {
        players.push(value);
      }
    }
  });
  return players;
}

// notify all
function notifyRoomates(players: Player[], message: string) {
  players.forEach(element => {
    element.getClient().send(JSON.stringify({
      bool: false,
      neighborActions: message
    }))
  });
}

function getClient(client: WebSocket): Player | undefined {
  let player: Player | undefined;
  if (clientsPlayer.has(client)) {
    player = clientsPlayer.get(client);
  }
  return player;
}

function handleClientInput(
  cmd: Command,
  arg: string,
  player: Player | undefined,
  client: WebSocket
) {
  let message = "";
  if (player) {
    let neighbors = getRoommates(player);
    if (cmd === Command.GO) {
      message = game.handlePlayerGo(arg.toLowerCase(), player);
    } else if (cmd === Command.TAKE) {
      message = game.handleTakeItem(arg, player);
      notifyRoomates(neighbors, "Player " + player.getID() + ": " + message);
    } else if (cmd === Command.INVENTORY) {
      message = player.showInventory();
    } else if (cmd === Command.LOOK) {
      message = game.handlePlayerLook(player);
    } else if (cmd === Command.DROP) {
      message = game.handleDropItem(arg, player);
      notifyRoomates(neighbors, "Player " + player.getID() + ": " + message);
    } else if (cmd === Command.QUIT) {
      client.send(
        JSON.stringify({
          bool: false,
          message: "Hope to see you again."
        })
      );
    } else if (cmd === Command.USE) {
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
