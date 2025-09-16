import { Goal } from '@prisma/client';
import { PriceBasedAllocationStrategy } from './PriceBasedAllocationStrategy';

export class HighestPriceFirstAllocationStrategy extends PriceBasedAllocationStrategy {
  protected getSortComparator(): (a: Goal, b: Goal) => number {
    return (a, b) => b.price.minus(a.price).toNumber();
  }
}
