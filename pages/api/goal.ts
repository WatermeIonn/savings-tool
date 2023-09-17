import { ErrorResponseInterface } from "@/interfaces/ErrorResponseInterface";
import { Goal, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Goal | Goal[] | ErrorResponseInterface>
) {
  let result: Goal | Goal[];

  try {
    switch (req.method) {
      case "GET":
        result = await prisma.goal.findMany();
        return res.status(200).json(result);
      case "POST":
        result = await prisma.goal.create({ data: req.body });
        return res.status(200).json(result);
      case "DELETE":
        const id = req.query.id;
        if (!id || Array.isArray(id)) {
          return res.status(400).json({ message: "Id of the record to delete must be provided" });
        }

        result = await prisma.goal.delete({ where: { id } });
        return res.status(200).json(result);
      default:
        throw Error(`Unrecognised HTTP method ${req.method}.`);
    }
  } catch (e) {
    console.error("Encountered error in Goal API:", e);
    res.status(500).json({ message: "Encountered unkown error" });
  }
}
