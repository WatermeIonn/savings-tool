"use client";

import React from "react";

import { GoalsTableProps } from "@/props/GoalsTableProps";
import { Decimal } from "decimal.js";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";

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
        £{totalSaved.toFixed(2)}
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

  return (
    <div className="relative w-full">
      <Table bottomContent={renderBottomContent && renderBottomContent()}>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>Price to Total</TableColumn>
          <TableColumn>Currently Saved</TableColumn>
          <TableColumn width={300}>Progress</TableColumn>
          <TableColumn width={72}>&nbsp;</TableColumn>
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
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <Spinner color="secondary" size="lg" />
        </div>
      )}
    </div>
  );
}
