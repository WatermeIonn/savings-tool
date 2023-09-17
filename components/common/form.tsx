"use client";

import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { buttonClass } from "@/components/primitives";
import { FormInputInterface } from "@/interfaces/FormInputInterface";
import { inputsToDto } from "@/utils/dto.util";
import { FormProps } from "@/props/FormProps";

export default function Form<T>({
  onSubmit,
  onClose,
  submitText,
  type,
  formInputs,
}: FormProps<T> & { onClose?: (e: SyntheticEvent) => void }) {
  const [inputs, setInputs] = useState<FormInputInterface[]>(formInputs);

  const updateInput = (inputToUpdate: FormInputInterface): void => {
    const inputsCopy = inputs.map((input) => {
      if (input.name === inputToUpdate.name) {
        return inputToUpdate;
      }
      return input;
    });

    setInputs(inputsCopy);
  };

  const validateInput = (input: FormInputInterface): boolean => {
    let success = true;

    if (input.isRequired && !input.value) {
      input.hasError = true;
      input.errorMessage = "This field is mandatory.";
      success = false;
    } else if (input.type === "number" && isNaN(Number(input.value))) {
      input.hasError = true;
      input.errorMessage = "Value must be a number.";
      success = false;
    } else {
      input.hasError = false;
    }

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

    onSubmit(inputsToDto(inputs, type));
  };

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map(
        ({ label, name, startContent, hasError, errorMessage }, key) => (
          <Input
            key={key}
            label={label}
            name={name}
            className="mb-5 w-full"
            onChange={handleChange}
            startContent={startContent}
            validationState={hasError ? "invalid" : "valid"}
            errorMessage={errorMessage}
          />
        )
      )}
      <div className="text-right">
        <Button className={buttonClass.primary} type="submit">
          {submitText ?? "Submit"}
        </Button>
      </div>
    </form>
  );
}
