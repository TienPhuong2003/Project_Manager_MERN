import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetProjectById } from "../../../hooks/use-project";
import type { Project, TaskStatus, Task } from "app/types";
import { Loader } from "@/components/ui/loader";
import { getProjectProgress } from "@/lib";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/components/task/create-task";
import { Plus } from "lucide-react";

const ProjectDetail = () => {
  const { projectId, workspaceId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

  if (!projectId) return <div>Project not found</div>;

  const { data, isLoading } = useGetProjectById(projectId) as {
    data: {
      task: Task[];
      project: Project;
    };
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    );
  }

  const { project, task } = data;
  const projectProgress = getProjectProgress(task);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  return (
    <div className="space-y-10">
      {/* ===== Header ===== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-2xl font-semibold tracking-tight">
            {project.title}
          </h1>
        </div>

        {project.description && (
          <p className="max-w-2xl text-sm text-muted-foreground">
            {project.description}
          </p>
        )}
      </div>

      {/* ===== Info bar ===== */}
      <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{projectProgress}%</span>
          </div>
          <Progress value={projectProgress} className="h-2" />
        </div>

        <Button
          onClick={() => setIsCreateTask(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      </div>

      {/* ===== Task section ===== */}
      <div className="space-y-4">
        {/* Filter */}
        <div className="flex gap-2">
          {["All", "Todo", "In Progress", "Done"].map((status) => (
            <Button
              key={status}
              variant={taskFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setTaskFilter(status as any)}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Task list */}
        <div className="divide-y rounded-lg border">
          {task.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No tasks yet. Create your first task 🚀
            </div>
          ) : (
            task
              .filter((t) =>
                taskFilter === "All" ? true : t.status === taskFilter
              )
              .map((t) => (
                <div
                  key={t._id}
                  onClick={() => handleTaskClick(t._id)}
                  className="
                    flex cursor-pointer items-center justify-between
                    px-4 py-3 text-sm
                    hover:bg-muted transition
                  "
                >
                  <span className="font-medium">{t.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {t.status}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>

      {/* ===== Dialog ===== */}
      <CreateTaskDialog
        isOpen={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId}
        projectMembers={project.members as any}
      />
    </div>
  );
};

export default ProjectDetail;
