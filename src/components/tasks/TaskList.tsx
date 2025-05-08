"use client";

import type { Task, Category, TaskFilterStatus, TaskSortOption } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Search, ListFilter, ArrowDownUp } from "lucide-react";
import Image from "next/image";


interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleStatus: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onReorder: (tasks: Task[]) => void;
}

export function TaskList({
  tasks,
  categories,
  onToggleStatus,
  onEdit,
  onDelete,
  onReorder,
}: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskFilterStatus>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<TaskSortOption>("createdAt");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    if (filterStatus !== "all") {
      result = result.filter((task) => task.status === filterStatus);
    }

    if (filterCategory !== "all") {
      result = result.filter((task) => task.category === filterCategory);
    }

    if (searchTerm) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort tasks
    result.sort((a, b) => {
      if (sortOption === "dueDate") {
        if (!a.dueDate) return 1; // Tasks without due dates go to the end
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortOption === "priority") {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortOption === "createdAt") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
      }
      if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [tasks, searchTerm, filterStatus, filterCategory, sortOption]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(filteredAndSortedTasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    
    // Create a map of current order for faster lookup
    const currentOrderMap = new Map(filteredAndSortedTasks.map((task, index) => [task.id, index]));

    // Create a new task list that reflects the new order but keeps non-visible tasks in place
    const globalReorderedTasks = Array.from(tasks);
    globalReorderedTasks.sort((a, b) => {
        const aOrder = currentOrderMap.has(a.id) ? reorderedTasks.findIndex(t => t.id === a.id) : Infinity;
        const bOrder = currentOrderMap.has(b.id) ? reorderedTasks.findIndex(t => t.id === b.id) : Infinity;
        
        if (aOrder === Infinity && bOrder === Infinity) { // both not in filtered list, maintain original relative order
            return tasks.indexOf(a) - tasks.indexOf(b);
        }
        return aOrder - bOrder;
    });
    
    onReorder(globalReorderedTasks);
  };

  if (!isClient) {
    // Render a loading state or null during SSR to prevent hydration mismatch
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Search tasks"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger aria-label="Filter by category">
              <ListFilter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOption} onValueChange={(value) => setSortOption(value as TaskSortOption)}>
            <SelectTrigger aria-label="Sort tasks by">
              <ArrowDownUp className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as TaskFilterStatus)} className="lg:justify-self-end">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredAndSortedTasks.length === 0 ? (
         <div className="text-center py-10">
            <Image 
                src="https://picsum.photos/seed/emptystate/300/200" 
                alt="No tasks found" 
                width={300} 
                height={200} 
                className="mx-auto mb-4 rounded-lg shadow-md"
                data-ai-hint="empty illustration" 
            />
            <p className="text-muted-foreground text-lg">No tasks match your current filters.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria, or add a new task!</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="taskList">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {filteredAndSortedTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(providedDrag) => (
                      <TaskCard
                        task={task}
                        categories={categories}
                        onToggleStatus={onToggleStatus}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        draggableProvided={providedDrag}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
