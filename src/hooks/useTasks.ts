"use client";

import { useCallback } from "react";
import type { Task, Priority, TaskStatus, Category } from "@/lib/types";
import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

const TASKS_STORAGE_KEY = "taskzen-tasks";
const CATEGORIES_STORAGE_KEY = "taskzen-categories";

const initialTasks: Task[] = [];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_STORAGE_KEY, initialTasks);
  const [categories, setCategories] = useLocalStorage<Category[]>(CATEGORIES_STORAGE_KEY, DEFAULT_CATEGORIES);

  const addTask = useCallback(
    (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "status">) => {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    },
    [setTasks]
  );

  const editTask = useCallback(
    (taskId: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        )
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    },
    [setTasks]
  );

  const toggleTaskStatus = useCallback(
    (taskId: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: task.status === "pending" ? "completed" : "pending",
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      );
    },
    [setTasks]
  );
  
  const addCategory = useCallback(
    (categoryName: string) => {
      if (categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase())) {
        // Potentially throw error or return indication of existing category
        console.warn("Category already exists");
        return;
      }
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name: categoryName,
      };
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    }, [categories, setCategories]
  );


  return {
    tasks,
    setTasks, // Exposing setTasks for direct manipulation like reordering if needed later
    addTask,
    editTask,
    deleteTask,
    toggleTaskStatus,
    categories,
    addCategory,
  };
}
