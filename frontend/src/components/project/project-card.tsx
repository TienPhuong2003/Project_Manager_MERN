import type { Project } from "app/types";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { getProjectStatusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { format } from "date-fns";
import { CalendarDays, CheckSquare } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: string;
}

export const ProjectCard = ({
  project,
  progress,
  workspaceId,
}: ProjectCardProps) => {
  return (
    <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
      <Card
        className="
          group h-full cursor-pointer
          transition-all duration-300
          hover:shadow-lg hover:-translate-y-1
        "
      >
        {/* ===== Header ===== */}
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-tight line-clamp-1">
              {project.title}
            </CardTitle>

            <span
              className={cn(
                "px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap",
                getProjectStatusColor(project.status)
              )}
            >
              {project.status}
            </span>
          </div>

          <CardDescription className="text-sm line-clamp-2">
            {project.description || "No description provided"}
          </CardDescription>
        </CardHeader>

        {/* ===== Content ===== */}
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4" />
              <span>{project.tasks.length} Tasks</span>
            </div>

            {project.dueDate && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <span>{format(new Date(project.dueDate), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
