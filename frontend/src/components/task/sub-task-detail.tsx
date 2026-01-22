import type { Subtask } from "app/types";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  useAddSubTaskMutation,
  useUpdateSubTaskMutation,
} from "app/hooks/use-task";
import { toast } from "sonner";

export const SubTaskDetail = ({
  subTasks,
  taskId,
}: {
  subTasks: Subtask[];
  taskId: string;
}) => {
  const [newSubTask, setNewSubTask] = useState("");
  const { mutate: addSubTask, isPending } = useAddSubTaskMutation();
  const { mutate: updateSubTask, isPending: isUpdating } =
    useUpdateSubTaskMutation();
  const handleToggleTask = (subTaskId: string, checked: boolean) => {
    updateSubTask(
      { taskId, subTaskId, completed: checked },
      {
        onSuccess: () => {
          toast.success("Sub Task updated successfully");
        },
        onError: (error: any) => {
          console.log(error);
          toast.error("Failed to updated sub Task");
        },
      },
    );
  };

  const handleAddSubTask = () => {
    addSubTask(
      { taskId, title: newSubTask },
      {
        onSuccess: () => {
          setNewSubTask("");
          toast.success("Sub Task added successfully");
        },
        onError: (error: any) => {
          console.log(error);
          toast.error("Failed to add sub Task");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 ">
        {subTasks.length > 0 ? (
          subTasks.map((subTask) => (
            <div
              key={subTask._id}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-2 transition",
              )}
            >
              <Checkbox
                id={subTask._id}
                checked={subTask.completed}
                onCheckedChange={(checked) =>
                  handleToggleTask(subTask._id, !!checked)
                }
                disabled={isUpdating}
              />

              <label
                htmlFor={subTask._id}
                className={cn(
                  "text-sm cursor-pointer select-none flex-1",
                  subTask.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground",
                )}
              >
                {subTask.title}
              </label>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">
            No sub tasks yet
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-md border bg-background px-2 py-1.5">
        <Input
          placeholder="Add a sub task..."
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
          className="h-8 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Button
          size="sm"
          onClick={handleAddSubTask}
          disabled={!newSubTask.trim() || isPending}
          className="h-8 gap-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddSubTask();
            }
          }}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
};
