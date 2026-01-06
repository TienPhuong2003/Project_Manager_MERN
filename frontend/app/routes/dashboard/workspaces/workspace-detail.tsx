import { useState } from "react";
import { useParams } from "react-router";
import { useGetWorkspaceById } from "../../../hooks/use-workspace";
import type { Workspace, Project } from "app/types";
import { Loader } from "@/components/ui/loader";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { ProjectList } from "../projects/project-list";
import { CreateProjectDialog } from "../projects/create-project";
const WorkspaceDetail = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInvitedmember, setIsInvitedmember] = useState(false);

  if (!workspaceId) {
    return <div>No workspace found</div>;
  }

  const { data, isLoading } = useGetWorkspaceById(workspaceId) as {
    data: {
      workspace: Workspace;
      projects: Project[];
    };
    isLoading: boolean;
  };
  console.log(data);
  if (isLoading) {
    return (
        <div>
            <Loader />
        </div>
    );
  }
  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={data.workspace}
        members={data?.workspace?.members as any}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInvitedmember(true)}
      />

      <ProjectList 
        workspaceId={workspaceId}
        projects={data.projects}
        onCreateProject={() => setIsCreateProject(true)}
      />

      <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={data?.workspace?.members as any}
      />
    </div>
  );
};

export default WorkspaceDetail;
