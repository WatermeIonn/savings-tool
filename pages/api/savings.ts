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
    const maxPercentage =
      req.body.maxPercentage && req.body.maxPercentage / 100;
    const simulate = req.query.simulate === "true";

    const updatedGoals = await addSavings(amount, maxPercentage, simulate);
    res.status(200).json(updatedGoals);
  } catch (e) {
    console.error("Encountered error in Savings API:", e);
    res.status(500).json({ message: "Encountered unkown error" });
  }
}

export const addSavings = async (
  amount?: Decimal,
  maxPercentage?: number,
  simulate?: boolean,
  event?: string
): Promise<Goal[]> => {
  const existingGoals = await getGoals();
  const totalToSave = existingGoals.reduce(
    (runningTotal, { price }) => runningTotal.plus(price),
    new Decimal(0)
  );

  if (
    !existingGoals.length ||
    !amount ||
    amount.isNaN() ||
    (maxPercentage && isNaN(maxPercentage))
  ) {
    return existingGoals;
  }

  const updatedGoals = calculateUpdatedGoals(
    existingGoals,
    totalToSave,
    amount,
    maxPercentage
  );

  if (simulate) {
    return updatedGoals;
  }

  // TODO: support negative savings
  for (const data of updatedGoals) {
    await prisma.goal.update({ where: { id: data.id }, data });
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
  totalToSave: Decimal,
  amount: Decimal,
  maxPercentage?: number
): Goal[] => {
  let amountAboveMaxPercentage = new Decimal(0);
  let totalPercentagesUnderMax = new Decimal(0);

  if (maxPercentage) {
    amountAboveMaxPercentage = existingGoals.reduce((runningTotal, goal) => {
      const priceToTotal = goal.price.dividedBy(totalToSave);
      return priceToTotal.greaterThan(maxPercentage)
        ? runningTotal.add(priceToTotal.minus(maxPercentage).times(amount))
        : runningTotal;
    }, new Decimal(0));

    totalPercentagesUnderMax = existingGoals.reduce((runningTotal, goal) => {
      const priceToTotal = goal.price.dividedBy(totalToSave);
      return priceToTotal.lessThan(maxPercentage)
        ? runningTotal.add(priceToTotal)
        : runningTotal;
    }, new Decimal(0));
  }

  return existingGoals.map((goal) => {
    let saved = new Decimal(0);
    const priceToTotal = goal.price.dividedBy(totalToSave);

    if (maxPercentage && priceToTotal.greaterThan(maxPercentage)) {
      saved = amount.times(maxPercentage);
    } else {
      saved = amount.times(priceToTotal);

      if (
        !amountAboveMaxPercentage.isZero() &&
        !totalPercentagesUnderMax.isZero()
      ) {
        saved = saved.add(
          priceToTotal
            .dividedBy(totalPercentagesUnderMax)
            .times(amountAboveMaxPercentage)
        );
      }
    }

    let newSavedValue = goal.saved.add(saved);

    if (newSavedValue.greaterThan(goal.price)) {
      newSavedValue = goal.price;
    }

    return {
      ...goal,
      saved: newSavedValue.toDP(2),
    };
  });
};
