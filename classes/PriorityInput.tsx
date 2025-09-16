'use client';

import { PRIORITY_OPTIONS } from '@/utils/priority.util';
import { DropdownInput } from './DropdownInput';

export class PriorityInput extends DropdownInput {
  constructor(props: any) {
    super({
      ...props,
      options: PRIORITY_OPTIONS.map((option) => ({
        value: option.value.toString(),
        label: option.label,
      })),
      value: props.value || '1', // Default to Low priority
    });
  }
}
