"use client";

import { BaseInput } from "@/classes/BaseInput";
import { NumberInput } from "@/classes/NumberInput";
import { Goal, Saving } from "@prisma/client";
import { IconEdit, IconMoneybag, IconPlus, IconX } from "@tabler/icons-react";
import Decimal from "decimal.js";
import { ReactNode, useEffect, useState } from "react";
import FormModal from "./common/formModal";
import YesNoModal from "./common/yesNoModal";
import GoalsTable from "./goalsTable";
import { buttonClass } from "./primitives";

export default function GoalsContainer() {
  const [isMainTableLoading, setIsMainTableLoading] = useState(false);
  const [isPreviewTableLoading, setIsPreviewTableLoading] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsPreview, setGoalsPreview] = useState<Goal[]>([]);

  useEffect(() => {
    setIsMainTableLoading(true);
    fetch("http://localhost:3000/api/goal")
      .then((res) => res.json())
      .then((data) => {
        const goals = data.map((goal: any) => jsonToGoal(goal));
        setGoals(goals);

        if (!goalsPreview.length) {
          setGoalsPreview(goals);
        }

        setIsMainTableLoading(false);
      });
  }, []);

  const handleAddGoal = (goal: Goal): void => {
    fetch("http://localhost:3000/api/goal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    })
      .then((res) => res.json())
      .then((data) => setGoals([...goals, jsonToGoal(data)]));
  };

  const handleEditGoal = (goal: Goal): void => {
    fetch(`http://localhost:3000/api/goal?id=${goal.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    })
      .then((res) => res.json())
      .then((data) => {
        const editedGoal = jsonToGoal(data);
        const index = goals.findIndex((goal) => goal.id === editedGoal.id)

        goals[index] = editedGoal;
        setGoals([...goals]);
      });
  };

  const handleAddSaving = (saving: Saving, simulate?: boolean): void => {
    setIsPreviewTableLoading(true);
    fetch(
      `http://localhost:3000/api/savings${simulate ? "?simulate=true" : ""}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saving),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const goals = data.map((goal: any) => jsonToGoal(goal));
        setGoalsPreview(goals);
        if (!simulate) {
          setGoals(goals);
        }
        setIsPreviewTableLoading(false);
      });
  };

  const handleRemoveGoal = (goal: Goal): void => {
    fetch(`http://localhost:3000/api/goal?id=${goal.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        const goals: Goal[] = data.map((goal: any) => jsonToGoal(goal));
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
          ]}
          renderBottomContent={() => (
            <GoalsTable isLoading={isPreviewTableLoading} goals={goalsPreview} />
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
      isLoading={isMainTableLoading}
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
