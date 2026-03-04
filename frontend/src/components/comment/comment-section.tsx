import type { Comment, User } from "app/types";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useAddCommentMutation, useCommentsByTaskId } from "app/hooks/use-task";
import { toast } from "sonner";
import { CommentItem } from "./comment-item";
import { CommentInput } from "./comment-input";

export const CommentSection = ({
  taskId,
  members,
}: {
  taskId: string;
  members: User[];
}) => {
  const [newComment, setNewComment] = useState("");

  const { mutate: addComment, isPending } = useAddCommentMutation();
  const { data: comments, isLoading } = useCommentsByTaskId(taskId) as {
    data: Comment[];
    isLoading: boolean;
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addComment(
      { taskId, text: newComment },
      {
        onSuccess: () => {
          setNewComment("");
          toast.success("Comment added successfully");
        },
        onError: () => {
          toast.error("Failed to add comment");
        },
      },
    );
  };

  return (
    <div
      className="bg-card
  rounded-lg
  p-6
  shadow-sm
  flex
  flex-col
  w-full
  min-w-0
  overflow-hidden"
    >
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      <ScrollArea className="h-[300px] pr-2 w-full">
        {comments?.length ? (
          <div className="space-y-2">
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground italic">
              No comments yet.
            </p>
          </div>
        )}
      </ScrollArea>

      <Separator className="my-4" />
      
      <div className="w-full mb-4">
        <CommentInput
          value={newComment}
          onChange={setNewComment}
          onSubmit={handleAddComment}
          loading={isPending}
        />
      </div>
    </div>
  );
};
