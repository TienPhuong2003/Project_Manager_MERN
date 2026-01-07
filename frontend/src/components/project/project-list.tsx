import { NoDataFound } from "@/components/no-data-found";
import type { Project } from "app/types";
import { ProjectCard } from "./project-card";

interface ProjectListProps {
  workspaceId: string;
  projects?: Project[];
  onCreateProject: () => void;
}

export const ProjectList = ({
  workspaceId,
  projects = [],
  onCreateProject,
}: ProjectListProps) => {
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <NoDataFound
            title="No Projects Found"
            description="Create a new project to get started."
            buttonText="Create Project"
            buttonAction={onCreateProject}
          />
        ) : (
          projects.map((project) => {
            const projectProgress = 0;

            return (
              <ProjectCard
                key={project._id}
                project={project}
                progress={projectProgress}
                workspaceId={workspaceId}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
