import { ErrorResponse } from '@/types/ErrorResponse.type';
import { Goal, Saving } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getGoals } from './goal';
import { SavingsEventEnum } from '@/enums/SavingsEventEnum';
import { Decimal } from 'decimal.js';
import { getPrismaClient } from '@/lib/database';
import { AllocationStrategyFactory, AllocationType } from '@/strategies/AllocationStrategyFactory';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Goal | Goal[] | ErrorResponse>) {
  try {
    if (req.method !== 'POST') {
      throw Error(`Unrecognised HTTP method ${req.method}.`);
    }

    const amount = req.body.amount ? new Decimal(req.body.amount) : null;
    const allocationType = req.query.allocationType;
    const simulate = req.query.simulate === 'true';

    const supportedTypes = AllocationStrategyFactory.getSupportedTypes();
    if (!allocationType || typeof allocationType !== 'string' || !supportedTypes.includes(allocationType)) {
      throw Error(`Unrecognised allocation type ${allocationType}. Supported types: ${supportedTypes.join(', ')}`);
    }

    const updatedGoals = await addSavings(amount, allocationType as AllocationType, simulate);
    res.status(200).json(updatedGoals);
  } catch (e) {
    console.error('Encountered error in Savings API:', e);
    res.status(500).json({ message: 'Encountered unknown error' });
  }
}

export const addSavings = async (
  amount: Decimal | null,
  allocationType: AllocationType,
  simulate?: boolean
): Promise<Goal[]> => {
  const existingGoals = await getGoals();

  if (!existingGoals.length || !amount || amount.isNaN()) {
    return existingGoals;
  }

  const strategy = AllocationStrategyFactory.create(allocationType);
  const updatedGoals = strategy.allocate(existingGoals, amount);

  if (simulate) {
    return updatedGoals;
  }

  const prisma = getPrismaClient();
  for (const data of updatedGoals) {
    await prisma.goal.update({ where: { id: data.id }, data });
  }

  if (amount.isZero()) {
    return updatedGoals;
  }

  const event = amount.isPositive() ? SavingsEventEnum.SAVINGS_ADDED : SavingsEventEnum.SAVINGS_REMOVED;

  await prisma.saving.create({
    data: {
      amount,
      event,
    },
  });

  return updatedGoals;
};
