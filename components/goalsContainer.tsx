"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { IconEdit, IconMoneybag, IconPlus, IconX } from "@tabler/icons-react";
import FormModal from "./common/formModal";
import axios from "axios";
import { Goal, Saving } from "@prisma/client";
import YesNoModal from "./common/yesNoModal";
import GoalsTable from "./goalsTable";
import { BaseInput } from "@/classes/BaseInput";
import { NumberInput } from "@/classes/NumberInput";
import { PercentageInput } from "@/classes/PercentageInput";
import Decimal from "decimal.js";
import { buttonClass } from "./primitives";

export default function GoalsContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsPreview, setGoalsPreview] = useState<Goal[]>([]);

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:3000/api/goal").then((res) => {
      const goals = res.data.map((goal: any) => jsonToGoal(goal));
      setGoals(goals);

      if (!goalsPreview.length) {
        setGoalsPreview(goals);
      }

      setIsLoading(false);
    });
  }, []);

  const handleAddGoal = (goal: Goal): void => {
    axios
      .post("http://localhost:3000/api/goal", goal)
      .then((res) => setGoals([...goals, jsonToGoal(res.data)]));
  };

  const handleEditGoal = (goal: Goal): void => {
    axios
      .put(`http://localhost:3000/api/goal?id=${goal.id}`, goal)
      .then((res) => {
        const editedGoal = jsonToGoal(res.data);
        const index = goals.findIndex((goal) => goal.id === editedGoal.id)

        goals[index] = editedGoal;
        setGoals([...goals]);
      });
  };

  const handleAddSaving = (saving: Saving, simulate?: boolean): void => {
    axios
      .post(
        `http://localhost:3000/api/savings${simulate ? "?simulate=true" : ""}`,
        saving
      )
      .then((res) => {
        const goals = res.data.map((goal: any) => jsonToGoal(goal));
        setGoalsPreview(goals);
        if (!simulate) {
          setGoals(goals);
        }
      });
  };

  const handleRemoveGoal = (goal: Goal): void => {
    axios.delete(`http://localhost:3000/api/goal?id=${goal.id}`).then((res) => {
      const goals: Goal[] = res.data.map((goal: any) => jsonToGoal(goal));
      setGoalsPreview(goals);
      setGoals(goals);
    });
  };

  const renderBottomContent = (): ReactNode => (
    <>
      <div className="flex justify-center">
        <FormModal<Goal>
          onSubmit={handleAddGoal}
          modalTitle={"Add New Goal"}
          buttonContent={
            <div className={buttonClass.primary}>
              <IconPlus className="rounded-full border-1 border-white mr-2" />
              Add New Goal
            </div>
          }
          formInputs={[
            new BaseInput({
              label: "Name",
              name: "name",
              isRequired: true,
            }),
            new NumberInput({
              label: "Price",
              name: "price",
              isRequired: true,
              startContent: "£",
            }),
          ]}
        />
      </div>
      <div className="flex justify-center">
        <FormModal<Saving>
          onSubmit={(saving: Saving) => handleAddSaving(saving)}
          onChange={(saving: Saving) => handleAddSaving(saving, true)}
          modalTitle={"Add Savings"}
          size="5xl"
          buttonContent={
            <div className={buttonClass.secondary}>
              <IconMoneybag className="mr-2" />
              Add Savings
            </div>
          }
          formInputs={[
            new NumberInput({
              label: "Amount",
              name: "amount",
              startContent: "£",
              isRequired: true,
            }),
            new PercentageInput({
              label: "Max Percentage",
              name: "maxPercentage",
              endContent: "%",
              description:
                "Set this to define a maximum percentage that can be allocated. Any remaining money is spread across other goals.",
            }),
          ]}
          renderBottomContent={() => (
            <GoalsTable isLoading={false} goals={goalsPreview} />
          )}
        />
      </div>
    </>
  );

  const renderRowOptionContent = (goal: Goal): ReactNode => (
    <>
      <div className="inline-block">
        <FormModal<Goal>
          id={goal.id}
          onSubmit={handleEditGoal}
          modalTitle={"Edit Goal"}
          buttonContent={
            <div className="cursor-pointer">
              <IconEdit />
            </div>
          }
          formInputs={[
            new BaseInput({
              label: "Name",
              name: "name",
              isRequired: true,
              value: goal.name,
            }),
            new NumberInput({
              label: "Price",
              name: "price",
              isRequired: true,
              startContent: "£",
              value: goal.price.toString(),
            }),
          ]}
        />
      </div>
      <div className="inline-block">
        <YesNoModal
          message={`Are you sure you wish to delete this goal (${goal.name})?`}
          noText={"No"}
          yesText={"Yes"}
          onYes={() => handleRemoveGoal(goal)}
          buttonContent={<IconX />}
        />
      </div>
    </>
  );

  return (
    <GoalsTable
      isLoading={isLoading}
      goals={goals}
      renderBottomContent={renderBottomContent}
      renderRowOptionContent={renderRowOptionContent}
      showTotalRow={true}
    />
  );
}

const jsonToGoal = (goal: any): Goal => {
  return {
    id: goal.id,
    name: goal.name,
    price: new Decimal(goal.price),
    saved: new Decimal(goal.saved),
  };
};
