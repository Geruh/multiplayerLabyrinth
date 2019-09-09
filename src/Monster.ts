import { Movable } from "./Movable";

export class Monster implements Movable {
  private monsterName: string;
  private monsterCurrentLocation: number;
  private isMonsterAlive: boolean = true;

  // Creates the monster object
  constructor(monsterName: string, monsterSpawn: number) {
    this.monsterName = monsterName;
    this.monsterCurrentLocation = monsterSpawn;
  }

  // Sets the monster's location
  public setCurrentLocation(index: number): void {
    if (this.isMonsterAlive) {
      if (index < 0 || index > 6) {
        console.log("Server Model Error: index out of bounds");
      } else {
        this.monsterCurrentLocation = index;
      }
    } else {
      this.monsterCurrentLocation = 4;
    }
  }

  // Gets and returns the monster's location
  public getCurrentLocation(): number {
    return this.monsterCurrentLocation;
  }

  public getName(): string {
    return this.monsterName;
  }

  public monsterIsAlive(): boolean {
    return this.isMonsterAlive;
  }

  // Checks if monster is defeated
  public defeat(): void {
    this.isMonsterAlive = false;
  }
}
