import { Player } from "./Player";
import { Monster } from "./Monster";
import { Area } from "./Area";
import { Item } from "./Item";
import { Hazard } from "./Hazard";
import { Direction } from "./Direction";

const roomData = require("../labyrinth.json");
export class Game {
  private gameState: any[][];
  private players: Player[] = [];
  public monster: Monster;
  private monsterLocation: number;
  private keyItem: string;

  constructor() {
    this.gameState = [];
    this.keyItem = "";
    this.constructTheMap();   
    this.monster = new Monster(
      roomData.monster[0].monsterName,
      roomData.monster[0].monsterSpawn
    );
    this.monsterLocation = roomData.boardSize / 2;
  }

  public constructTheMap() {
    let keys = Object.keys(roomData.areas);
    for (let i = 0; i < roomData.boardSize; i++) {
      this.gameState.push([]);
    }
    for (let i = 0; i <= roomData.boardSize - 1; i++) {
      this.gameState[i][0] = new Area(
        roomData.areas[keys[i]].areaName,
        roomData.areas[keys[i]].areaDescription,
        roomData.areas[keys[i]].areaIsEnd
      );
      let area = this.gameState[i][0];
      if (roomData.areas[keys[i]].item) {
        let item = new Item(
          roomData.areas[keys[i]].item.itemName,
          roomData.areas[keys[i]].item.isTreasure,
          roomData.areas[keys[i]].item.isMonsterSlayer
        );
        if (item.isMonsterSlayer()) {
          this.keyItem = item.getItemName();
        }
        area.addItemToArea(item);
      }
      if (roomData.areas[keys[i]].hazard) {
        let hazard = new Hazard(
          roomData.areas[keys[i]].hazard.hazardDesc,
          roomData.areas[keys[i]].hazard.removeWith
        );
        area.addHazardToArea(hazard);
      }
      this.gameState[i][1] = roomData.areas[keys[i]].possibleDirections;
    }
  }

  // Handles take command
  public handleTakeItem(itemName: String, player: Player): string {
    let message = "";
    let area = this.gameState[player.getCurrentLocation()][0];
    let item = area.getItem();
    if (!item || itemName !== item.getItemName().toLowerCase()) {
      return "Error: item does not exist";
    } else {
      player.placeItemInBackpack(item);
      if (item.isItemTreasure()) {
        message =
          "You have found the treasure now search for the correct room to exit \n";
      } else {
        message += `You now have a ${item.getItemName()} in your inventory \n`;
      }
      area.removeItemFromArea();
      return message + this.getPossibleDirections(player);
    }
  }

  public handleUseItem(itemName: string, player: Player): string {
    let response: string = "";
    if (player.hasItem(itemName)) {
      let area = this.getCurrentArea(player);
      let hazard = area.getHazard();
      if (hazard !== null) {
        if (area.hasHazard && itemName == hazard.getSolution().toLowerCase()) {
          area.resolveHazard();
          player.removeItemInBackpack(itemName);
          response =
            response +
            "you successfully used your " +
            hazard.getSolution() +
            "\n" + area.getAreaDescription() + "\n";
          return response + this.getPossibleDirections(player) + "\n";
        } else {
          return "You used the wrong item!";
        }
      }
      if (this.hasPlayerEncounteredMonster(player)) {
        this.monster.defeat();
        player.removeItemInBackpack(itemName);
        return (
          "You have slayed " +
          this.monster.getName() +
          ", now find the treasure, and escape"
        );
      }
    } else {
      return "You don't have the correct item!";
    }
    return response;
  }

  public handleDropItem(itemName: string, player: Player): string {
    let playerLocation = player.getCurrentLocation();
    let area = this.gameState[playerLocation][0];
    if (area.hasHazard()) {
      return "You cannot drop item in hazard. "
    } else {
      if (player.hasItem(itemName)) {
        let item = player.dropItem(itemName);

        area.addItemToArea(item);
        return "You have droped " + itemName;
      }
    }
    return "You do not have that item!";
  }

  private getPossibleDirections(player: Player): string {
    let possibleDirections = this.gameState[player.getCurrentLocation()][1];
    let possibleDirectionsKeys = Object.keys(possibleDirections);
    let possibleDirectionPrompt: string =
      "You can go " + possibleDirectionsKeys[0];
    for (var i = 1; i < possibleDirectionsKeys.length; i++) {
      possibleDirectionPrompt =
        possibleDirectionPrompt + " or " + possibleDirectionsKeys[i];
    }
    return possibleDirectionPrompt + "!";
  }

