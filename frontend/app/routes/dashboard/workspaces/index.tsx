import React, { useState } from "react";
import { useGetWorkspacesQuery } from "../../../hooks/use-workspace";
import type { Workspace } from "app/types";
import { PlusCircle, Users } from "lucide-react";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { Button } from "@/components/ui/button";
import { NoDataFound } from "@/components/no-data-found";
import { Link } from "react-router";
import {
  Card,
} from "@/components/ui/card";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { format } from "date-fns";
import { Loader } from "@/components/ui/loader";
const Workspaces = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const { data: workspaces, isLoading, isError } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
    isError: boolean;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
  return (
    <NoDataFound
      title="Something went wrong"
      description="We couldn't load your workspaces. Please try again later."
      buttonText="Retry"
      buttonAction={() => window.location.reload()}
    />
  );
}
   
  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>

          <Button onClick={() => setIsCreatingWorkspace(true)}>
            <PlusCircle className="size-4 mr-2" />
            New Workspace
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} />
          ))}

          {workspaces.length === 0 && (
            <NoDataFound
              title="No Workspaces Found"
              description="You haven't created any workspaces yet. Click the button below to create your first workspace."
              buttonText="Create Workspace"
              buttonAction={() => setIsCreatingWorkspace(true)}
            />
          )}
        </div>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {

  return (
    <Link to={`/workspaces/${workspace._id}`} className="group" >
      <Card
        className="
          relative overflow-hidden
          transition-all duration-200
          hover:-translate-y-0.5
          hover:shadow-md
        "
      >
        {/* Accent line */}
        <span
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{ backgroundColor: workspace.color }}
        />

        {/* CONTENT WRAPPER */}
        <div className="flex flex-col h-full px-4 py-3 gap-2">
          {/* HEADER */}
          <div className="flex items-start gap-3">
            <WorkspaceAvatar
              color={workspace.color}
              name={workspace.name}
              size="md"
            />

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold truncate">
                {workspace.name}
              </h3>

              <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                <span>
                  {format(workspace.createdAt, "MMM dd, yyyy h:mm a")}
                </span>

                <span className="flex items-center gap-1">
                  <Users className="size-3.5" />
                  {workspace.members?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-muted-foreground leading-snug">
            {workspace.description || "No description"}
          </p>

          <div className="flex justify-end pt-2 mt-auto">
            <span
              className="
                text-xs font-semibold text-primary
                flex items-center gap-1
                transition-all
                group-hover:translate-x-0.5
              "
            >
              Open Workspace →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default Workspaces;
