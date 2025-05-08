"use client";

import type { Task } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ListChecks, Hourglass } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStatsProps {
  tasks: Task[];
}

export function DashboardStats({ tasks }: DashboardStatsProps) {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const currentTotalTasks = tasks.length;
    const currentCompletedTasks = tasks.filter(task => task.status === "completed").length;
    const currentPendingTasks = currentTotalTasks - currentCompletedTasks;
    const currentCompletionPercentage = currentTotalTasks > 0 ? Math.round((currentCompletedTasks / currentTotalTasks) * 100) : 0;

    setTotalTasks(currentTotalTasks);
    setCompletedTasks(currentCompletedTasks);
    setPendingTasks(currentPendingTasks);
    setCompletionPercentage(currentCompletionPercentage);

  }, [tasks]);


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          <ListChecks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground">All tasks created</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">
            {completionPercentage}% of total tasks
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <Hourglass className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTasks}</div>
           <p className="text-xs text-muted-foreground">Tasks remaining to be done</p>
        </CardContent>
      </Card>
      {totalTasks > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completion Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completionPercentage} aria-label={`${completionPercentage}% tasks completed`} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2 text-center">{completionPercentage}% completed</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
