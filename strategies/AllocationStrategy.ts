import { Goal } from '@prisma/client';
import { Decimal } from 'decimal.js';

export abstract class AllocationStrategy {
  public abstract allocate(existingGoals: Goal[], amountToAdd: Decimal): Goal[];
  
  protected cloneGoals(goals: Goal[]): Goal[] {
    return goals.map(goal => ({ ...goal }));
  }
}
