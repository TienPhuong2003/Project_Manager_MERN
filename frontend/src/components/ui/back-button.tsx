import { useNavigate } from "react-router";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className="
        flex items-center gap-2
        px-3 py-2
        text-muted-foreground
        hover:text-foreground
        hover:bg-muted
        transition-colors
      "
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </Button>
  );
};
