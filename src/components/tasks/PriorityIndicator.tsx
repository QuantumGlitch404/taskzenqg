import type { Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PriorityIndicatorProps {
  priority: Priority;
  showLabel?: boolean;
}

export function PriorityIndicator({ priority, showLabel = false }: PriorityIndicatorProps) {
  const priorityConfig = {
    low: { color: "bg-priority-low", label: "Low" },
    medium: { color: "bg-priority-medium", label: "Medium" },
    high: { color: "bg-priority-high", label: "High" },
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "h-3 w-3 rounded-full",
          priorityConfig[priority].color
        )}
        title={`Priority: ${priorityConfig[priority].label}`}
      />
      {showLabel && <span className="text-sm text-muted-foreground">{priorityConfig[priority].label}</span>}
    </div>
  );
}
