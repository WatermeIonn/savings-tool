import { Goal } from "@/models/goal.model";
import { PrismaClient } from "@prisma/client";
import { plainToClass } from "class-transformer";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Goal | Goal[]>
) {
  const result = await prisma.goal.findMany();

  res.status(200).json(result.map((goal) => plainToClass(Goal, goal)));
}
