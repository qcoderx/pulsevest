import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
}

/**
 * A simple, reusable progress bar component.
 */
export function ProgressBar({ value, className }: ProgressBarProps) {
  // Ensure value is between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-accent",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
