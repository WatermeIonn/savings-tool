import { ValidationRules } from '@/types/ValidationRules.type';
import { Input as HeroUiInput } from '@heroui/input';
import { ReactNode } from 'react';

export class Input {
  /** Indicates whether the input has an error. (optional) */
  public hasError?: boolean;

  /** The error message that is displayed when hasError is true. (optional) */
  public errorMessage?: string;

  /** Label to display on input. (optional) */
  public readonly label?: string;

  /** Name of field. */
  public readonly name: string;

  /** Indicates whether the input is required. If true, and the user doesn't enter any value,
   * the value of errorMessage is displayed. (optional) */
  public readonly isRequired?: boolean;

  /** Content that should be shown before input e.g. "£". (optional) */
  public readonly startContent?: ReactNode;

  /** Content that should be shown after input e.g. "%". (optional) */
  public readonly endContent?: ReactNode;

  /** Current value of the input. (optional) */
  public value?: string;

  /** Indicates if value of the input is computed from other fields, in which case it is excluded from submit calls. (optional) */
  public readonly isComputed?: boolean;

  /** Indicates if value is a custom variable that is not part of the schema, in which case it is included in the 'customVars' object of onChange event (optional) */
  public readonly isCustomVar?: boolean;

  /** Description displayed under the input to give a helpful hint to the user (optional) */
  public readonly description?: string;

  public constructor(data: Partial<Input>) {
    Object.assign(this, data);
  }

  public validationRules?: ValidationRules;

  public validate(): boolean {
    if (this.isRequired && !this.value) {
      this.hasError = true;
      this.errorMessage = 'This field is mandatory.';
      return false;
    }

    return true;
  }

  public getValue(): any {
    return this.value;
  }

  /** Returns a function that returns a ReactNode to render the input */
  public getContent(onChange: (input: Input) => void, isFocused: boolean = false): () => ReactNode {
    return () => (
      <HeroUiInput
        autoFocus={isFocused}
        label={this.isRequired ? `${this.label} (*)` : this.label}
        name={this.name}
        className="mb-5 w-full"
        onChange={(e) => onChange(this.handleChange(e.target.value))}
        startContent={this.startContent}
        endContent={this.endContent}
        isInvalid={this.hasError}
        errorMessage={this.errorMessage}
        description={this.description}
        defaultValue={this.value}
      />
    );
  }

  protected handleChange(value: string): this {
    this.value = value;
    return this;
  }
}
