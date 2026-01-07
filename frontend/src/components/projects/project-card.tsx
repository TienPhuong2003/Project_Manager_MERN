import type { Project } from "app/types";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { getProjectStatusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { format } from "date-fns/format";
import { CalendarDay } from "react-day-picker";
import { CalendarDays } from "lucide-react";


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
      <Card className="transition-all duration-300 hover:shadow-md hover:translate-y-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.title}</CardTitle>
            <span
              className={cn(
                "text-xs rounded-full",
                getProjectStatusColor(project.status)
              )}
            >
              {project.status}
            </span>
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2"/>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm gap-2 text-muted-foreground">
                  <span>{project.tasks.length}</span>
                  <span>Tasks</span>
                </div>

                {project.dueDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarDays className="h-4 w-4"/>
                    <span>{format(project.dueDate, "MMM d,yyyy")}</span>
                  </div>
                )
                  
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