  private isValidDirection(direction: string, player: Player): boolean {
    let possibleDirections = this.gameState[player.getCurrentLocation()][1];
    let possibleDirectionsKeys = Object.keys(possibleDirections);
    for (var i = 0; i < possibleDirectionsKeys.length; i++) {
      if (possibleDirectionsKeys[i].toLowerCase() === direction.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  // checks if player and monster are at the same location
  private hasPlayerEncounteredMonster(player: Player): boolean {
    if (player.getCurrentLocation() == this.monster.getCurrentLocation()) {
      return true;
    }
    return false;
  }

  public handlePlayerGo(direction: string, player: Player): string {
    let message = "";
    let playerLocation = player.getCurrentLocation();
    let newLocation = this.getNewDirection(direction);
    let area: Area = this.gameState[playerLocation][0];
    if (
      newLocation === undefined ||
      !this.isValidDirection(direction, player)
    ) {
      return "Invalid move";
    }
    if (
      area.hasHazard() &&
      newLocation !== player.getPlayersPreviousLocation()
    ) {
      let previousMove = player.getPlayersPreviousLocation();
      if (newLocation != previousMove) {
        return "Clear the hazard in order to go that way";
      }
    }
    this.gameState[playerLocation][0]
    player.setCurrentLocation(newLocation);
    message = "\n" +
      this.getCurrentArea(player)
        .getLocationName()
        .toUpperCase() + '\n';
    message += this.getCurrentArea(player).getAreaDescription();
    return message;
  }

  // returns numerical representation of direction
  private getNewDirection(direction: string): number | undefined {
    let newDirections = undefined;
    let newLocation: string = direction.toLowerCase();
    if (newLocation == "north") {
      newDirections = Direction.North;
    } else if (newLocation == "east") {
      newDirections = Direction.East;
    } else if (newLocation == "south") {
      newDirections = Direction.South;
    } else if (newLocation == "west") {
      newDirections = Direction.West;
    } else if (newLocation == "northeast") {
      newDirections = Direction.NorthEast;
    } else if (newLocation == "southwest") {
      newDirections = Direction.SouthWest;
    }
    return newDirections;
  }

  public handlePlayerLook(player: Player): string {
    return (
      this.gameState[player.getCurrentLocation()][0].getAreaDescription() +
      "\n" +
      this.getPossibleDirections(player)
    );
  }

  // moves monster through each room
  public moveMonster(): void {
    this.monsterLocation++;
    if (this.monsterLocation > 5) {
      this.monsterLocation = 0;
    }
    this.monster.setCurrentLocation(this.monsterLocation);
  }

  private getCurrentArea(player: Player): Area {
    let playerLocation = player.getCurrentLocation();
    return this.gameState[playerLocation][0];
  }

  // Checks if the player can slay the monster if they have encountered
  public checkGameState(player: Player): boolean {
    if (
      this.monster.monsterIsAlive() &&
      this.hasPlayerEncounteredMonster(player)
    ) {
      if (player.hasMonsterSlayer()) {
        return true; 
      } else {
        return false; 
      }
    }
    if (player.hasTreasure() && this.getCurrentArea(player).isEnd()) {
      return false; 
    }
    return true;
  }

  // Starts the game
  public start(player: Player | undefined): String {
    if (player) {
      let area = this.getCurrentArea(player);
      return (
        area.getLocationName().toUpperCase() +
        "\n" +
        area.getAreaDescription() +
        "\n" +
        this.getPossibleDirections(player) +
        "\n" +
        `What would you like to do?`
      );
    } else {
      return "Error player isn't in board";
    }
  }

  //add player
  public addPlayer(player: Player) {
    this.players.push(player);
  }

  //get game state message for player
  public getGameStateInformation(player: Player): string {
    let response: string = "";
    if (
      this.monster.monsterIsAlive() &&
      this.hasPlayerEncounteredMonster(player)
    ) {
      if (player.hasMonsterSlayer()) {
        response += `${this.monster.getName()} has found you!!!!`;
        response += "\n" + 
          "You can slay him with your [" +
          this.keyItem +
          "], use it now or die!"
      } else {
        response +=
          "You have Died by the hands of " +
          this.monster.getName() +
          " maybe next time..."
        return response;
      }
    }
    if (player.hasTreasure() && this.getCurrentArea(player).isEnd()) {
      response = "Congrats your item has revealed the exit of the labyrinth";
      return response;
    }
    return response;
  }
}

export default Game;
