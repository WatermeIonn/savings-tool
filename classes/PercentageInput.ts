import { BaseInput } from "./BaseInput";
import { NumberInput } from "./NumberInput";

export class PercentageInput extends NumberInput {
  public constructor(data: Partial<BaseInput>) {
    super(data);
    this.validationRules = { ...this.validationRules, min: 0, max: 100 };
  }
}
