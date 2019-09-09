"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hazard {
    constructor(hazardDescription, item) {
        this.hazardDescription = hazardDescription;
        this.hazardSolutionItem = item;
    }
    getHazardPrompt() {
        return (this.hazardDescription +
            " You need [" +
            this.hazardSolutionItem +
            "] to proceed!");
    }
    getSolution() {
        return this.hazardSolutionItem;
    }
}
exports.Hazard = Hazard;
//# sourceMappingURL=Hazard.js.map