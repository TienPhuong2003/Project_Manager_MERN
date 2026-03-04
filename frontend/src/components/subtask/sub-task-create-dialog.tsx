
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createSubTaskSchema } from "@/lib/schema";
import { useAddSubTaskMutation } from "app/hooks/use-task";

type Props = {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormData = z.infer<typeof createSubTaskSchema>;

export function SubTaskCreate({ taskId, open, onOpenChange }: Props) {
  const { mutate: addSubTask, isPending } = useAddSubTaskMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(createSubTaskSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (data: FormData) => {
    addSubTask(
      { taskId, title: data.title },
      {
        onSuccess: () => {
          toast.success("Sub task added successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to add sub task");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Sub Task</DialogTitle>
          <DialogDescription>Add your sub task here</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter sub task title"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
