import { Goal } from '@prisma/client';
import { PriceBasedAllocationStrategy } from './PriceBasedAllocationStrategy';

export class LowestPriceFirstAllocationStrategy extends PriceBasedAllocationStrategy {
  protected getSortComparator(): (a: Goal, b: Goal) => number {
    return (a, b) => a.price.minus(b.price).toNumber();
  }
}
