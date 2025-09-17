'use client';

import { DropdownInput } from '@/classes/DropdownInput';
import { Input } from '@/classes/Input';
import { NumberInput } from '@/classes/NumberInput';
import { PriorityInput } from '@/classes/PriorityInput';
import { apiCall } from '@/utils/api.util';
import { Tab, Tabs } from '@heroui/react';
import { SortDescriptor } from '@heroui/table';
import { Goal, Saving } from '@prisma/client';
import { IconCirclePlus, IconEdit, IconEraser, IconMoneybag, IconX } from '@tabler/icons-react';
import Decimal from 'decimal.js';
import { ReactNode, useEffect, useState } from 'react';
import FormModal from './common/formModal';
import YesNoModal from './common/yesNoModal';
import GoalsTable from './goalsTable';
import { buttonClass } from './primitives';

export default function GoalsContainer() {
  const [isMainTableLoading, setIsMainTableLoading] = useState(true);
  const [isPreviewTableLoading, setIsPreviewTableLoading] = useState(false);
  const [status, setStatus] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsPreview, setGoalsPreview] = useState<Goal[]>([]);

  useEffect(() => {
    fetchGoals();
  }, [status, sortDescriptor, goalsPreview.length]);

  const handleAddGoal = (goal: Goal): void => {
    setIsMainTableLoading(true);
    apiCall({
      url: '/api/goal',
      options: { method: 'POST', body: goal },
      errorMessage: 'Failed to add goal',
      onSuccess: (data) => {
        setGoals([...goals, jsonToGoal(data)]);
        setGoalsPreview([...goalsPreview, jsonToGoal(data)]);
      },
      onFinally: () => {
        setIsMainTableLoading(false);
        setStatus('ACTIVE');
      },
    });
  };

  const fetchGoals = () => {
    setIsMainTableLoading(true);
    let url = '/api/goal';
    const params = [];

    if (sortDescriptor) {
      params.push(`sort=${sortDescriptor.column.toString()}&direction=${sortDescriptor.direction}`);
    }

    if (status) {
      params.push(`status=${status}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    apiCall({
      url,
      errorMessage: 'Failed to fetch goals',
      onSuccess: (data) => {
        const goals = data.map((goal: any) => jsonToGoal(goal));
        setGoals(goals);
        setGoalsPreview(goals);
      },
      onFinally: () => setIsMainTableLoading(false),
    });
  };

  const handleEditGoal = (goal: Goal): void => {
    setIsMainTableLoading(true);
    apiCall({
      url: `/api/goal?id=${goal.id}`,
      options: { method: 'PUT', body: goal },
      errorMessage: 'Failed to edit goal',
      onSuccess: (data) => {
        const editedGoal = jsonToGoal(data);
        const index = goals.findIndex((goal) => goal.id === editedGoal.id);
        goals[index] = editedGoal;
        setGoals([...goals]);
      },
      onFinally: () => setIsMainTableLoading(false),
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

    apiCall({
      url: `/api/savings${queryVars.length ? '?' + queryVars.join('&') : ''}`,
      options: { method: 'POST', body: saving },
      errorMessage: 'Failed to add saving',
      onSuccess: (data) => {
        const goals = goalsPreview.map((existingGoal) => {
          const updatedGoal = data.find((g: string) => jsonToGoal(g).id === existingGoal.id);
          return { ...existingGoal, saved: jsonToGoal(updatedGoal).saved };
        });

        setGoalsPreview(goals);

        if (!simulate) {
          setGoals(goals);
        }
      },
      onFinally: () => setIsPreviewTableLoading(false),
    });
  };

  const handleRemoveGoal = (goal: Goal): void => {
    setIsMainTableLoading(true);
    apiCall({
      url: `/api/goal?id=${goal.id}`,
      options: { method: 'DELETE' },
      errorMessage: 'Failed to delete goal',
      onSuccess: () => {
        const updatedGoals: Goal[] = goals.filter((existingGoal: Goal) => existingGoal.id !== goal.id);
        setGoalsPreview(updatedGoals);
        setGoals(updatedGoals);
      },
      onFinally: () => setIsMainTableLoading(false),
    });
  };

  const handleRemoveCompletedGoals = (): void => {
    setIsMainTableLoading(true);
    const completedGoals = goals.filter((goal) => goal.price.equals(goal.saved));

    Promise.all(
      completedGoals.map((goal) =>
        apiCall({
          url: `/api/goal?id=${goal.id}`,
          options: { method: 'PUT', body: { ...goal, status: 'COMPLETED' } },
          errorMessage: `Failed to mark goal ${goal.name} as completed`,
        })
      )
    ).finally(() => {
      fetchGoals();
    });
  };

  const renderTopContent = (): ReactNode => (
    <>
      <div className="flex justify-between w-full">
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
              value: 'highestPriorityFirst',
              isCustomVar: true,
              options: [
                { value: 'highestPriorityFirst', label: 'Highest Priority First' },
                { value: 'priceToTotal', label: 'Price to Total' },
                { value: 'oldestFirst', label: 'Oldest First' },
                { value: 'lowestPriceFirst', label: 'Lowest Price First' },
                { value: 'highestPriceFirst', label: 'Highest Price First' },
              ],
            }),
          ]}
          renderBottomContent={() => <GoalsTable isLoading={isPreviewTableLoading} goals={goalsPreview} />}
        />
        <div className="flex gap-2">
          {status === 'ACTIVE' &&
            goals.filter((goal) => goal.status === 'ACTIVE').some((goal) => goal.price.equals(goal.saved)) && (
              <YesNoModal
                message="Are you sure you want to remove all completed goals?"
                noText="No"
                yesText="Yes"
                onYes={handleRemoveCompletedGoals}
                buttonContent={
                  <div className={buttonClass.danger}>
                    <IconEraser className="rounded-full mr-2" />
                    Remove completed goals
                  </div>
                }
              />
            )}
        </div>
      </div>
      <div className="flex">
        <Tabs onSelectionChange={(key) => setStatus(key as 'ACTIVE' | 'COMPLETED')}>
          <Tab key="ACTIVE" title="Active" />
          <Tab key="COMPLETED" title="Completed" />
        </Tabs>
      </div>
    </>
  );

  const renderBottomContent = (): ReactNode => {
    if (status === 'COMPLETED') {
      return null;
    }

    return (
      <div className="flex justify-center">
        <FormModal<Goal>
          onSubmit={handleAddGoal}
          modalTitle={'Add New Goal'}
          buttonContent={
            <div className={buttonClass.primary}>
              <IconCirclePlus className="rounded-full mr-2" />
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
            new PriorityInput({
              label: 'Priority',
              name: 'priority',
            }),
          ]}
        />
      </div>
    );
  };

  const renderRowOptionContent = (goal: Goal): ReactNode => {
    if (status === 'COMPLETED') {
      return null;
    }

    return (
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
              new PriorityInput({
                label: 'Priority',
                name: 'priority',
                value: goal.priority.toString(),
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
  };

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
    priority: goal.priority || 1,
    dateAdded: goal.dateAdded,
    status: goal.status,
    dateCompleted: goal.dateCompleted,
  };
};
