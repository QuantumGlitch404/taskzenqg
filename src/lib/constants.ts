import type { Priority, Category } from "./types";

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "personal", name: "Personal" },
  { id: "work", name: "Work" },
  { id: "shopping", name: "Shopping" },
  { id: "study", name: "Study" },
  { id: "other", name: "Other" },
];

export const APP_NAME = "TaskZen";
