import { Input } from './Input';
import { NumberInput } from './NumberInput';

export class PercentageInput extends NumberInput {
  public constructor(data: Partial<Input>) {
    super(data);
    this.validationRules = { ...this.validationRules, min: 0, max: 100 };
  }
}
