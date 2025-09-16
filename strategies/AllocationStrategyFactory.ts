import { AllocationStrategy } from './AllocationStrategy';
import { PriceToTotalAllocationStrategy } from './PriceToTotalAllocationStrategy';
import { OldestFirstAllocationStrategy } from './OldestFirstAllocationStrategy';
import { HighestPriceFirstAllocationStrategy } from './HighestPriceFirstAllocationStrategy';
import { LowestPriceFirstAllocationStrategy } from './LowestPriceFirstAllocationStrategy';
import { HighestPriorityFirstAllocationStrategy } from './HighestPriorityFirstAllocationStrategy';

export type AllocationType = 'oldestFirst' | 'priceToTotal' | 'highestPriceFirst' | 'lowestPriceFirst' | 'highestPriorityFirst';

export class AllocationStrategyFactory {
  static create(allocationType: AllocationType): AllocationStrategy {
    switch (allocationType) {
      case 'oldestFirst':
        return new OldestFirstAllocationStrategy();
      case 'priceToTotal':
        return new PriceToTotalAllocationStrategy();
      case 'highestPriceFirst':
        return new HighestPriceFirstAllocationStrategy();
      case 'lowestPriceFirst':
        return new LowestPriceFirstAllocationStrategy();
      case 'highestPriorityFirst':
        return new HighestPriorityFirstAllocationStrategy();
    }
  }
  
  static getSupportedTypes(): string[] {
    return ['priceToTotal', 'oldestFirst', 'highestPriceFirst', 'lowestPriceFirst', 'highestPriorityFirst'];
  }
}
