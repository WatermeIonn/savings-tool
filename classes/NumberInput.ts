import { BaseInput } from "./BaseInput";

export class NumberInput extends BaseInput {
  public validate(): boolean {
    let success = true;

    if (this.value && isNaN(Number(this.value))) {
      this.hasError = true;
      this.errorMessage = "Value must be a number.";
      success = false;
    }

    return success && super.validate();
  }

  public getValue(): any {
    return Number(this.value);
  }
}
