import { Goal } from '@prisma/client';
import { PriceBasedAllocationStrategy } from './PriceBasedAllocationStrategy';

export class HighestPriorityFirstAllocationStrategy extends PriceBasedAllocationStrategy {
  protected getSortComparator(): (a: Goal, b: Goal) => number {
    return (a, b) => b.priority - a.priority;
  }
}
