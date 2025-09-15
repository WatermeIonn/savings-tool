import { AllocationStrategy } from './AllocationStrategy';
import { PriceToTotalAllocationStrategy } from './PriceToTotalAllocationStrategy';
import { OldestFirstAllocationStrategy } from './OldestFirstAllocationStrategy';

export type AllocationType = 'oldestFirst' | 'priceToTotal';

export class AllocationStrategyFactory {
  static create(allocationType: AllocationType): AllocationStrategy {
    switch (allocationType) {
      case 'oldestFirst':
        return new OldestFirstAllocationStrategy();
      case 'priceToTotal':
        return new PriceToTotalAllocationStrategy();
    }
  }
  
  static getSupportedTypes(): string[] {
    return ['priceToTotal', 'oldestFirst'];
  }
}
