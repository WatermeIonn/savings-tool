import { ErrorResponse } from "@/types/ErrorResponse.type";
import { Goal, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { addSavings } from "./savings";
import Decimal from "decimal.js";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Goal | Goal[] | ErrorResponse>
) {
  let result: Goal | Goal[];

  const id = req.query?.id ?? null;

  try {
    switch (req.method) {
      case "GET":
        result = await getGoals();
        break;
      case "POST":
        result = await createGoal(req.body);
        break;
      case "PUT":
        if (!id || Array.isArray(id)) {
          return res
            .status(400)
            .json({ message: "Id of the record to delete must be provided" });
        }

        result = await updateGoal(id, req.body);
        break;
      case "DELETE":
        if (!id || Array.isArray(id)) {
          return res
            .status(400)
            .json({ message: "Id of the record to delete must be provided" });
        }

        result = await deleteGoal(id);
        break;
      default:
        throw Error(`Unrecognised HTTP method ${req.method}.`);
    }

    return res.status(200).json(result);
  } catch (e) {
    console.error("Encountered error in Goal API:", e);
    res.status(500).json({ message: "Encountered unkown error" });
  }
}

export const getGoals = async (): Promise<Goal[]> => {
  // TODO: custom sort?
  return await prisma.goal.findMany(
    {
      orderBy: {
        price: 'desc'
      }
    }
  );
};

const createGoal = async (data: any): Promise<Goal> => {
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
  return await prisma.goal.update({
    where: { id },
    data: {
      name: data.name,
      price: new Decimal(data.price).toDP(2),
    },
  });
};

const deleteGoal = async (id: string): Promise<Goal[]> => {
  const goal = await prisma.goal.delete({ where: { id } });

  if (!goal.saved.equals(goal.price)) {
    await addSavings(
      goal.saved,
      undefined,
      undefined,
      `Removed goal ${goal.name}`
    );
  }

  return await getGoals();
};
