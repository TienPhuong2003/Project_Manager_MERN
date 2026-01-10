import type { Task } from "app/types";
import { Badge } from "@/components/ui/badge";

export const TaskListItem = ({
  task,
  onClick,
}: {
  task: Task;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="
        flex cursor-pointer items-center justify-between
        px-4 py-3 text-sm
        hover:bg-muted transition
      "
    >
      <div className="flex flex-col">
        <span className="font-medium">{task.title}</span>
        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <Badge variant="secondary">{task.status}</Badge>
    </div>
  );
};
