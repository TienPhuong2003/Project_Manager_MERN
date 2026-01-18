import { BackButton } from "@/components/ui/back-button";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/provider/auth-context";
import { useTaskById } from "app/hooks/use-task";
import type { Project, Task } from "app/types";
import { useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";
import { TaskTitle } from "@/components/task/task-title";
import { formatDistanceToNow } from "date-fns";
import { TaskStatusSelector } from "@/components/task/task-status-selector";
import { TaskDescription } from "@/components/task/task-description";
import { TaskAssigneesSelector } from "@/components/task/task-assignee-selector";

const TaskDetail = () => {
  const { user } = useAuth();
  const { taskId } = useParams<{ taskId: string }>();

  const { data, isLoading } = useTaskById(taskId!) as {
    data: {
      task: Task;
      project: Project;
    };
    isLoading: boolean;
  };

  if (isLoading) return <Loader />;

  if (!data?.task || !data?.project) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold text-muted-foreground">
          Task not found
        </p>
      </div>
    );
  }

  const { task, project } = data;

  const isUserWatching = task.watchers?.some(
    (watcher) => watcher._id === user?._id,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      {/* ===== Header ===== */}
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <BackButton />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold md:text-2xl">Task detail</h1>

              {task.isArchived && (
                <Badge variant="outline" className="text-xs">
                  Archived
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              View & manage this task
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            {isUserWatching ? (
              <>
                <EyeOff className="mr-2 size-4" />
                Unwatch
              </>
            ) : (
              <>
                <Eye className="mr-2 size-4" />
                Watch
              </>
            )}
          </Button>

          <Button variant={task.isArchived ? "secondary" : "outline"} size="sm">
            {task.isArchived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* ===== Main ===== */}
        <div className="md:col-span-2">
          <div className="rounded-xl border bg-card p-6">
            {/* ===== Row 1: Meta + Actions ===== */}
            <div className="flex items-center justify-between">
              {/* Meta */}
              <div className="flex items-center gap-2 min-h-[32px]">
                <Badge
                  variant={
                    task.priority === "High"
                      ? "destructive"
                      : task.priority === "Medium"
                        ? "default"
                        : "outline"
                  }
                  className="h-6 px-2 text-xs capitalize"
                >
                  {task.priority} priority
                </Badge>

                <span className="text-xs text-muted-foreground leading-none">
                  Created{" "}
                  {formatDistanceToNow(new Date(task.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 min-h-[32px] shrink-0">
                <TaskStatusSelector status={task.status} taskId={task._id} />

                <Button variant="destructive" size="sm" className="h-8">
                  Delete
                </Button>
              </div>
            </div>

            {/* ===== Row 2: Title ===== */}
            <div className="mt-3">
              <TaskTitle title={task.title} taskId={task._id} />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Description
            </h3>

            <TaskDescription description={task.description} taskId={task._id} />
          </div>
        </div>

        {/* ===== Sidebar  ===== */}
        <div className="hidden md:block">
          <div className="rounded-xl border bg-card p-6">
            <TaskAssigneesSelector
              task={task}
              assignees={task.assignees}
              projectMembers={project.members as any}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
