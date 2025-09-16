import { Goal } from '@prisma/client';
import { Decimal } from 'decimal.js';
import { AllocationStrategy } from './AllocationStrategy';

export abstract class PriceBasedAllocationStrategy extends AllocationStrategy {
  protected abstract getSortComparator(): (a: Goal, b: Goal) => number;

  public allocate(existingGoals: Goal[], amountToAdd: Decimal): Goal[] {
    // Sort goals using the strategy-specific comparator
    const sortedGoals = [...existingGoals].sort(this.getSortComparator());

    const updatedGoals = this.cloneGoals(sortedGoals);
    let remainingAmount = amountToAdd;

    for (const goal of updatedGoals) {
      if (remainingAmount.isZero()) {
        break;
      }

      if (remainingAmount.isPositive()) {
        // Adding money - don't exceed the goal price
        const remainingCapacity = goal.price.minus(goal.saved);
        const amountToAddToGoal = Decimal.min(remainingAmount, remainingCapacity);
        
        goal.saved = goal.saved.plus(amountToAddToGoal).toDP(2);
        remainingAmount = remainingAmount.minus(amountToAddToGoal);
      } else {
        // Removing money - don't go below zero
        const maxCanRemove = goal.saved;
        const amountToRemove = Decimal.min(remainingAmount.abs(), maxCanRemove);
        
        goal.saved = goal.saved.minus(amountToRemove).toDP(2);
        remainingAmount = remainingAmount.plus(amountToRemove);
      }
    }

    // Return goals in original order
    return existingGoals.map(originalGoal => 
      updatedGoals.find(updatedGoal => updatedGoal.id === originalGoal.id) || originalGoal
    );
  }
}
