export class Hazard {
  private hazardDescription: string;
  private hazardSolutionItem: string;

  constructor(hazardDescription: string, item: string) {
    this.hazardDescription = hazardDescription;
    this.hazardSolutionItem = item;
  }

  public getHazardPrompt(): string {
    return (
      this.hazardDescription +
      " You need [" +
      this.hazardSolutionItem +
      "] to proceed!"
    );
  }

  public getSolution(): string {
    return this.hazardSolutionItem;
  }
}
