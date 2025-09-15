'use client';

import { Input } from '@/classes/Input';
import { buttonClass } from '@/components/primitives';
import { FormProps } from '@/props/FormProps';
import { inputsToDto, inputsToCustomVars } from '@/utils/dto.util';
import { Button } from '@heroui/button';
import React, { SyntheticEvent, useState, useCallback, useRef } from 'react';

export default function Form<T>({
  id,
  onSubmit,
  onChange,
  onClose,
  submitText,
  formInputs,
  renderBottomContent,
}: FormProps<T> & { onClose?: (e: SyntheticEvent) => void }) {
  const [inputs, setInputs] = useState<Input[]>(formInputs);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedOnChange = useCallback((updatedInputs: Input[]) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      onChange?.(inputsToDto(updatedInputs, id), inputsToCustomVars(updatedInputs));
    }, 300);
  }, [onChange, id]);

  const updateInput = (inputToUpdate: Input): void => {
    const inputsCopy = inputs.map((input) => {
      if (input.name === inputToUpdate.name) {
        return inputToUpdate;
      }
      return input;
    });

    setInputs(inputsCopy);
    
    // Call debounced onChange with updated inputs
    if (onChange) {
      debouncedOnChange(inputsCopy);
    }
  };

  const validateInput = (input: Input): boolean => {
    const success = input.validate();
    updateInput(input);
    return success;
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    let success = true;

    for (const input of inputs) {
      if (!validateInput(input)) {
        success = false;
      }
    }

    if (!success) {
      return;
    }

    if (onClose) {
      onClose(e);
    }

    onSubmit(inputsToDto(inputs, id), inputsToCustomVars(inputs));
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {inputs.map((input, key) => (
        <React.Fragment key={key}>
          {input.getContent((input: Input) => {
            updateInput(input);
          }, key === 0)()}
        </React.Fragment>
      ))}
      {renderBottomContent && <div className="mb-5">{renderBottomContent()}</div>}
      <div>
        <Button className={`${buttonClass.primary} float-right`} type="submit">
          {submitText ?? 'Submit'}
        </Button>
      </div>
    </form>
  );
}
