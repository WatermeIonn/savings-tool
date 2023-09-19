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
import { Decimal } from "decimal.js";

export default function GoalsTable({
  renderBottomContent,
  renderRowOptionContent,
  isLoading,
  goals,
  showTotalRow,
}: GoalsTableProps) {
  const totalToSave = goals.reduce(
    (runningTotal, { price }) => runningTotal.add(price),
    new Decimal(0)
  );

  const totalSaved = goals.reduce(
    (runningTotal, { saved }) => runningTotal.add(saved),
    new Decimal(0)
  );

  const renderTotalRow = (): any => (
    <TableRow key="9999" className="bg-default-100">
      <TableCell className="font-bold">Total to Save:</TableCell>
      <TableCell className="font-bold">
        £{totalToSave.toString()}
      </TableCell>
      <TableCell className="font-bold">Total Saved:</TableCell>
      <TableCell className="font-bold">
        £{totalSaved.toString()}
      </TableCell>
      <TableCell>
        <Progress
          isStriped
          showValueLabel
          color="secondary"
          value={
            !totalSaved.isZero() && !totalToSave.isZero()
              ? totalSaved.dividedBy(totalToSave).times(100).toNumber()
              : 0
          }
        />
      </TableCell>
      <TableCell>&nbsp;</TableCell>
    </TableRow>
  );

  return isLoading ? (
    <Spinner className="mt-10" color="secondary" />
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
            <TableCell>£{goal.price.toString()}</TableCell>
            <TableCell>
              {goal.price.dividedBy(totalToSave).times(100).toDP(1).toString()}%
            </TableCell>
            <TableCell>£{goal.saved.toFixed(2)}</TableCell>
            <TableCell>
              <Progress
                isStriped
                showValueLabel
                color="secondary"
                value={goal.saved.dividedBy(goal.price).times(100).toNumber()}
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
