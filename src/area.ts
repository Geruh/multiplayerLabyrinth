import { Item } from "./Item";
import { Hazard } from "./Hazard";
import { Player } from "./Player";

// Creates an Area for the game
export class Area {
  private areaName: string;
  private areaDescription: string;
  private areaItem: Item | null;
  private areaHazard: Hazard | null;
  private areaIsEnd: boolean;

  // Creates an Area object
  constructor(name: string, areaDescription: string, isAreaEnd: boolean) {
    this.areaName = name.toUpperCase();
    this.areaDescription = areaDescription;
    this.areaIsEnd = isAreaEnd;
    this.areaItem = null;
    this.areaHazard = null;
  }
  
  // Gets and returns location name
  public getLocationName(): string {
    return this.areaName;
  }

  // Gets and returns location's description
  public getLocationDescription(): string {
    return this.areaDescription;
  }

  // Gets area text prompt
  public getAreaDescription(): string {
    let prompt = "";
    if (this.hasHazard()) {
      if (this.areaHazard !== null) {
       prompt = this.areaHazard.getHazardPrompt();
        
      }  
      } else {
      prompt = this.areaDescription;
      if (this.hasItem()) {
        if (this.areaItem !== null) {
          return prompt + '\n' + "There is a " + this.areaItem.getItemName() + " on the table.";
        }
      }
    }
    return prompt
  }

  // Adds item to the area
  public addItemToArea(item: Item): void {
    this.areaItem = item;
  }

  // Gets and returns item from area
  public getItem(): Item | null {
    return this.areaItem;
  }

  // Removes item from area
  public removeItemFromArea(item: Item): void {
    this.areaItem = null;
  }

  // Adds hazard to the area
  public addHazardToArea(hazard: Hazard): void {
    this.areaHazard = hazard;
  }

  // Gets and returns harzard
  public getHazard(): Hazard | null {
    return this.areaHazard;
  }

  // Returns if area has hazard
  public hasHazard(): boolean {
    if (this.areaHazard) {
      return true;
    }
    return false;
  }

  // Returns if there is an item in this area
  public hasItem(): boolean {
    if (this.areaItem) {
      return true;
    }
    return false;
  }

  // Gets rid of hazard in the area
  public resolveHazard(): void {
    this.areaHazard = null;
  }

  // Returns if area is the exit
  public isEnd(): boolean {
    return this.areaIsEnd;
  }
}
