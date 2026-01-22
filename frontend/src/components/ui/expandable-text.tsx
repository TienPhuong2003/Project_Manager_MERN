import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export const ExpandableText = ({
  text,
  lines = 3,
}: {
  text: string;
  lines?: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    setCanExpand(ref.current.scrollHeight > ref.current.clientHeight);
  }, [text, lines]);

  return (
    <div className="space-y-1">
      <p
        ref={ref}
        className={cn(
          "text-sm text-muted-foreground break-words whitespace-pre-wrap italic",
          !expanded && `line-clamp-${lines}`
        )}
      >
        {text}
      </p>

      {canExpand && (
        <span
          role="button"
          tabIndex={0}
          onClick={() => setExpanded((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setExpanded((v) => !v);
            }
          }}
          className="
            inline-block
            cursor-pointer
            text-xs
            font-medium
            text-primary
            underline-offset-4
            hover:underline
            focus:outline-none
            focus:ring-1
            focus:ring-primary/30
            rounded
          "
        >
          {expanded ? "Show less" : "Read more"}
        </span>
      )}
    </div>
  );
};
