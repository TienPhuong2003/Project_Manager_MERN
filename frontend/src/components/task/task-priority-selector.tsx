import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTaskMutation } from "app/hooks/use-task";
import type { TaskPriority } from "app/types";
import { cn } from "@/lib/utils";

const PRIORITIES = [
  {
    value: "Low",
    label: "Low",
    badgeClass: "border text-muted-foreground font-semibold",
  },
  {
    value: "Medium",
    label: "Medium",
    badgeClass:
      "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 font-semibold",
  },
  {
    value: "High",
    label: "High",
    badgeClass:
      "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 font-semibold",
  },
] as const;

export const TaskPrioritySelector = ({
  priority,
  taskId,
}: {
  priority: TaskPriority;
  taskId: string;
}) => {
  const { mutate, isPending } = useUpdateTaskMutation();
  const [open, setOpen] = useState(false);

  const current = PRIORITIES.find((p) => p.value === priority)!;

  const handleSelect = (value: TaskPriority) => {
    if (value === priority) {
      setOpen(false);
      return;
    }

    mutate(
      {
        taskId,
        data: { priority: value },
      },
      {
        onSuccess: () => {
          toast.success("Priority updated");
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Update failed");
        },
      }
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "h-6 px-2 text-xs capitalize cursor-pointer",
            current.badgeClass
          )}
        >
          {current.label} priority
        </Badge>
      </PopoverTrigger>

      <PopoverContent className="w-40 p-1" align="start">
        <Command>
          <CommandGroup>
            {PRIORITIES.map((p) => (
              <CommandItem
                key={p.value}
                onSelect={() => handleSelect(p.value)}
                disabled={isPending}
                className="flex items-center justify-between"
              >
                {p.label}
                {priority === p.value && <Check className="size-4" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
