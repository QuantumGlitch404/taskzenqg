import { APP_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface HeaderProps {
  onAddTask: () => void;
}

export default function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Placeholder for logo/icon */}
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-accent"><path d="M9 3h10a2 2 0 0 1 2 2v10M5 7H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"/><path d="m9 12 2 2 4-4"/><path d="M5 3h2"/><path d="M5 3a2 2 0 0 0-2 2"/></svg> */}
          <h1 className="text-2xl font-bold text-foreground">
            {APP_NAME}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onAddTask} size="sm" variant="gooeyLeft" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
