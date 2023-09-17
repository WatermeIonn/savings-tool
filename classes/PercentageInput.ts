import { NumberInput } from "./NumberInput";

export class PercentageInput extends NumberInput {
  public validate(): boolean {
    let success = true;

    if (this.value && (Number(this.value!) < 0 || Number(this.value!) > 100)) {
      this.hasError = true;
      this.errorMessage = "Value must be between 0 and 100.";
      success = false;
    }

    return success && super.validate();
  }
}
