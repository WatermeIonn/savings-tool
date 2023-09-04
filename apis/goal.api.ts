import { GoalDto } from "@/dtos/goal.dto";
import { randomBytes, randomUUID } from "crypto";

export const GoalApi = {
  getAll: async (): Promise<GoalDto[]> => {
    // fetch some goals
    return [
      new GoalDto("Bathroom", 5000, 1000.0),
      new GoalDto("Full length mirror", 100, 80.0),
      new GoalDto("Pictures", 200, 100.0),
      new GoalDto("Skip", 120, 0.0),
    ];
  },
  post: async (goal: GoalDto): Promise<GoalDto> => {
    // post goal to API and retrieve id
    goal.id = randomBytes(20).toString('hex');
    return goal;
  },
  delete: async (goal: GoalDto): Promise<GoalDto> => {
    // post goal to API and retrieve id
    return goal;
  },
};
