import type { Task } from "app/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarDays, Flag } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { statusConfig, priorityConfig } from "@/lib";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];

  const completedSubtasks =
    task.subTasks?.filter((s) => s.completed).length ?? 0;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group h-full cursor-pointer rounded-xl",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg hover:-translate-y-1",
        "border bg-background",
      )}
    >
      {/* ===== Header ===== */}
      <CardHeader className="pb-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className="
              text-sm font-semibold leading-snug
              line-clamp-2
              group-hover:text-primary transition-colors
            "
          >
            {task.title}
          </CardTitle>

          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-xs rounded-full px-2 py-0.5",
              status.className,
            )}
          >
            {task.status}
          </Badge>
        </div>

        <CardDescription className="text-sm line-clamp-2">
          {task.description || "No description provided"}
        </CardDescription>
      </CardHeader>

      {/* ===== Content ===== */}
      <CardContent className="space-y-3 pt-0">
        {/* Priority */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Flag className={cn("h-4 w-4", priority.className)} />
          <span className={cn("capitalize", priority.className)}>
            {task.priority}
          </span>
        </div>

        {/* ===== Footer ===== */}
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          {/* Assignees */}
          {task.assignees && task.assignees.length > 0 ? (
            <div className="flex items-center -space-x-2">
              {task.assignees.slice(0, 4).map((user) => (
                <Avatar
                  key={user._id}
                  className="size-7 border-2 border-background"
                  title={user.name}
                >
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}

              {task.assignees.length > 4 && (
                <span className="ml-2 text-[11px] text-muted-foreground">
                  +{task.assignees.length - 4}
                </span>
              )}
            </div>
          ) : (
            <span className="italic text-[11px]">Unassigned</span>
          )}

          {/* Due date */}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
            </div>
          )}
        </div>

        {/* Subtasks */}
        {task.subTasks && task.subTasks.length > 0 && (
          <div className="text-[11px] text-muted-foreground">
            {completedSubtasks} / {task.subTasks.length} subtasks
          </div>
        )}
      </CardContent>
    </Card>
  );
};
