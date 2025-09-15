import { Goal } from '@prisma/client';
import { Decimal } from 'decimal.js';
import { AllocationStrategy } from './AllocationStrategy';

export class OldestFirstAllocationStrategy extends AllocationStrategy {
  public allocate(existingGoals: Goal[], amountToAdd: Decimal): Goal[] {
    // Sort goals by dateAdded (oldest first)
    const sortedGoals = [...existingGoals].sort(
      (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
    );

    let remainingAmount = amountToAdd;
    const updatedGoals = this.cloneGoals(existingGoals);

    for (const sortedGoal of sortedGoals) {
      if (remainingAmount.isZero()) break;

      const goalIndex = updatedGoals.findIndex((g) => g.id === sortedGoal.id);
      const goal = updatedGoals[goalIndex];

      let amountToAddToGoal: Decimal;

      if (remainingAmount.isNegative()) {
        // For negative amounts, remove as much as possible from this goal
        const maxCanRemove = goal.saved.negated();
        amountToAddToGoal = Decimal.max(remainingAmount, maxCanRemove);
      } else {
        // For positive amounts, add as much as possible to this goal
        const remainingCapacity = goal.price.minus(goal.saved);
        amountToAddToGoal = Decimal.min(remainingAmount, remainingCapacity);
      }

      updatedGoals[goalIndex] = {
        ...goal,
        saved: goal.saved.plus(amountToAddToGoal).toDP(2),
      };

      remainingAmount = remainingAmount.minus(amountToAddToGoal);
    }

    return updatedGoals;
  }
}
