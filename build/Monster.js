"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Monster {
    // Creates the monster object
    constructor(monsterName, monsterSpawn) {
        this.isMonsterAlive = true;
        this.monsterName = monsterName;
        this.monsterCurrentLocation = monsterSpawn;
    }
    // Sets the monster's location
    setCurrentLocation(index) {
        if (this.isMonsterAlive) {
            if (index < 0 || index > 6) {
                console.log("Server Model Error: index out of bounds");
            }
            else {
                this.monsterCurrentLocation = index;
            }
        }
        else {
            this.monsterCurrentLocation = 4;
        }
    }
    // Gets and returns the monster's location
    getCurrentLocation() {
        return this.monsterCurrentLocation;
    }
    getName() {
        return this.monsterName;
    }
    monsterIsAlive() {
        return this.isMonsterAlive;
    }
    // Checks if monster is defeated
    defeat() {
        this.isMonsterAlive = false;
    }
}
exports.Monster = Monster;
//# sourceMappingURL=Monster.js.map