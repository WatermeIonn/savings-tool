import { ErrorResponseType } from "@/types/ErrorResponseType";
import { Goal, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getGoals } from "./goal";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Goal | Goal[] | ErrorResponseType>
) {
  try {
    if (req.method !== "POST") {
      throw Error(`Unrecognised HTTP method ${req.method}.`);
    }

    const amount = req.body.amount;
    const maxPercentage =
      req.body.maxPercentage && req.body.maxPercentage / 100;

    const existingGoals = await getGoals();
    const totalToSave = existingGoals.reduce(
      (runningTotal, { price }) => runningTotal + price,
      0
    );

    if (!amount || isNaN(amount) || isNaN(maxPercentage)) {
      res.status(200).json(existingGoals);
      return;
    }

    let amountAboveMaxPercentage = 0;
    let totalPercentagesUnderMax = 0;

    if (maxPercentage) {
      amountAboveMaxPercentage = existingGoals.reduce((runningTotal, goal) => {
        const priceToTotal = goal.price / totalToSave;
        return priceToTotal > maxPercentage
          ? runningTotal + (priceToTotal - maxPercentage) * amount
          : runningTotal;
      }, 0);

      totalPercentagesUnderMax = existingGoals.reduce((runningTotal, goal) => {
        const priceToTotal = goal.price / totalToSave;
        return priceToTotal < maxPercentage
          ? runningTotal + priceToTotal
          : runningTotal;
      }, 0);
    }

    const updatedGoals = existingGoals.map((goal) => {
      let saved = 0;
      const priceToTotal = goal.price / totalToSave;

      if (maxPercentage && priceToTotal > maxPercentage) {
        saved = Math.round(amount * maxPercentage * 100) / 100;
      } else {
        saved = amount * priceToTotal;

        if (amountAboveMaxPercentage && totalPercentagesUnderMax) {
          saved +=
            (priceToTotal / totalPercentagesUnderMax) *
            amountAboveMaxPercentage;
        }
      }

      return {
        ...goal,
        saved: Math.round(saved * 100) / 100,
      };
    });

    if (req.query.simulate === "true") {
      res.status(200).json(updatedGoals);
    }

    // TODO: update goals
    // TODO: create entry in savings table
  } catch (e) {
    console.error("Encountered error in Savings API:", e);
    res.status(500).json({ message: "Encountered unkown error" });
  }
}
