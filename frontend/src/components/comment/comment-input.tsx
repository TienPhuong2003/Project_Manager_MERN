import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
};

export const CommentInput = ({ value, onChange, onSubmit, loading }: Props) => {
  return (
    <div className="relative w-full grid">
      <Textarea
        placeholder="Add a comment..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="
          resize-none
          pr-10
          pb-8
          max-h-32
          overflow-y-auto
        "
      />

      <Button
        size="icon"
        disabled={!value.trim() || loading}
        onClick={onSubmit}
        className="
          absolute
          bottom-2
          right-2
          h-7
          w-7
        "
      >
        <Send className="size-4" />
      </Button>
    </div>
  );
};
