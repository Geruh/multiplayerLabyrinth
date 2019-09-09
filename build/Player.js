"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(startLocation, playerID, client) {
        this.playersInventory = [];
        this.playerCurrentLocation = startLocation;
        this.playerPrevLocation = 0;
        this.hasTheTreasure = false;
        this.hasMonsterWeapon = false;
        this.client = client;
        this.playerID = playerID;
    }
    getClient() {
        return this.client;
    }
    getID() {
        return this.playerID;
    }
    // Gets and returns player's previous location
    getPlayersPreviousLocation() {
        return this.playerPrevLocation;
    }
    setCurrentLocation(index) {
        if (index < 0 || index > 6) {
            console.log("Index out of bounds");
        }
        else {
            this.playerPrevLocation = this.playerCurrentLocation;
            this.playerCurrentLocation = index;
        }
    }
    getCurrentLocation() {
        return this.playerCurrentLocation;
    }
    placeItemInBackpack(item) {
        this.hasTheTreasure = item.isItemTreasure();
        this.hasMonsterWeapon = item.isMonsterSlayer();
        this.playersInventory.push(item);
    }
    // Removes item from inventory
    removeItemInBackpack(item) {
        for (let i = 0; i < this.playersInventory.length; i++) {
            if (this.playersInventory[i].getItemName().toLowerCase() ===
                item.toLowerCase()) {
                this.playersInventory.splice(i, 1);
            }
        }
    }
    // Shows inventory to player
    showInventory() {
        if (this.playersInventory.length == 0) {
            return "You have no items in your inventory.";
        }
        else {
            let playerInventoryString = this.playersInventory.map(function (item) {
                return item["itemName"];
            });
            return "Inventory: " + playerInventoryString;
        }
    }
    // Checks if item is in inventory. 
    hasItem(item) {
        let findItem = this.playersInventory.find(itemName => itemName.getItemName().toLowerCase() === item.toLowerCase());
        if (findItem) {
            return true;
        }
        else {
            return false;
        }
    }
    // Returns if player has the treasure
    hasTreasure() {
        return this.hasTheTreasure;
    }
    // Returns if the monster has been killed
    hasMonsterSlayer() {
        return this.hasMonsterWeapon;
    }
    dropItem(item) {
        for (let i = 0; i < this.playersInventory.length; i++) {
            if (this.playersInventory[i].getItemName().toLowerCase() ===
                item.toLowerCase()) {
                let inventoryItem = this.playersInventory[i];
                this.removeItemInBackpack(item);
                return inventoryItem;
            }
        }
        return null;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map