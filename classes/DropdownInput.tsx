import { ChangeEvent, ReactNode, useState } from 'react';
import { Input } from './Input';

export class DropdownInput extends Input {
  public options: { value: string; label: string }[];

  public constructor(data: Partial<DropdownInput>) {
    super(data);
    this.options = data.options ?? [];
  }

  public validate(): boolean {
    if (this.value) {
      if (!this.options.find((option) => option.value === this.value)) {
        this.hasError = true;
        this.errorMessage = 'Invalid option.';
        return false;
      }
    }

    return super.validate();
  }

  public getContent(onChange: (input: Input) => void, isFocused?: boolean): () => ReactNode {
    return () => (
      <div className="mb-5 w-full">
        <label
          className="text-small scale-85 font-medium text-foreground-600 pt-2 absolute"
          style={{ paddingLeft: '5px' }}
        >
          {this.isRequired ? `${this.label} (*)` : this.label}
        </label>
        <select
          value={this.value || ''}
          onChange={(e) => onChange(this.handleChange(e.target.value))}
          className="text-small w-full px-3 py-2 pt-8 bg-default-100 rounded-medium focus:outline-none focus:border-primary hover:border-default-400 transition-colors text-foreground font-sans"
          style={{
            fontFamily: 'var(--font-sans), Inter, system-ui, -apple-system, sans-serif',
            fontSize: '14px',
          }}
        >
          {this.options.map((option) => (
            <option key={option.value} value={option.value} className="text-small">
              {option.label}
            </option>
          ))}
        </select>
        {this.hasError && <div className="text-tiny text-danger mt-1">{this.errorMessage}</div>}
        {this.description && <div className="text-tiny text-foreground-400 mt-1">{this.description}</div>}
      </div>
    );
  }
}
