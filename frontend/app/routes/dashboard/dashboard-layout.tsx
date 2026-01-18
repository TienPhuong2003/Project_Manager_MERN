import { Header } from "@/components/layout/header";
import { SidebarComponent } from "@/components/layout/sidebar";
import type { Workspace } from "app/types";
import { useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { fetchData } from "@/lib/fetch-util";
export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([
      fetchData("/workspaces"),
    ]);
    return { workspaces };
  } catch (error) {
    console.error(error);
    return { workspaces: [] };
  }
};

const DashboardLayout = () => {
  const { workspaces: loaderWorkspaces } = useLoaderData() as {
    workspaces: Workspace[];
  };

  const [workspaces, setWorkspaces] = useState<Workspace[]>(loaderWorkspaces);

  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  return (
    <div className="flex h-screen w-full">
      <SidebarComponent currentWorkspace={currentWorkspace} />
      <div className="flex flex-1 flex-col h-full">
        <Header
          workspaces={workspaces}
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />
        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;
