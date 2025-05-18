"use client"

import { forwardRef } from "react";

export interface CustomProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export const CustomProgress = forwardRef<HTMLDivElement, CustomProgressProps>(
  ({ value, className = "", indicatorClassName = "" }, ref) => {
    const progressValue = Math.min(Math.max(value, 0), 100);
    
    return (
      <div
        ref={ref}
        className={`relative h-2 rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
      >
        <div
          className={`absolute h-full rounded-full bg-orange-500 transition-all duration-200 ${indicatorClassName}`}
          style={{ width: `${progressValue}%` }}
        />
      </div>
    );
  }
);

CustomProgress.displayName = "CustomProgress";
