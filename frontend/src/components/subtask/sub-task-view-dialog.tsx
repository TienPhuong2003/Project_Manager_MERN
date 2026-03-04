import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Subtask } from "app/types";
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtask: Subtask;
};

export function SubTaskView({ open, onOpenChange, subtask }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="text-base font-semibold">Detail</DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          <p
            className="whitespace-pre-wrap
              break-normal
              text-l
              leading-relaxed
              text-muted-foreground
            "
          >
            {subtask.title}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
