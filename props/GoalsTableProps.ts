import { SortDescriptor } from '@heroui/table';
import { Goal } from '@prisma/client';
import { ReactNode } from 'react';

export interface GoalsTableProps {
  renderTopContent?: () => ReactNode;
  renderBottomContent?: () => ReactNode;
  renderRowOptionContent?: (goal: Goal) => ReactNode;
  allowsSorting?: boolean;
  onSortChange?: (sortDescriptor: SortDescriptor) => void;
  sortDescriptor?: SortDescriptor;
  isLoading: boolean;
  goals: Goal[];
  showTotalRow?: boolean;
}
