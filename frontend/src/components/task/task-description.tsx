import { useState } from "react";
import { Button } from "../ui/button";
import { Edit2, Check, X } from "lucide-react";
import { useUpdateTaskMutation } from "app/hooks/use-task";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

export const TaskDescription = ({
  description = "",
  taskId,
}: {
  description?: string;
  taskId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const { mutate, isPending } = useUpdateTaskMutation();

  const updateDescription = () => {
    if (newDescription.trim() === description) {
      setIsEditing(false);
      return;
    }

    mutate(
      {
        taskId,
        data: { description: newDescription },
      },
      {
        onSuccess: () => {
          toast.success("Description updated");
          setIsEditing(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Update failed");
        },
      }
    );
  };

  const cancel = () => {
    setNewDescription(description || "");
    setIsEditing(false);
  };

  return (
    <div className="group rounded-lg border bg-muted/30 p-4 transition hover:bg-muted/40">
      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            autoFocus
            className="resize-none"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={5}
            placeholder="Add a description..."
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey))
                updateDescription();
            }}
          />

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={updateDescription} disabled={isPending}>
              <Check className="mr-1 size-4" />
              Save
            </Button>

            <Button size="sm" variant="ghost" onClick={cancel}>
              <X className="mr-1 size-4" />
              Cancel
            </Button>

            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl + Enter to save
            </span>
          </div>
        </div>
      ) : (
        <div className="relative">
          {description ? (
            <p
              onClick={() => setIsEditing(true)}
              className="whitespace-pre-wrap text-sm text-foreground cursor-text pr-6"
            >
              {description}
            </p>
          ) : (
            <p
              onClick={() => setIsEditing(true)}
              className="text-sm italic text-muted-foreground cursor-text "
            >
              Describe the task
            </p>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="
        absolute right-0 top-0
        opacity-0 transition
        group-hover:opacity-100
        text-muted-foreground hover:text-foreground
      "
          >
            <Edit2 className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};
