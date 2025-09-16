'use client';

import { Input } from '@/classes/Input';
import { NumberInput } from '@/classes/NumberInput';
import { Goal, Saving } from '@prisma/client';
import { IconEdit, IconMoneybag, IconPlus, IconX } from '@tabler/icons-react';
import Decimal from 'decimal.js';
import { ReactNode, useEffect, useState } from 'react';
import FormModal from './common/formModal';
import YesNoModal from './common/yesNoModal';
import GoalsTable from './goalsTable';
import { buttonClass } from './primitives';
import { DropdownInput } from '@/classes/DropdownInput';
import { SortDescriptor } from '@heroui/table';

export default function GoalsContainer() {
  const [isMainTableLoading, setIsMainTableLoading] = useState(false);
  const [isPreviewTableLoading, setIsPreviewTableLoading] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsPreview, setGoalsPreview] = useState<Goal[]>([]);

  useEffect(() => {
    setIsMainTableLoading(true);
    let url = '/api/goal';

    if (sortDescriptor) {
      url += `?sort=${sortDescriptor.column.toString()}&direction=${sortDescriptor.direction}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const goals = data.map((goal: any) => jsonToGoal(goal));
        setGoals(goals);

        if (!goalsPreview.length) {
          setGoalsPreview(goals);
        }

        setIsMainTableLoading(false);
      });
  }, [sortDescriptor, goalsPreview.length]);

  const handleAddGoal = (goal: Goal): void => {
    setIsMainTableLoading(true);
    fetch('/api/goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    })
      .then((res) => res.json())
      .then((data) => {
        setGoals([...goals, jsonToGoal(data)]);
        setIsMainTableLoading(false);
      });
  };

  const handleEditGoal = (goal: Goal): void => {
    setIsMainTableLoading(true);
    fetch(`/api/goal?id=${goal.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    })
      .then((res) => res.json())
      .then((data) => {
        const editedGoal = jsonToGoal(data);
        const index = goals.findIndex((goal) => goal.id === editedGoal.id);

        goals[index] = editedGoal;
        setGoals([...goals]);
        setIsMainTableLoading(false);
      });
  };

  const handleAddSaving = (saving: Saving, allocationType?: string, simulate?: boolean): void => {
    setIsPreviewTableLoading(true);

    const queryVars = [];

    if (allocationType) {
      queryVars.push(`allocationType=${allocationType}`);
    }

    if (simulate) {
      queryVars.push('simulate=true');
    }

    fetch(`/api/savings${queryVars.length ? '?' + queryVars.join('&') : ''}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saving),
    })
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
    setIsMainTableLoading(true);
    fetch(`/api/goal?id=${goal.id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedGoals: Goal[] = goals.filter((existingGoal: Goal) => existingGoal.id !== goal.id);
        setGoalsPreview(updatedGoals);
        setGoals(updatedGoals);
        setIsMainTableLoading(false);
      });
  };

  const renderTopContent = (): ReactNode => (
    <div className="flex">
      <FormModal<Saving>
        onSubmit={(saving: Saving, customVars?: { [key: string]: string }) =>
          handleAddSaving(saving, customVars?.allocationType)
        }
        onChange={(saving: Saving, customVars?: { [key: string]: string }) =>
          handleAddSaving(saving, customVars?.allocationType, true)
        }
        modalTitle={'Add Savings'}
        size="5xl"
        buttonContent={
          <div className={buttonClass.danger}>
            <IconMoneybag className="mr-2" />
            Add Savings
          </div>
        }
        formInputs={[
          new NumberInput({
            label: 'Amount',
            name: 'amount',
            startContent: '£',
            isRequired: true,
          }),
          new DropdownInput({
            label: 'Allocation Type',
            name: 'allocationType',
            value: 'priceToTotal',
            isCustomVar: true,
            options: [
              { value: 'priceToTotal', label: 'Price to Total' },
              { value: 'oldestFirst', label: 'Oldest First' },
              { value: 'lowestPriceFirst', label: 'Lowest Price First' },
              { value: 'highestPriceFirst', label: 'Highest Price First' },
            ],
          }),
        ]}
        renderBottomContent={() => <GoalsTable isLoading={isPreviewTableLoading} goals={goalsPreview} />}
      />
    </div>
  );

  const renderBottomContent = (): ReactNode => (
    <div className="flex justify-center">
      <FormModal<Goal>
        onSubmit={handleAddGoal}
        modalTitle={'Add New Goal'}
        buttonContent={
          <div className={buttonClass.primary}>
            <IconPlus className="rounded-full border-1 border-white mr-2" />
            Add New Goal
          </div>
        }
        formInputs={[
          new Input({
            label: 'Name',
            name: 'name',
            isRequired: true,
          }),
          new NumberInput({
            label: 'Price',
            name: 'price',
            isRequired: true,
            startContent: '£',
          }),
        ]}
      />
    </div>
  );

  const renderRowOptionContent = (goal: Goal): ReactNode => (
    <>
      <div className="inline-block">
        <FormModal<Goal>
          id={goal.id}
          onSubmit={handleEditGoal}
          modalTitle={'Edit Goal'}
          buttonContent={
            <div className="cursor-pointer">
              <IconEdit />
            </div>
          }
          formInputs={[
            new Input({
              label: 'Name',
              name: 'name',
              isRequired: true,
              value: goal.name,
            }),
            new NumberInput({
              label: 'Price',
              name: 'price',
              isRequired: true,
              startContent: '£',
              value: goal.price.toString(),
            }),
          ]}
        />
      </div>
      <div className="inline-block">
        <YesNoModal
          message={`Are you sure you wish to delete this goal (${goal.name})?`}
          noText={'No'}
          yesText={'Yes'}
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
      renderTopContent={renderTopContent}
      renderBottomContent={renderBottomContent}
      renderRowOptionContent={renderRowOptionContent}
      showTotalRow={true}
      allowsSorting
      onSortChange={setSortDescriptor}
      sortDescriptor={sortDescriptor}
    />
  );
}

const jsonToGoal = (goal: any): Goal => {
  return {
    id: goal.id,
    name: goal.name,
    price: new Decimal(goal.price),
    saved: new Decimal(goal.saved),
    dateAdded: goal.dateAdded,
  };
};
