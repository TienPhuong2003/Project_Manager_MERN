import type { Comment } from "app/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { formatDateTime } from "@/helper/format-day-time";

export const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex gap-3 rounded-lg p-3 hover:bg-muted/50 transition">
      <Avatar className="relative flex size-8 shrink-0 overflow-hidden rounded-full w-8 h-8">
        <AvatarImage src={comment.author.profilePicture} />
        <AvatarFallback className="flex size-full items-center justify-center rounded-full bg-primary text-primary-foreground">
          {comment.author.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {comment.author.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
          </span>
        </div>

        <p className="text-sm leading-relaxed break-words min-w-0">
          {comment.text}
        </p>
        <span className="text-xs text-muted-foreground">
          {formatDateTime(comment.createdAt)}
        </span>
      </div>
    </div>
  );
};
