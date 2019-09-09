"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Item {
    constructor(itemName, isTreasure, isMonsterSlayer) {
        this.itemName = itemName;
        this.isTreasure = isTreasure;
        this.isSlayer = isMonsterSlayer;
    }
    getItemName() {
        return this.itemName;
    }
    // Check if item is the treasure
    isItemTreasure() {
        return this.isTreasure;
    }
    // Returns if item can kill the monster
    isMonsterSlayer() {
        return this.isSlayer;
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map