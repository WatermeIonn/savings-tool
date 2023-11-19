"use client";

import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { buttonClass } from "@/components/primitives";
import { inputsToDto } from "@/utils/dto.util";
import { FormProps } from "@/props/FormProps";
import { BaseInput } from "@/classes/BaseInput";

export default function Form<T>({
  id,
  onSubmit,
  onChange,
  onClose,
  submitText,
  formInputs,
}: FormProps<T> & { onClose?: (e: SyntheticEvent) => void }) {
  const [inputs, setInputs] = useState<BaseInput[]>(formInputs);

  const updateInput = (inputToUpdate: BaseInput): void => {
    const inputsCopy = inputs.map((input) => {
      if (input.name === inputToUpdate.name) {
        return inputToUpdate;
      }
      return input;
    });

    setInputs(inputsCopy);
  };

  const validateInput = (input: BaseInput): boolean => {
    const success = input.validate();
    updateInput(input);
    return success;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const inputToUpdate = inputs.find((input) => input.name === name);

    if (!inputToUpdate) {
      throw new Error(`Could not find input ${name} to update!`);
    }

    inputToUpdate.value = value;
    updateInput(inputToUpdate);
    if (onChange) {
      onChange(inputsToDto(inputs));
    }
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

    onSubmit(inputsToDto(inputs, id));
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {inputs.map(
        (
          {
            label,
            name,
            startContent,
            endContent,
            hasError,
            errorMessage,
            customInput,
            isRequired,
            description,
            value
          },
          key
        ) =>
          customInput || (
            <Input
              autoFocus={key === 0}
              key={key}
              label={isRequired ? `${label} (*)` : label}
              name={name}
              className="mb-5 w-full"
              onChange={handleChange}
              startContent={startContent}
              endContent={endContent}
              isInvalid={hasError}
              errorMessage={errorMessage}
              description={description}
              defaultValue={value}
            />
          )
      )}
      <div>
        <Button className={`${buttonClass.primary} float-right`} type="submit">
          {submitText ?? "Submit"}
        </Button>
      </div>
    </form>
  );
}
