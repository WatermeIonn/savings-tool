"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
  Spinner,
} from "@nextui-org/react";
import { IconPlus, IconX } from "@tabler/icons-react";
import FormModal from "./common/formModal";
import { FormInputTypeEnum } from "@/enums/FormInputTypeEnum";
import axios from "axios";
import { Goal } from "@prisma/client";
import YesNoModal from "./common/yesNoModal";

export default function GoalsTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:3000/api/goal").then((res) => {
      setGoals(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleAddGoal = (goal: Goal): void => {
    axios.post("http://localhost:3000/api/goal", goal).then((res) => {
      setGoals([...goals, res.data]);
    });
  };

  const handleRemoveGoal = (goal: Goal): void => {
    axios.delete(`http://localhost:3000/api/goal?id=${goal.id}`).then(() => {
      setGoals(goals.filter((currentGoal) => currentGoal.id !== goal.id));
    });
  };

  const totalToSave = goals.reduce(
    (runningTotal, { price }) => runningTotal + price,
    0
  );

  const totalSaved = goals.reduce(
    (runningTotal, { saved }) => runningTotal + saved,
    0
  );

  const renderBottomContent = (): ReactNode => (
    <FormModal<Goal>
      onSubmit={handleAddGoal}
      modalTitle={"Add New Goal"}
      buttonContent={
        <>
          <IconPlus className="rounded-full border-1 border-white mr-2" />
          Add New Goal
        </>
      }
      formInputs={[
        {
          label: "Name",
          name: "name",
          isRequired: true,
          type: FormInputTypeEnum.String,
        },
        {
          label: "Price",
          name: "price",
          isRequired: true,
          startContent: "£",
          type: FormInputTypeEnum.Number,
        },
      ]}
    />
  );

  const renderTotalRow = (): any => (
    <TableRow key="9999" className="bg-default-100">
      <TableCell className="font-bold">Total to Save:</TableCell>
      <TableCell className="font-bold">£{totalToSave}</TableCell>
      <TableCell className="font-bold">Total Saved:</TableCell>
      <TableCell className="font-bold">£{totalSaved}</TableCell>
      <TableCell>
        <Progress
          isStriped
          showValueLabel
          color="secondary"
          value={
            totalSaved && totalToSave ? (totalSaved / totalToSave) * 100 : 0
          }
        />
      </TableCell>
      <TableCell>&nbsp;</TableCell>
    </TableRow>
  );

  return isLoading ? (
    <Spinner color="secondary" />
  ) : (
    <Table className="w-full" bottomContent={renderBottomContent()}>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Price</TableColumn>
        <TableColumn>Price to Total</TableColumn>
        <TableColumn>Currently Saved</TableColumn>
        <TableColumn width={300}>Progress</TableColumn>
        <TableColumn width={10}>&nbsp;</TableColumn>
      </TableHeader>
      <TableBody>
        {goals.map((goal, index) => (
          <TableRow key={index}>
            <TableCell>{goal.name}</TableCell>
            <TableCell>£{goal.price}</TableCell>
            <TableCell>
              {((goal.price / totalToSave) * 100).toFixed(1)}%
            </TableCell>
            <TableCell>£{goal.saved}</TableCell>
            <TableCell>
              <Progress
                isStriped
                showValueLabel
                color="secondary"
                value={(goal.saved / goal.price) * 100}
              />
            </TableCell>
            <TableCell>
              <YesNoModal
                message={"Are you sure you wish to delete this goal?"}
                noText={"No"}
                yesText={"Yes"}
                onYes={() => handleRemoveGoal(goal)}
                buttonContent={<IconX />}
              />
            </TableCell>
          </TableRow>
        ))}
        {renderTotalRow()}
      </TableBody>
    </Table>
  );
}
