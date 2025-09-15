import { ErrorResponse } from "@/types/ErrorResponse.type";
import { Goal, PrismaClient, Saving } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getGoals } from "./goal";
import { SavingsEventEnum } from "@/enums/SavingsEventEnum";
import { Decimal } from "decimal.js";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Goal | Goal[] | ErrorResponse>
) {
  try {
    if (req.method !== "POST") {
      throw Error(`Unrecognised HTTP method ${req.method}.`);
    }

    const amount = req.body.amount ? new Decimal(req.body.amount) : undefined;
    const simulate = req.query.simulate === "true";

    const updatedGoals = await addSavings(amount, simulate);
    res.status(200).json(updatedGoals);
  } catch (e) {
    console.error("Encountered error in Savings API:", e);
    res.status(500).json({ message: "Encountered unkown error" });
  }
}

export const addSavings = async (
  amount?: Decimal,
  simulate?: boolean,
  event?: string
): Promise<Goal[]> => {
  const existingGoals = await getGoals();

  if (
    !existingGoals.length ||
    !amount ||
    amount.isNaN()
  ) {
    return existingGoals;
  }

  const updatedGoals = calculateUpdatedGoals(
    existingGoals,
    amount
  );

  if (simulate) {
    return updatedGoals;
  }

  // TODO: support negative savings
  for (const data of updatedGoals) {
    await prisma.goal.update({ where: { id: data.id }, data });
  }

  if (amount.isZero()) {
    return updatedGoals;
  }

  if (!event) {
    event = amount.isPositive()
      ? SavingsEventEnum.SAVINGS_ADDED
      : SavingsEventEnum.SAVINGS_REMOVED;
  }

  await prisma.saving.create({
    data: {
      amount,
      event,
    },
  });

  return updatedGoals;
};

const calculateUpdatedGoals = (
  existingGoals: Goal[],
  amountToAdd: Decimal
): Goal[] => {
  const totalThatNeedsToBeSaved = existingGoals.reduce(
    (runningTotal, { price }) => runningTotal.plus(price),
    new Decimal(0)
  );

  let remainingAmount = new Decimal(0);
  const updatedGoals: Goal[] = [];

  // First pass: distribute proportionally and collect overflow
  for (const goal of existingGoals) {
    const goalProportion = goal.price.dividedBy(totalThatNeedsToBeSaved);
    const proportionalAmount = amountToAdd.times(goalProportion);
    
    let amountToAddToGoal: Decimal;
    
    if (amountToAdd.isNegative()) {
      // For negative amounts, ensure we don't go below 0
      const maxCanRemove = goal.saved.negated(); // Maximum we can remove (as negative)
      amountToAddToGoal = Decimal.max(proportionalAmount, maxCanRemove);
    } else {
      // For positive amounts, ensure we don't exceed goal price
      const remainingCapacity = goal.price.minus(goal.saved);
      amountToAddToGoal = Decimal.min(proportionalAmount, remainingCapacity);
    }
    
    // Track overflow amount that couldn't be added to this goal
    const overflow = proportionalAmount.minus(amountToAddToGoal);
    remainingAmount = remainingAmount.plus(overflow);

    updatedGoals.push({
      ...goal,
      saved: goal.saved.plus(amountToAddToGoal).toDP(2),
    });
  }

  // Second pass: distribute any remaining amount to goals that still have capacity
  if (!remainingAmount.isZero()) {
    let goalsWithCapacity: Goal[];
    
    if (remainingAmount.isPositive()) {
      // For positive remaining amount, find goals that can accept more
      goalsWithCapacity = updatedGoals.filter(goal => 
        goal.saved.lessThan(goal.price)
      );
    } else {
      // For negative remaining amount, find goals that have savings to remove
      goalsWithCapacity = updatedGoals.filter(goal => 
        goal.saved.greaterThan(0)
      );
    }

    if (goalsWithCapacity.length > 0) {
      const amountPerGoal = remainingAmount.dividedBy(goalsWithCapacity.length);
      
      for (let i = 0; i < updatedGoals.length; i++) {
        const goal = updatedGoals[i];
        
        let hasCapacity = false;
        let maxAmount: Decimal;
        
        if (remainingAmount.isPositive()) {
          hasCapacity = goal.saved.lessThan(goal.price);
          maxAmount = goal.price.minus(goal.saved);
        } else {
          hasCapacity = goal.saved.greaterThan(0);
          maxAmount = goal.saved.negated(); // Maximum we can remove (as negative)
        }
        
        if (hasCapacity && !remainingAmount.isZero()) {
          const amountToAdd = remainingAmount.isPositive() 
            ? Decimal.min(amountPerGoal, maxAmount)
            : Decimal.max(amountPerGoal, maxAmount);
          
          updatedGoals[i] = {
            ...goal,
            saved: goal.saved.plus(amountToAdd).toDP(2),
          };
          
          remainingAmount = remainingAmount.minus(amountToAdd);
        }
      }
    }
  }

  return updatedGoals;
};
