import { BackButton } from "@/components/ui/back-button";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/provider/auth-context";
import { useTaskById } from "app/hooks/use-task";
import type { Project, Task } from "app/types";
import { useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeOff,Eye } from "lucide-react";

const TaskDetail = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams<{
    taskId: string;
    projectId: string;
    workspaceId: string;
  }>();
  const { data, isLoading } = useTaskById(taskId!) as {
    data: {
      task: Task;
      project: Project;
    };
    isLoading: boolean;
  };

  if (isLoading) {
    return <Loader />;
  }
  console.log(data.task);
  

  if (!data?.task || !data?.project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Task not found</div>
      </div>
    );
  }

  const { task, project } = data;
  const isUserWatching = task?.watchers?.some(
    (watcher) => watcher._id === user?._id
  );
  const members = task?.assignees || [];
  return (
    <div className="container mx-auto p-0 py-4 md:px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <BackButton />
          <h1 className="">{task.title}</h1>
          {
            task.isArchived && <Badge className="ml-2" variant={"outline"} > 
                Archived
            </Badge>
          }
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant={"outline"} className="w-fit" onClick={() => {}} size={"sm"}>{isUserWatching ? (
                <>
                    <EyeOff className="mr-2 size-4"/>
                    Unwatch
                </>
            ): (
                <>
                    <Eye className="mr-2 size-4"/>
                    Unwatch
                </>
            )}</Button>


            <Button variant={"outline"} className="w-fit" onClick={() => {}} size={"sm"}>
                {task.isArchived ? "Unarchive" : "Archived"}
            </Button>
          </div>
        </div>

        <div>

            
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
