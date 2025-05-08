import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/types";
import { Tag } from "lucide-react";

interface CategoryBadgeProps {
  categoryName: string;
  categories: Category[];
}

export function CategoryBadge({ categoryName, categories }: CategoryBadgeProps) {
  const category = categories.find(c => c.name === categoryName || c.id === categoryName);
  
  return (
    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
      <Tag className="h-3 w-3" />
      {category ? category.name : categoryName}
    </Badge>
  );
}
