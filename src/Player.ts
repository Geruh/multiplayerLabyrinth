import { Item } from "./Item";
import { Movable } from "./Movable";
import WebSocket from "ws";


export class Player implements Movable {
  private client: WebSocket;
  private playersInventory: Item[];
  private playerCurrentLocation: number;
  private playerPrevLocation: number;
  private hasTheTreasure: boolean;
  private hasMonsterWeapon: boolean;
  private playerID: number;
  

  constructor(startLocation: number, playerID: number, client:WebSocket) {
    this.playersInventory = [];
    this.playerCurrentLocation = startLocation;
    this.playerPrevLocation = 0;
    this.hasTheTreasure = false;
    this.hasMonsterWeapon = false;
    this.client = client;
    this.playerID = playerID;

  }

  public getClient(): WebSocket {
    return this.client;
  }

  public getID(): number {
    return this.playerID;
  }
  
  // Gets and returns player's previous location
  public getPlayersPreviousLocation(): number {
    return this.playerPrevLocation;
  }

  public setCurrentLocation(index: number): void {
    if (index < 0 || index > 6) {
      console.log("Index out of bounds");
    } else {
      this.playerPrevLocation = this.playerCurrentLocation;
      this.playerCurrentLocation = index;
    }
  }

  public getCurrentLocation(): number {
    return this.playerCurrentLocation;
  }

  public placeItemInBackpack(item: Item): void {
    this.hasTheTreasure = item.isItemTreasure();
    this.hasMonsterWeapon = item.isMonsterSlayer();
    this.playersInventory.push(item);
  }

  // Removes item from inventory
  public removeItemInBackpack(item: String): void {
    for (let i = 0; i < this.playersInventory.length; i++) {
      if (
        this.playersInventory[i].getItemName().toLowerCase() ===
        item.toLowerCase()
      ) {
        this.playersInventory.splice(i, 1);
      }
    }
  }

  // Shows inventory to player
  public showInventory(): string {
    if (this.playersInventory.length == 0) {
      return "You have no items in your inventory.";
    } else {
      let playerInventoryString = this.playersInventory.map(function (item) {
        return item["itemName"];
      });
      return "Inventory: " + playerInventoryString;
    }
  }

  // Checks if item is in inventory. 
  public hasItem(item: String): boolean {
    let findItem = this.playersInventory.find(
      itemName => itemName.getItemName().toLowerCase() === item.toLowerCase()
    );
    if (findItem) {
      return true
    } else {
      return false;
    }
  }

  // Returns if player has the treasure
  public hasTreasure(): boolean {
    return this.hasTheTreasure;
  }

  // Returns if the monster has been killed
  public hasMonsterSlayer(): boolean {
    return this.hasMonsterWeapon;
  }

  public dropItem(item: String) : Item | null {
    for (let i = 0; i < this.playersInventory.length; i++) {
      if (
        this.playersInventory[i].getItemName().toLowerCase() ===
        item.toLowerCase()
      ) {
        let inventoryItem = this.playersInventory[i];
        this.removeItemInBackpack(item);
        return inventoryItem;
      }
    }
    return null;
  }
}
