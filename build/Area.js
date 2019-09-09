"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Creates an Area for the game
class Area {
    // Creates an Area object
    constructor(name, areaDescription, isAreaEnd) {
        this.areaName = name.toUpperCase();
        this.areaDescription = areaDescription;
        this.areaIsEnd = isAreaEnd;
        this.areaItem = null;
        this.areaHazard = null;
    }
    // Gets and returns location name
    getLocationName() {
        return this.areaName;
    }
    // Gets and returns location's description
    getLocationDescription() {
        return this.areaDescription;
    }
    // Gets area text prompt
    getAreaDescription() {
        let prompt = "";
        if (this.hasHazard()) {
            if (this.areaHazard !== null) {
                prompt = this.areaHazard.getHazardPrompt();
            }
        }
        else {
            prompt = this.areaDescription;
            if (this.hasItem()) {
                if (this.areaItem !== null) {
                    return prompt + '\n' + "There is a " + this.areaItem.getItemName() + " on the table.";
                }
            }
        }
        return prompt;
    }
    // Adds item to the area
    addItemToArea(item) {
        this.areaItem = item;
    }
    // Gets and returns item from area
    getItem() {
        return this.areaItem;
    }
    // Removes item from area
    removeItemFromArea(item) {
        this.areaItem = null;
    }
    // Adds hazard to the area
    addHazardToArea(hazard) {
        this.areaHazard = hazard;
    }
    // Gets and returns harzard
    getHazard() {
        return this.areaHazard;
    }
    // Returns if area has hazard
    hasHazard() {
        if (this.areaHazard) {
            return true;
        }
        return false;
    }
    // Returns if there is an item in this area
    hasItem() {
        if (this.areaItem) {
            return true;
        }
        return false;
    }
    // Gets rid of hazard in the area
    resolveHazard() {
        this.areaHazard = null;
    }
    // Returns if area is the exit
    isEnd() {
        return this.areaIsEnd;
    }
}
exports.Area = Area;
//# sourceMappingURL=Area.js.map