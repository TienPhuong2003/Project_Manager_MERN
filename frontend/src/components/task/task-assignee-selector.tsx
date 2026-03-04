import type { ProjectMemberRole, Task, User } from "app/types";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateTaskAssigneesMutation } from "app/hooks/use-task";
import { toast } from "sonner";

type Props = {
  task: Task;
  assignees: User[];
  projectMembers: { user: User; role: ProjectMemberRole }[];
};

export const TaskAssigneesSelector = ({
  task,
  assignees,
  projectMembers,
}: Props) => {
  const { mutate, isPending } = useUpdateTaskAssigneesMutation();

  const [selectedIds, setSelectedIds] = useState<string[]>(
    assignees.map((u) => u._id),
  );
  const [openPop, setOpenPop] = useState(false);

  const initialIdsRef = useRef<string[]>(assignees.map((u) => u._id));

  useEffect(() => {
    const ids = assignees.map((u) => u._id);
    setSelectedIds(ids);
    initialIdsRef.current = ids;
  }, [assignees]);

  const selectedUsers = useMemo(
    () =>
      projectMembers
        .filter((m) => selectedIds.includes(m.user._id))
        .map((m) => m.user),
    [projectMembers, selectedIds],
  );

  const toggleAssign = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const hasChanged = useMemo(() => {
    const initial = initialIdsRef.current;
    return (
      initial.length !== selectedIds.length ||
      initial.some((id) => !selectedIds.includes(id))
    );
  }, [selectedIds]);

  const handleCancel = () => {
    setSelectedIds(initialIdsRef.current);
    setOpenPop(false);
  };

  const handleConfirm = () => {
    if (selectedIds.length === 0) {
      toast.error("Task must have at least one assignee");
      return;
    }
    const initial = initialIdsRef.current;

    const hasChanged =
      initial.length !== selectedIds.length ||
      initial.some((id) => !selectedIds.includes(id));

    if (!hasChanged) {
      setOpenPop(false);
      return;
    }

    mutate(
      {
        taskId: task._id,
        assignees: selectedIds,
      },
      {
        onSuccess: () => {
          initialIdsRef.current = selectedIds;
          toast.success("Update assignees successfully");
          setOpenPop(false);
        },
        onError: () => {
          setSelectedIds(initialIdsRef.current);
          toast.error("Failed to update assignees");
        },
      },
    );
  };

  const handlePopoverChange = (nextOpen: boolean) => {
    if (openPop && !nextOpen) {
      handleCancel();
    }
    setOpenPop(nextOpen);
  };

  // ===== Render =====
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Assignees</h3>

        <Popover open={openPop} onOpenChange={handlePopoverChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isPending}
            >
              <UserPlus className="size-4" />
              Members
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-64 p-0" align="end">
            <Command>
              <CommandInput placeholder="Search member..." />
              <CommandEmpty>No member found</CommandEmpty>

              <CommandGroup>
                {projectMembers.map(({ user }) => {
                  const selected = selectedIds.includes(user._id);

                  return (
                    <CommandItem
                      key={user._id}
                      onSelect={() => toggleAssign(user._id)}
                      className={cn(
                        "flex items-center gap-2",
                        selected && "bg-accent/50",
                      )}
                    >
                      <Avatar className="size-6">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                      </Avatar>

                      <span className="flex-1 text-sm">{user.name}</span>

                      <Check
                        className={cn(
                          "size-4 transition",
                          selected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}

                <div className="px-2 py-1 text-xs text-muted-foreground">
                  {selectedUsers.length} selected
                </div>
              </CommandGroup>

              <div className="flex justify-between items-center px-2 py-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onClick={handleConfirm}
                  disabled={!hasChanged || isPending}
                >
                  OK
                </Button>
              </div>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected avatars */}
      {selectedUsers.length > 0 && (
        <div className="flex -space-x-2 pt-1">
          {selectedUsers.slice(0, 5).map((u) => (
            <Avatar key={u._id} className="size-7 border-2 border-background">
              <AvatarImage src={u.profilePicture} />
              <AvatarFallback>{u.name?.[0]}</AvatarFallback>
            </Avatar>
          ))}

          {selectedUsers.length > 5 && (
            <div className="size-7 rounded-full bg-muted text-xs flex items-center justify-center">
              +{selectedUsers.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
