import type { Subtask } from "app/types";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  useAddSubTaskMutation,
  useCompleteSubTaskMutation,
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [newSubTask, setNewSubTask] = useState("");
  const { mutate: addSubTask, isPending } = useAddSubTaskMutation();
  const { mutate: updateSubTask, isPending: isUpdating } =
    useUpdateSubTaskMutation();
  const { mutate: CompleteTask, isPending: isCompleting } =
    useCompleteSubTaskMutation();

  const startEdit = (subTask: Subtask) => {
    setEditingId(subTask._id);
    setEditingTitle(subTask.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveEdit = (subTaskId: string) => {
    if (!editingTitle.trim()) return cancelEdit();

    handleUpdateTask(subTaskId, editingTitle.trim());
    setEditingId(null);
  };

  const handleCompleteTask = (subTaskId: string, checked: boolean) => {
    CompleteTask(
      { taskId, subTaskId, completed: checked },
      {
        onSuccess: () => {
          toast.success("Sub Task updated");
        },
        onError: (error: any) => {
          console.log(error);
          toast.error("Failed to updated Sub task");
        },
      },
    );
  };

  const handleUpdateTask = (subTaskId: string, title: string) => {
    updateSubTask(
      { taskId, subTaskId, title },
      {
        onSuccess: () => {
          toast.success("Sub Task updated");
        },
        onError: (error: any) => {
          console.log(error);
          toast.error("Failed to updated Sub Task");
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
              className="flex items-center gap-3 rounded-md border px-3 py-2"
            >
              <Checkbox
                checked={subTask.completed}
                onCheckedChange={(checked) =>
                  handleCompleteTask(subTask._id, !!checked)
                }
                disabled={isCompleting}
              />

              {editingId === subTask._id ? (
                <Input
                  autoFocus
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="h-7 text-sm"
                  onBlur={() => saveEdit(subTask._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(subTask._id);
                    if (e.key === "Escape") cancelEdit();
                  }}
                />
              ) : (
                <span
                  onDoubleClick={() => startEdit(subTask)}
                  className={cn(
                    "text-sm flex-1 cursor-text",
                    subTask.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground hover:underline",
                  )}
                >
                  {subTask.title}
                </span>
              )}
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
