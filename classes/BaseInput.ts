import { ValidationRules } from "@/types/ValidationRules.type";
import { ReactNode } from "react";

export class BaseInput {
  /** Indicates whether the input has an error. (optional) */
  public hasError?: boolean;

  /** The error message that is displayed when hasError is true. (optional) */
  public errorMessage?: string;

  /** Label to display on input. (optional) */
  public label?: string;

  /** Name of field. */
  public name: string;

  /** Indicates whether the input is required. If true, and the user doesn't enter any value,
   * the value of errorMessage is displayed. (optional) */
  public isRequired?: boolean;

  /** Content that should be shown before input e.g. "£". (optional) */
  public startContent?: ReactNode;

  /** Content that hsould be shown after input e.g. "%". (optional) */
  public endContent?: ReactNode;

  /** Current value of the input. (optional) */
  public value?: string;

  /** Indicates if value of the input is computed from other fields, in which case it is excluded from submit calls. (optional) */
  public isComputed?: boolean;

  /** Used to render a custom input on the form. (optional) */
  public customInput?: ReactNode;

  /** Description displayed under the input to give a helpful hint to the user (optional) */
  public description?: string;

  public constructor(data: Partial<BaseInput>) {
    Object.assign(this, data);
  }

  public validationRules?: ValidationRules;

  public validate(): boolean {
    if (this.isRequired && !this.value) {
      this.hasError = true;
      this.errorMessage = "This field is mandatory.";
      return false;
    }

    return true;
  }

  public getValue(): any {
    return this.value;
  }
}
