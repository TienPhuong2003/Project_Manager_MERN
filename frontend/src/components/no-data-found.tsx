import { LayoutGrid, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface NoDataFoundProps {
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
}

export const NoDataFound = ({
  title,
  description,
  buttonText,
  buttonAction,
}: NoDataFoundProps) => {
  return (
    <div className="
      col-span-full 
      flex flex-col items-center justify-center 
      rounded-xl border border-dashed 
      bg-muted/30 
      p-10 text-center
      transition-all
    ">
      {/* Icon */}
      <div className="
        mb-4 flex h-14 w-14 items-center justify-center 
        rounded-full bg-muted
        ring-1 ring-border
      ">
        <LayoutGrid className="h-6 w-6 text-muted-foreground" />
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold tracking-tight">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {/* CTA */}
      <Button
        onClick={buttonAction}
        className="mt-6 gap-2"
      >
        <Plus className="h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
};
