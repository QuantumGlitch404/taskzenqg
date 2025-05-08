export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed";

export interface Category {
  id: string;
  name: string;
  // color?: string; // Optional: for color-coding categories
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string for date
  category: string; // Category name or ID
  priority: Priority;
  status: TaskStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type TaskFilterStatus = "all" | TaskStatus;
export type TaskSortOption = "dueDate" | "priority" | "createdAt" | "title";
