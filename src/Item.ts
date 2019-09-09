export class Item {
  private itemName: string;
  private isTreasure: boolean;
  private isSlayer: boolean;

  constructor(itemName: string, isTreasure: boolean,
              isMonsterSlayer: boolean) {
    this.itemName = itemName;
    this.isTreasure = isTreasure;
    this.isSlayer = isMonsterSlayer;
  }

  public getItemName(): string {
    return this.itemName;
  }

  // Check if item is the treasure
  public isItemTreasure(): boolean {
    return this.isTreasure;
  }

  // Returns if item can kill the monster
  public isMonsterSlayer(): boolean {
    return this.isSlayer;
  }
}
