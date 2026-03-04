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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TaskColumn } from "@/components/task/task-column";

const ProjectDetail = () => {
  const { projectId, workspaceId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");
  type TaskViewMode = "card" | "list";

  const [taskView, setTaskView] = useState<TaskViewMode>("card");

  if (!projectId) return <div>Project not found</div>;

  const { data, isLoading } = useGetProjectById(projectId) as {
    data: {
      tasks: Task[];
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

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    );
  };

  return (
    <div className="space-y-10">
      {/* ===== Header ===== */}
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <BackButton />

            <h1
              className="truncate text-2xl font-semibold tracking-tight"
              title={project.title}
            >
              {project.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Badge variant="secondary">{project.status}</Badge>

            <Badge variant="outline">{tasks.length} tasks</Badge>

            {project.dueDate && (
              <Badge variant="destructive">
                Due {new Date(project.dueDate).toLocaleDateString()}
              </Badge>
            )}

            <div className="flex items-center gap-2">
              <Progress value={projectProgress} className="h-2 w-20" />
              <span className="text-xs text-muted-foreground">
                {projectProgress}%
              </span>
            </div>
          </div>

          <div className="shrink-0 ml-auto">
            <Button size="sm" className="flex items-center gap-2" onClick={() => setIsCreateTask(true)}>
              <Plus className="h-4 w-4" />
              Add task
            </Button>
          </div>
        </div>
        {/* Description */}
        {project.description && (
          <div className="relative max-w-2xl pl-4">
            <span className="absolute left-0 top-0 h-full w-1 rounded-full bg-primary" />

            <p className="text-base leading-relaxed text-muted-foreground line-clamp-3">
              {project.description}
            </p>
          </div>
        )}

      </div>

      {/* ===== Task section ===== */}
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                onClick={() => setTaskFilter("Completed")}
              >
                Completed
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                onClick={() => setTaskFilter("Cancelled")}
              >
                Cancelled
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Status:</span>
              <div>
                <Badge variant="outline" className="bg-background gap-1">
                  {tasks.filter((task) => task.status === "To Do").length} To Do
                </Badge>
                <Badge variant="outline" className="bg-background gap-1">
                  {tasks.filter((task) => task.status === "In Progress").length}{" "}
                  In Progress
                </Badge>
                <Badge variant="outline" className="bg-background gap-1">
                  {tasks.filter((task) => task.status === "Completed").length}{" "}
                  Completed
                </Badge>
                <Badge variant="outline" className="bg-background gap-1">
                  {tasks.filter((task) => task.status === "Cancelled").length}{" "}
                  Cancelled
                </Badge>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-4 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="Completed"
                tasks={tasks.filter((task) => task.status === "Completed")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="Cancelled"
                tasks={tasks.filter((task) => task.status === "Cancelled")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="todo" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="completed" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="Completed"
                tasks={tasks.filter((task) => task.status === "Completed")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="Cancelled"
                tasks={tasks.filter((task) => task.status === "Cancelled")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>
        </Tabs>
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
