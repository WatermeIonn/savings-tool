import { randomBytes } from "crypto";

export class GoalDto {
  public constructor(
    private _name: string,
    private _price: number,
    // TODO: remove these from the constructor
    private _saved: number = 0,
    private _id: string = ''
  ) {
    this._id = randomBytes(20).toString('hex');
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }

  public get price(): number {
    return this._price;
  }

  public get saved(): number {
    return this._saved;
  }

  public getPriceToTotal = (totalGoals: number): string => {
    const priceToTotal = (this._price / totalGoals) * 100;
    return priceToTotal.toFixed(1);
  };
}
