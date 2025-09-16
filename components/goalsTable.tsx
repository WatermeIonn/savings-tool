'use client';


import { GoalsTableProps } from '@/props/GoalsTableProps';
import { Progress } from '@heroui/progress';
import { Spinner } from '@heroui/spinner';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import { Decimal } from 'decimal.js';

export default function GoalsTable({
  renderTopContent,
  renderBottomContent,
  renderRowOptionContent,
  onSortChange,
  sortDescriptor,
  isLoading,
  goals,
  showTotalRow,
  allowsSorting,
}: GoalsTableProps) {
  const totalToSave = goals.reduce((runningTotal, { price }) => runningTotal.add(price), new Decimal(0));

  const totalSaved = goals.reduce((runningTotal, { saved }) => runningTotal.add(saved), new Decimal(0));

  const renderTotalRow = (): any => (
    <TableRow key="9999" className="bg-default-100">
      <TableCell colSpan={2} className="font-bold text-right">
        Total to Save:
      </TableCell>
      <TableCell className="font-bold">£{totalToSave.toFixed(2)}</TableCell>
      <TableCell className="font-bold text-right">Total Saved:</TableCell>
      <TableCell className="font-bold">£{totalSaved.toFixed(2)}</TableCell>
      <TableCell>
        <Progress
          isStriped
          showValueLabel
          color="success"
          value={
            !totalSaved.isZero() && !totalToSave.isZero() ? totalSaved.dividedBy(totalToSave).times(100).toNumber() : 0
          }
        />
      </TableCell>
      <TableCell>&nbsp;</TableCell>
    </TableRow>
  );

  return (
    <div className="relative w-full">
      <Table
        onSortChange={onSortChange}
        sortDescriptor={sortDescriptor}
        topContent={renderTopContent && renderTopContent()}
        bottomContent={renderBottomContent && renderBottomContent()}
      >
        <TableHeader>
          <TableColumn key="name" allowsSorting={allowsSorting}>
            Name
          </TableColumn>
          <TableColumn key="dateAdded" allowsSorting={allowsSorting} width={120}>
            Date Added
          </TableColumn>
          <TableColumn key="price" allowsSorting={allowsSorting}>
            Price
          </TableColumn>
          <TableColumn>Price to Total</TableColumn>
          <TableColumn key="saved" allowsSorting={allowsSorting}>
            Currently Saved
          </TableColumn>
          <TableColumn width={300}>Progress</TableColumn>
          <TableColumn width={72}>&nbsp;</TableColumn>
        </TableHeader>
        <TableBody>
          {goals.length ? (
            goals.map((goal, index) => (
              <TableRow key={index}>
                <TableCell>{goal.name}</TableCell>
                <TableCell>{new Date(goal.dateAdded).toLocaleDateString()}</TableCell>
                <TableCell>£{goal.price.toFixed(2)}</TableCell>
                <TableCell>{goal.price.dividedBy(totalToSave).times(100).toDP(1).toString()}%</TableCell>
                <TableCell>£{goal.saved.toFixed(2)}</TableCell>
                <TableCell>
                  <Progress
                    isStriped
                    showValueLabel
                    color="success"
                    value={goal.saved.dividedBy(goal.price).times(100).toNumber()}
                  />
                </TableCell>
                <TableCell>{renderRowOptionContent && renderRowOptionContent(goal)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center" colSpan={7}>
                No goals to display :/
              </TableCell>
            </TableRow>
          )}
          {showTotalRow && goals.length && renderTotalRow()}
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
