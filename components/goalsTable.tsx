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
} from "@nextui-org/react";
import { IconPlus, IconX } from "@tabler/icons-react";
import FormModal from "./common/formModal";
import { FormInputTypeEnum } from "@/enums/FormInputTypeEnum";
import axios from "axios";
import { plainToClass } from "class-transformer";
import { Goal } from "@/models/goal.model";

export default function GoalsTable() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/goal").then((res) => {
      const goals: Goal[] = res.data.map((json: any) =>
        plainToClass(Goal, json)
      );
      setGoals(goals);
    });
  }, []);

  const handleAddGoal = (goal: Goal): void => {
    axios.post("http://localhost:3000/api/goal", goal).then((res) => {
      setGoals([...goals, plainToClass(Goal, res.data)]);
    });
  };

  // TODO: add confirmation
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
    <FormModal
      type={Goal}
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

  const renderTotalRow = (existingRow: ReactNode): any => {
    return (
      <>
        {existingRow}
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
                totalSaved && totalToSave
                  ? (totalSaved / totalToSave) * 100
                  : 100
              }
            />
          </TableCell>
          <TableCell>&nbsp;</TableCell>
        </TableRow>
      </>
    );
  };

  return (
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
        {goals.map((goal, index) => {
          const { name, price, saved } = goal;

          let row = (
            <TableRow key={index}>
              <TableCell>{name}</TableCell>
              <TableCell>£{price}</TableCell>
              <TableCell>{goal.getPriceToTotal(totalToSave)}%</TableCell>
              <TableCell>£{saved}</TableCell>
              <TableCell>
                <Progress
                  isStriped
                  showValueLabel
                  color="secondary"
                  value={(saved / price) * 100}
                />
              </TableCell>
              <TableCell>
                <span
                  className="cursor-pointer"
                  onClick={() => handleRemoveGoal(goal)}
                >
                  <IconX />
                </span>
              </TableCell>
            </TableRow>
          );

          if (index === goals.length - 1) {
            return renderTotalRow(row);
          }

          return row;
        })}
      </TableBody>
    </Table>
  );
}
