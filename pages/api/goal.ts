import { ErrorResponseType } from "@/types/ErrorResponseType";
import { Goal, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Goal | Goal[] | ErrorResponseType>
) {
  let result: Goal | Goal[];

  try {
    switch (req.method) {
      case "GET":
        result = await getGoals();
        break;
      case "POST":
        result = await createGoal(req.body);
        break;
      case "DELETE":
        const id = req.query.id;
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
  return await prisma.goal.findMany();
};

const createGoal = async (data: any): Promise<Goal> => {
  // TODO: if goal has not been fully saved i.e. <100%, then this should automatically spread the saved amount over other goals.
  // if goal has been fully saved, then the record should just be deleted, and an event written to the savings table for minus the amount.
  return await prisma.goal.create({ data });
};

const deleteGoal = async (id: string): Promise<Goal> => {
  return await prisma.goal.delete({ where: { id } });
};
