import type { Project } from "app/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { getProjectProgress, getProjectStatusColor } from "@/lib";
import { Link, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

export const RecentProjects = ({ data }: { data: Project[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent projects found.
          </p>
        ) : (
          data.map((project) => {
            const ProjectProgress = getProjectProgress(project.tasks);
            return (
              <div key={project._id} className="border rounded-l-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/workspaces/${workspaceId}/projects/${project._id}`}
                    className="hover:underline"
                  >
                    <h3 className="font-medium hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                  </Link>

                  <span className={cn("px-2 py-1 text-xs rounded-full", getProjectStatusColor(project.status))}>
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{project.description}</p>
                <div className="space-y-2"> 
                  <div className="flex items-center justify-between text-xs">
                    <span>Progress</span>
                    <span>{ProjectProgress}%</span>
                  </div>
                </div>
                <Progress value={ProjectProgress} className="h-2"/>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
