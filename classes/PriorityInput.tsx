'use client';

import { DropdownInput } from './DropdownInput';
import { PRIORITY_OPTIONS } from '@/utils/priority.util';

export class PriorityInput extends DropdownInput {
  constructor(props: any) {
    super({
      ...props,
      options: PRIORITY_OPTIONS.map(option => ({
        value: option.value.toString(),
        label: option.label
      })),
      value: props.value || '1', // Default to Low priority
    });
  }
}
