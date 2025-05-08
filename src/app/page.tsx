"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { useTasks } from "@/hooks/useTasks";
import type { Task, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowUp } from "lucide-react";

export default function HomePage() {
  const { 
    tasks, 
    setTasks,
    addTask, 
    editTask, 
    deleteTask, 
    toggleTaskStatus, 
    categories, 
    addCategory 
  } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<string | undefined>(undefined);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { toast } = useToast();

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSaveTask = (
    data: Omit<Task, "id" | "status" | "createdAt" | "updatedAt">,
    taskId?: string
  ) => {
    if (taskId) {
      editTask(taskId, data);
      toast({ title: "Task Updated", description: "Your task has been successfully updated." });
    } else {
      addTask(data);
      toast({ title: "Task Added", description: "A new task has been successfully added." });
    }
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const handleDeleteConfirmation = (taskId: string) => {
    setTaskToDelete(taskId);
  };

  const handleDeleteConfirmed = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      toast({ title: "Task Deleted", description: "The task has been removed.", variant: "destructive" });
      setTaskToDelete(undefined);
    }
  };
  
  const handleAddCategory = (categoryName: string): Category | undefined => {
    const newCategory = addCategory(categoryName);
    if (newCategory) {
      toast({ title: "Category Added", description: `Category "${categoryName}" has been added.` });
    } else {
      toast({ title: "Category Exists", description: `Category "${categoryName}" already exists.`, variant: "destructive" });
    }
    return newCategory;
  };

  const handleReorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
    // No toast for reordering as it's a frequent action and could be annoying.
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScrollTop]);
  
  // Basic notification scheduling (conceptual)
  useEffect(() => {
    const checkReminders = () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        tasks.forEach(task => {
          if (task.status === 'pending' && task.dueDate) {
            const dueDate = new Date(task.dueDate);
            const now = new Date();
            // Example: remind 1 hour before if due date is today
            if (dueDate.toDateString() === now.toDateString() && 
                dueDate.getTime() > now.getTime() && 
                dueDate.getTime() - now.getTime() < 60 * 60 * 1000) { 
              
              // Check if notification permission is granted
              if (Notification.permission === "granted") {
                // Check if we've already notified for this task recently (e.g., using localStorage)
                const lastNotified = localStorage.getItem(`notified-${task.id}`);
                if (!lastNotified || new Date().getTime() - new Date(lastNotified).getTime() > 60 * 60 * 1000 * 23) { // ~23 hours
                  new Notification("Task Due Soon!", { body: task.title });
                  localStorage.setItem(`notified-${task.id}`, new Date().toISOString());
                }
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                    // (Retry logic or inform user)
                  }
                });
              }
            }
          }
        });
      }
    };

    // Check reminders periodically
    const intervalId = setInterval(checkReminders, 60 * 1000 * 5); // every 5 minutes
    checkReminders(); // Initial check

    return () => clearInterval(intervalId);
  }, [tasks]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onAddTask={handleAddTask} />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <DashboardStats tasks={tasks} />
        <Separator />
        <TaskList
          tasks={tasks}
          categories={categories}
          onToggleStatus={toggleTaskStatus}
          onEdit={handleEditTask}
          onDelete={handleDeleteConfirmation}
          onReorder={handleReorderTasks}
        />
      </main>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setIsFormOpen(false);
          setEditingTask(undefined);
        } else {
          setIsFormOpen(true);
        }
      }}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              {editingTask ? "Update the details of your task." : "Fill in the details for your new task."}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            task={editingTask}
            categories={categories}
            onSave={handleSaveTask}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTask(undefined);
            }}
            onAddCategory={handleAddCategory}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(undefined)}
        onConfirm={handleDeleteConfirmed}
        itemName="task"
      />

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full p-3 h-12 w-12 shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
       <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        TaskZen - Your Offline Task Manager
      </footer>
    </div>
  );
}
