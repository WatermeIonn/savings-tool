export const PRIORITY_VALUES = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  HIGHEST: 4,
} as const;

export const PRIORITY_LABELS = {
  [PRIORITY_VALUES.LOW]: 'Low ',
  [PRIORITY_VALUES.MEDIUM]: 'Medium',
  [PRIORITY_VALUES.HIGH]: 'High',
  [PRIORITY_VALUES.HIGHEST]: 'Highest',
} as const;

export const getPriorityLabel = (priority: number): string => {
  return PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS] || 'Low';
};

export const getPriorityValue = (label: string): number => {
  const entry = Object.entries(PRIORITY_LABELS).find(([_, value]) => value === label);
  return entry ? parseInt(entry[0]) : PRIORITY_VALUES.LOW;
};

export const PRIORITY_OPTIONS = [
  { value: PRIORITY_VALUES.LOW, label: PRIORITY_LABELS[PRIORITY_VALUES.LOW] },
  { value: PRIORITY_VALUES.MEDIUM, label: PRIORITY_LABELS[PRIORITY_VALUES.MEDIUM] },
  { value: PRIORITY_VALUES.HIGH, label: PRIORITY_LABELS[PRIORITY_VALUES.HIGH] },
  { value: PRIORITY_VALUES.HIGHEST, label: PRIORITY_LABELS[PRIORITY_VALUES.HIGHEST] },
];
