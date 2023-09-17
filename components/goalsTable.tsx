"use client";

import React from "react";
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
import { GoalsTableProps } from "@/props/GoalsTableProps";

export default function GoalsTable({
  renderBottomContent,
  renderRowOptionContent,
  isLoading,
  goals,
  showTotalRow
}: GoalsTableProps) {
  const totalToSave = goals.reduce(
    (runningTotal, { price }) => runningTotal + price,
    0
  );

  const totalSaved = goals.reduce(
    (runningTotal, { saved }) => runningTotal + saved,
    0
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
    <Table
      className="w-full"
      bottomContent={renderBottomContent && renderBottomContent()}
    >
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
            <TableCell>£{goal.saved.toFixed(2)}</TableCell>
            <TableCell>
              <Progress
                isStriped
                showValueLabel
                color="secondary"
                value={(goal.saved / goal.price) * 100}
              />
            </TableCell>
            <TableCell>
              {renderRowOptionContent && renderRowOptionContent(goal)}
            </TableCell>
          </TableRow>
        ))}
        {showTotalRow && renderTotalRow()}
      </TableBody>
    </Table>
  );
}
