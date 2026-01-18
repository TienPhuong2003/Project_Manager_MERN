import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit, Check, X } from "lucide-react";
import { useUpdateTaskMutation } from "app/hooks/use-task";
import { toast } from "sonner";

export const TaskTitle = ({
  title,
  taskId,
}: {
  title: string;
  taskId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { mutate, isPending } = useUpdateTaskMutation();

  const updateTitle = () => {
    if (!newTitle.trim() || newTitle === title) {
      setIsEditing(false);
      return;
    }

    mutate(
      { taskId, data: { title: newTitle } },
      {
        onSuccess: () => {
          toast.success("Title updated");
          setIsEditing(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Update failed");
        },
      }
    );
  };

  const cancelEdit = () => {
    setNewTitle(title);
    setIsEditing(false);
  };

  return (
    <div className="group flex items-center gap-2">
      {isEditing ? (
        <>
          <Input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateTitle();
              if (e.key === "Escape") cancelEdit();
            }}
            className="h-9 w-full text-lg font-semibold"
          />

          <Button size="icon" onClick={updateTitle} disabled={isPending}>
            <Check className="size-4" />
          </Button>

          <Button size="icon" variant="ghost" onClick={cancelEdit}>
            <X className="size-4" />
          </Button>
        </>
      ) : (
        <>
          <div className="min-w-0">
            <h2
              title={title}
              onDoubleClick={() => setIsEditing(true)}
              className="
                truncate
                text-lg
                font-semibold
                leading-tight
                cursor-text
              "
            >
              {title}
            </h2>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="
              shrink-0
              text-muted-foreground
              hover:text-foreground
            "
            aria-label="Edit title"
          >
            <Edit className="size-4" />
          </button>
        </>
      )}
    </div>
  );
};
