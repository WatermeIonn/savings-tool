import { FormInputTypeEnum } from "@/enums/FormInputTypeEnum";
import { FormInputInterface } from "@/interfaces/FormInputInterface";
import { Goal as GoalType } from "@prisma/client";

export class Goal implements GoalType {
  public id: string;
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
      type: FormInputTypeEnum.String,
    },
    {
      label: "Price",
      name: "price",
      isRequired: true,
      startContent: "£",
      type: FormInputTypeEnum.Number,
    },
  ];
}