"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import type { Task, Priority, Category } from "@/lib/types";
import { PRIORITIES, DEFAULT_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  dueDate: z.date().optional(),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high"]),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  task?: Task;
  categories: Category[];
  onSave: (data: Omit<Task, "id" | "status" | "createdAt" | "updatedAt">, taskId?: string) => void;
  onCancel: () => void;
  onAddCategory: (categoryName: string) => Category | undefined;
}

export function TaskForm({ task, categories, onSave, onCancel, onAddCategory }: TaskFormProps) {
  const [currentCategories, setCurrentCategories] = useState<Category[]>(categories);
  const [newCategoryName, setNewCategoryName] = useState("");

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      category: task?.category || DEFAULT_CATEGORIES[0]?.id || "",
      priority: task?.priority || "medium",
    },
  });

  useEffect(() => {
    setCurrentCategories(categories);
  }, [categories]);

  function onSubmit(data: TaskFormValues) {
    const taskData = {
      ...data,
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
    };
    onSave(taskData, task?.id);
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return;
    const newCat = onAddCategory(newCategoryName.trim());
    if (newCat) {
      setCurrentCategories(prev => [...prev, newCat]);
      form.setValue("category", newCat.id); // Select the new category
      setNewCategoryName(""); // Reset input
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Buy groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="E.g., Milk, eggs, bread, and cheese"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <div className="flex gap-2">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currentCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 <Input 
                    type="text" 
                    placeholder="New category" 
                    value={newCategoryName} 
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="max-w-[150px]"
                  />
                  <Button type="button" onClick={handleAddCategory} size="icon" variant="outline" aria-label="Add new category">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
