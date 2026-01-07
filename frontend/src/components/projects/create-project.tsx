import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { projectSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectStatus, type Member } from "app/types";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns/format";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateProject } from "app/hooks/use-project";
import { toast } from "sonner";
interface CreateProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  workspaceMembers: Member[];
}
export type CreateProjectFormData = z.infer<typeof projectSchema>;
export const CreateProjectDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
  workspaceMembers,
}: CreateProjectDialogProps) => {
  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: ProjectStatus.PLANNING,
      startDate: "",
      dueDate: "",
      members: [],
      tags: undefined,
    },
  });
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openDueDate, setOpenDueDate] = useState(false);
  const { mutate, isPending } = useCreateProject();

  const handleClose = (open: boolean) => {
    onOpenChange(open);

    if (!open) {
      form.reset();
      setOpenStartDate(false);
      setOpenDueDate(false);
    }
  };

  const onSubmit = (values: CreateProjectFormData) => {
    if (!workspaceId) return;

    mutate(
      {
        projectData: values,
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Project create successfully");
          handleClose(false);
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project in your workspace.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short description about this project"
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* STATUS + TAGS */}
            <div className="grid grid-cols-3 gap-4">
              {/* STATUS */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {Object.values(ProjectStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TAGS */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Frontend, Backend, Urgent..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* MEMBERS */}
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => {
                const selectedMember = field.value || [];
                return (
                  <FormItem>
                    <FormLabel>Members</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left min-h-11 gap-2"
                          >
                            {selectedMember.length === 0 ? (
                              <span className="text-muted-foreground">
                                Select members
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                {selectedMember.slice(0, 3).map((m) => {
                                  const member = workspaceMembers.find(
                                    (wm) => wm.user._id === m.user
                                  );

                                  return (
                                    <span
                                      key={m.user}
                                      className="px-2 py-0.5 rounded bg-muted text-sm truncate max-w-[100px]"
                                    >
                                      {member?.user.name}
                                    </span>
                                  );
                                })}
                                {selectedMember.length > 3 && (
                                  <span className="text-sm text-muted-foreground">
                                    +{selectedMember.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[320px] p-2" align="start">
                          <div className="flex flex-col gap-1">
                            {workspaceMembers.map((member) => {
                              const selected = selectedMember.find(
                                (m) => m.user === member.user._id
                              );
                              const toggleMember = (memberId: string) => {
                                const exists = selectedMember.find(
                                  (m) => m.user === memberId
                                );

                                if (exists) {
                                  field.onChange(
                                    selectedMember.filter(
                                      (m) => m.user !== memberId
                                    )
                                  );
                                } else {
                                  field.onChange([
                                    ...selectedMember,
                                    { user: memberId, role: "contributor" },
                                  ]);
                                }
                              };
                              return (
                                <div
                                  key={member._id}
                                  onClick={() => toggleMember(member.user._id)}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer transition",
                                    selected ? "bg-accent" : "hover:bg-muted"
                                  )}
                                >
                                  <Checkbox
                                    checked={!!selected}
                                    className="pointer-events-none"
                                  />

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {member.user.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {member.role}
                                    </p>
                                  </div>

                                  {/* Role select */}
                                  {selected && (
                                    <div onClick={(e) => e.stopPropagation()}>
                                      <Select
                                        value={selected.role}
                                        onValueChange={(role) => {
                                          field.onChange(
                                            selectedMember.map((m) =>
                                              m.user === member.user._id
                                                ? { ...m, role: role as "contributor" | "manager" | "viewer" }
                                                : m
                                            )
                                          );
                                        }}
                                      >
                                        <SelectTrigger className="h-8 w-[130px] text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="manager">
                                            Manager
                                          </SelectItem>
                                          <SelectItem value="contributor">
                                            Contributor
                                          </SelectItem>
                                          <SelectItem value="viewer">
                                            Viewer
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* START DATE */}
            <div className="grid grid-cols-2 gap-4 min-w-0">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Popover
                        open={openStartDate}
                        onOpenChange={setOpenStartDate}
                      >
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
                              setOpenStartDate(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DUE DATE */}
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
            </div>

            {/* FOOTER */}
            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
