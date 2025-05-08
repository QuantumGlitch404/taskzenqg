"use client";

import type { Task, Category } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";
import { PriorityIndicator } from "./PriorityIndicator";
import { CategoryBadge } from "./CategoryBadge";
import { CalendarDays, Edit3, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DraggableProvided } from "@hello-pangea/dnd";


interface TaskCardProps {
  task: Task;
  categories: Category[];
  onToggleStatus: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  draggableProvided?: DraggableProvided;
}

export function TaskCard({
  task,
  categories,
  onToggleStatus,
  onEdit,
  onDelete,
  draggableProvided,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";

  return (
    <Card
      ref={draggableProvided?.innerRef}
      {...draggableProvided?.draggableProps}
      className={cn(
        "mb-4 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg",
        isCompleted ? "bg-card/70 opacity-70" : "bg-card"
      )}
    >
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
         {draggableProvided && (
          <button
            {...draggableProvided.dragHandleProps}
            className="p-1 cursor-grab text-muted-foreground hover:text-foreground"
            aria-label="Drag to reorder task"
          >
            <GripVertical size={20} />
          </button>
        )}
        <Checkbox
          id={`task-${task.id}`}
          checked={isCompleted}
          onCheckedChange={() => onToggleStatus(task.id)}
          aria-label={isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
          className="mt-1 h-5 w-5 rounded border-primary data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
        />
        <div className="grid gap-1.5 flex-1">
          <CardTitle className={cn("text-lg", isCompleted && "line-through text-muted-foreground")}>
            {task.title}
          </CardTitle>
          {task.description && (
            <CardDescription className={cn("text-sm", isCompleted && "line-through text-muted-foreground/80")}>
              {task.description}
            </CardDescription>
          )}
        </div>
        <PriorityIndicator priority={task.priority} />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>{format(parseISO(task.dueDate), "MMM dd, yyyy")}</span>
              </div>
            )}
          </div>
          <CategoryBadge categoryName={task.category} categories={categories} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Edit task">
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" aria-label="Delete task">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
