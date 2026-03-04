import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export const ExpandableText = ({
  text,
  lines = 2,
}: {
  text: string;
  lines?: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  const clampRef = useRef<HTMLParagraphElement>(null);
  const fullRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!clampRef.current || !fullRef.current) return;

    const clampHeight = clampRef.current.clientHeight;
    const fullHeight = fullRef.current.scrollHeight;

    setCanExpand(fullHeight > clampHeight + 1);
  }, [text, lines]);

  return (
    <div className="relative w-full min-w-0">
      {/* Text hiển thị */}
      <p
        ref={clampRef}
        className={cn(
          "w-full min-w-0 text-sm leading-relaxed text-muted-foreground break-words",
          !expanded && `line-clamp-${lines}`,
        )}
      >
        {text}
      </p>

      <p
        ref={fullRef}
        aria-hidden
        className="
          absolute inset-0
          w-full
          opacity-0
          pointer-events-none
          whitespace-normal
          break-words
          text-sm
          leading-relaxed
        "
      >
        {text}
      </p>

      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="
            mt-0.5
            inline-flex
            text-xs
            font-medium
            text-primary
            hover:underline
            underline-offset-4
            focus:outline-none
            focus:ring-1
            focus:ring-primary/30
            rounded
          "
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};
