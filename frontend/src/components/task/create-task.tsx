import { createtaskSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTask } from "app/hooks/use-task";
import type { ProjectMemberRole, User } from "app/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { Check } from "lucide-react";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectMembers: { user: User; role: ProjectMemberRole }[];
}

export type CreateTaskFormData = z.infer<typeof createtaskSchema>;

export const CreateTaskDialog = ({
  isOpen,
  onOpenChange,
  projectId,
  projectMembers,
}: CreateTaskDialogProps) => {
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createtaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Low",
      dueDate: "",
      assignees: [],
    },
  });

  const { mutate, isPending } = useCreateTask();
  const [openDueDate, setOpenDueDate] = useState(false);
  const onSubmit = (values: CreateTaskFormData) => {
    console.log("FORM VALUES:", values);
    mutate(
      { projectId, taskData: values },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the task..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Due date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Popover open={openDueDate} onOpenChange={setOpenDueDate}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left flex items-center gap-2 min-w-0",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4 shrink-0" />

                          <span
                            className="truncate"
                            title={
                              field.value
                                ? format(new Date(field.value), "PPPP")
                                : ""
                            }
                          >
                            {field.value
                              ? format(new Date(field.value), "PPPP")
                              : "Pick a date"}
                          </span>
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent>
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          initialFocus={false}
                          defaultMonth={
                            field.value ? new Date(field.value) : undefined
                          }
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(date ? date.toISOString() : "");
                            setOpenDueDate(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignees"
              render={({ field }) => {
                const selectedIds = field.value || [];

                return (
                  <FormItem>
                    <FormLabel>Assignees</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full min-h-11 justify-start gap-2 flex-wrap"
                          >
                            {selectedIds.length === 0 ? (
                              <span className="text-muted-foreground">
                                Select assignees
                              </span>
                            ) : (
                              <>
                                {selectedIds.slice(0, 3).map((id) => {
                                  const member = projectMembers.find(
                                    (m) => m.user._id === id
                                  );

                                  return (
                                    <span
                                      key={id}
                                      className="rounded bg-muted px-2 py-0.5 text-sm truncate max-w-[120px]"
                                    >
                                      {member?.user.name}
                                    </span>
                                  );
                                })}

                                {selectedIds.length > 3 && (
                                  <span className="text-sm text-muted-foreground">
                                    +{selectedIds.length - 3}
                                  </span>
                                )}
                              </>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        className="w-[--radix-popover-trigger-width] p-0"
                      >
                        <Command>
                          <CommandEmpty>No members found.</CommandEmpty>

                          <CommandGroup className="max-h-60 overflow-y-auto">
                            {projectMembers.map((member) => {
                              const userId = member.user._id;
                              const isSelected = selectedIds.includes(userId);

                              return (
                                <CommandItem
                                  key={userId}
                                  onSelect={() => {
                                    if (isSelected) {
                                      field.onChange(
                                        selectedIds.filter(
                                          (id) => id !== userId
                                        )
                                      );
                                    } else {
                                      field.onChange([...selectedIds, userId]);
                                    }
                                  }}
                                  className={cn(
                                    "min-h-11 px-3 flex items-center gap-3 cursor-pointer",
                                    isSelected && "bg-accent"
                                  )}
                                >
                                  <Check
                                    className={cn(
                                      "h-4 w-4 shrink-0",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <span className="text-sm truncate">
                                    {member.user.name}
                                  </span>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Footer */}
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
