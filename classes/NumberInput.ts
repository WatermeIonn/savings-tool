import { BaseInput } from "./BaseInput";

export class NumberInput extends BaseInput {
  public validate(): boolean {
    if (this.value) {
      if (isNaN(Number(this.value))) {
        this.hasError = true;
        this.errorMessage = "Value must be a number.";
        return false;
      }

      if (
        this.validationRules?.min !== undefined &&
        Number(this.value) < this.validationRules.min
      ) {
        this.hasError = true;
        this.errorMessage = `Value must be higher than ${this.validationRules.min}`;
        return false;
      }

      if (
        this.validationRules?.max !== undefined &&
        Number(this.value) > this.validationRules.max
      ) {
        this.hasError = true;
        this.errorMessage = `Value must be lower than ${this.validationRules.max}`;
        return false;
      }
    }

    return super.validate();
  }

  public getValue(): any {
    return Number(this.value);
  }
}
