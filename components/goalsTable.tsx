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
import { GoalDto } from "@/dtos/goal.dto";
import { GoalApi } from "@/apis/goal.api";
import AddGoalButton from "./addGoalButton";
import { IconX } from "@tabler/icons-react";

interface GoalsTableProps {
  heading?: string;
}

export default function GoalsTable({ heading }: GoalsTableProps) {
  const [goals, setGoals] = useState<GoalDto[]>([]);

  useEffect(() => {
    GoalApi.getAll().then((goals) => setGoals(goals));
  }, []);

  const handleAddGoal = (goal: GoalDto): void => {
    GoalApi.post(goal).then((result) => setGoals([...goals, result]));
  };

  // TODO: add confirmation
  const handleRemoveGoal = (goal: GoalDto): void => {
    GoalApi.delete(goal).then((result) =>
      setGoals(goals.filter((goal) => goal.id !== result.id))
    );
  };

  const renderBottomContent = (): ReactNode => (
    <AddGoalButton onAdd={handleAddGoal} />
  );

  const totalToSave = goals.reduce(
    (runningTotal, { price }) => runningTotal + price,
    0
  );
  const totalSaved = goals.reduce(
    (runningTotal, { saved }) => runningTotal + saved,
    0
  );

  return (
    <Table
      className="w-full"
      topContent={heading}
      bottomContent={renderBottomContent()}
    >
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Price</TableColumn>
        <TableColumn>Price to Total</TableColumn>
        <TableColumn>Currently Saved</TableColumn>
        <TableColumn width={300}>Progress</TableColumn>
        <TableColumn width={10} />
      </TableHeader>
      <TableBody>
        {goals.map((goal, index) => {
          const { name, price, saved } = goal;
          return (
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
        })}
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
          <TableCell />
        </TableRow>
      </TableBody>
    </Table>
  );
}
