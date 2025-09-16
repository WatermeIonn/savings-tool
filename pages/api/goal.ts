import { ErrorResponse } from '@/types/ErrorResponse.type';
import { Goal } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { addSavings } from './savings';
import Decimal from 'decimal.js';
import { getPrismaClient } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Goal | Goal[] | ErrorResponse>) {
  let result: Goal | Goal[];

  const id = req.query?.id ?? null;
  const sort = req.query?.sort ?? undefined;
  const direction = req.query?.direction ?? undefined;
  const status = req.query?.status ?? undefined;

  if (sort && typeof sort !== 'string') {
    return res.status(400).json({ message: `Unrecognised sort type ${sort}` });
  }

  if (direction && (typeof direction !== 'string' || (direction !== 'ascending' && direction !== 'descending'))) {
    return res.status(400).json({ message: `Unrecognised direction type ${direction}` });
  }

  if (status && (typeof status !== 'string' || (status !== 'ACTIVE' && status !== 'COMPLETED'))) {
    return res.status(400).json({ message: `Unrecognised status type ${status}` });
  }

  try {
    switch (req.method) {
      case 'GET':
        result = await getGoals(sort, direction, status as 'ACTIVE' | 'COMPLETED' | undefined);
        break;
      case 'POST':
        result = await createGoal(req.body);
        break;
      case 'PUT':
        if (!id || Array.isArray(id)) {
          return res.status(400).json({ message: 'Id of the record to update must be provided' });
        }

        result = await updateGoal(id, req.body);
        break;
      case 'DELETE':
        if (!id || Array.isArray(id)) {
          return res.status(400).json({ message: 'Id of the record to delete must be provided' });
        }

        result = await deleteGoal(id);
        break;
      default:
        throw Error(`Unrecognised HTTP method ${req.method}.`);
    }

    return res.status(200).json(result);
  } catch (e) {
    console.error('Encountered error in Goal API:', e);
    res.status(500).json({ message: 'Encountered unknown error' });
  }
}

export const getGoals = async (
  sort?: string,
  direction?: string,
  status: 'COMPLETED' | 'ACTIVE' = 'ACTIVE'
): Promise<Goal[]> => {
  const prisma = getPrismaClient();
  return await prisma.goal.findMany({
    where: {
      status: {
        equals: status,
      },
    },
    ...(sort && direction ? { orderBy: { [sort]: direction === 'ascending' ? 'asc' : 'desc' } } : {}),
  });
};

const createGoal = async (data: any): Promise<Goal> => {
  const prisma = getPrismaClient();
  return await prisma.goal.create({
    data: {
      id: data.id,
      name: data.name,
      price: new Decimal(data.price).toDP(2),
      saved: data.saved ? new Decimal(data.saved).toDP(2) : undefined,
    },
  });
};

const updateGoal = async (id: string, data: any): Promise<Goal> => {
  const prisma = getPrismaClient();
  return await prisma.goal.update({
    where: { id },
    data: {
      name: data.name,
      price: new Decimal(data.price).toDP(2),
      status: data.status,
      dateCompleted: data.dateCompleted,
    },
  });
};

const deleteGoal = async (id: string): Promise<Goal[]> => {
  const prisma = getPrismaClient();
  await prisma.goal.update({
    where: { id },
    data: { status: 'DELETED' },
  });
  return await getGoals();
};
