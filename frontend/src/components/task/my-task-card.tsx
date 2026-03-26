import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { format } from "date-fns";
import { priorityConfig } from "@/lib";
import { cn } from "@/lib/utils";
import type { Task } from "app/types";

interface Props {
  task: Task;
}

const MyTaskCard = React.memo(({ task }: Props) => {
  const priority = task.priority ? priorityConfig[task.priority] : null;

  return (
    <Card className="p-3 hover:shadow-md transition-all hover:-translate-y-px cursor-pointer">
      <Link
        to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
        className="block"
      >
        <h3 className="font-medium text-sm leading-tight">{task.title}</h3>

        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {task.description || "No Description"}
        </p>

        <div className="flex items-center justify-between mt-3">
          {priority && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs px-2 py-0.5 rounded-md",
                priority.className.includes("red") &&
                  "bg-red-100 text-red-700 border-red-200",
                priority.className.includes("yellow") &&
                  "bg-yellow-100 text-yellow-700 border-yellow-200",
                priority.className.includes("muted") &&
                  "bg-gray-100 text-gray-700 border-gray-200",
              )}
            >
              {task.priority}
            </Badge>
          )}

          {task.dueDate && (
            <span className="text-sm text-muted-foreground">
              {format(task.dueDate, "MMM dd yyyy")}
            </span>
          )}
        </div>
      </Link>
    </Card>
  );
});

export default MyTaskCard;
