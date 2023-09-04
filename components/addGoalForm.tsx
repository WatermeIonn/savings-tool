"use client";

import React, { ChangeEvent, ReactNode, SyntheticEvent, useState } from "react";
import { GoalDto } from "@/dtos/goal.dto";
import { Button, Input } from "@nextui-org/react";
import { buttonClass } from "./primitives";

interface AddGoalFormProps {
  onAdd: (goal: GoalDto) => void;
  onClose: (e: SyntheticEvent) => void;
}

interface FormInputInterface {
  hasError: boolean;
  errorMessage?: string;
  label: string;
  name: string;
  isRequired: boolean;
  startContent?: ReactNode;
  value?: string;
  type: "string" | "number";
}

const formInputs: FormInputInterface[] = [
  {
    hasError: false,
    label: "Name",
    name: "name",
    isRequired: true,
    type: "string",
  },
  {
    hasError: false,
    label: "Price",
    name: "price",
    isRequired: true,
    startContent: "£",
    type: "number",
  },
];

export default function AddGoalButton({ onAdd, onClose }: AddGoalFormProps) {
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

  // TODO: improve validation
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

    const name = inputs.find((x) => x.name === "name")!.value!;
    const price = Number(inputs.find((x) => x.name === "price")!.value!);

    onClose(e);
    onAdd(new GoalDto(name, price));
  };

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map(
        (
          { isRequired, label, name, startContent, hasError, errorMessage },
          key
        ) => (
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
          Action
        </Button>
      </div>
    </form>
  );
}
