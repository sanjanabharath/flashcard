'use client';

import { forwardRef } from 'react';
import { CustomProgress } from './custom-progress';

const Progress = forwardRef<HTMLDivElement, { value: number; className?: string }>(
  ({ value, className = "" }, ref) => (
    <CustomProgress
      ref={ref}
      value={value}
      className={`h-4 ${className}`}
    />
  )
);
Progress.displayName = 'Progress';

export { Progress, CustomProgress };
export type { CustomProgressProps } from './custom-progress';
