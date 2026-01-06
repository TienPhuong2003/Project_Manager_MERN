import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import type { z } from "zod";
import { Input } from "@/components/ui/input";
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

  const onSubmit = (data: CreateProjectFormData) => {
    console.log(data);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project in your workspace.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Project Title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      className="border rounded p-2 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
