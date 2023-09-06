import { FormInputInterface } from "@/interfaces/FormInputInterface";
import { randomBytes } from "crypto";

export class GoalDto {
  // TODO: remove default value. This should be handled in the API
  public id?: string = randomBytes(20).toString("hex");
  public name: string;
  public price: number;
  public saved: number = 0;

  public getPriceToTotal = (totalGoals: number): string => {
    const priceToTotal = (this.price / totalGoals) * 100;
    return priceToTotal.toFixed(1);
  };

  public readonly formInputs: FormInputInterface[] = [
    {
      label: "Name",
      name: "name",
      isRequired: true,
      type: "string",
    },
    {
      label: "Price",
      name: "price",
      isRequired: true,
      startContent: "£",
      type: "number",
    },
  ]
}
