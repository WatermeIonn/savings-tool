import { GoalDto } from "@/dtos/goal.dto";
import { randomBytes, randomUUID } from "crypto";

export const GoalApi = {
  getAll: async (): Promise<GoalDto[]> => {
    // fetch some goals
    const dto1 = new GoalDto();
    const dto2 = new GoalDto();
    const dto3 = new GoalDto();
    const dto4 = new GoalDto();
    dto1.name = "Bathroom";
    dto1.price = 5000;
    dto1.saved = 1000.0;
    dto2.name = "Full length mirror";
    dto2.price = 100;
    dto2.saved = 80.0;
    dto3.name = "Pictures";
    dto3.price = 200;
    dto3.saved = 100.0;
    dto4.name = "Skip";
    dto4.price = 120;
    dto4.saved = 0.0;
    return [dto1, dto2, dto3, dto4];
  },
  post: async (goal: GoalDto): Promise<GoalDto> => {
    // post goal to API and retrieve id
    goal.id = randomBytes(20).toString("hex");
    return goal;
  },
  delete: async (goal: GoalDto): Promise<GoalDto> => {
    // post goal to API and retrieve id
    return goal;
  },
};
