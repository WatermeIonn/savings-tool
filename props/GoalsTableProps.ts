import { Goal } from "@prisma/client";
import { ReactNode } from "react";

export interface GoalsTableProps {
  renderBottomContent?: () => ReactNode;
  renderRowOptionContent?: (goal: Goal) => ReactNode;
  isLoading: boolean;
  goals: Goal[];
  showTotalRow?: boolean
}
