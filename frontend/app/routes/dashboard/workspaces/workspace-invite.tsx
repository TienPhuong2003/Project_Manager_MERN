import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import {
  useAcceptInvitationByGenerate,
  useAcceptInvitationByToken,
  useGetWorkspaceDetail,
} from "app/hooks/use-workspace";
import type { Workspace } from "app/types";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";

const WorkspaceInvite = () => {
  const { workspaceId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("tk");
  const navigate = useNavigate();
  const { data: workspace, isLoading } = useGetWorkspaceDetail(
    workspaceId!,
  ) as { data: Workspace; isLoading: boolean };

  const {
    mutate: acceptInvitationByToken,
    isPending: isAcceptInvitedByTokenPending,
  } = useAcceptInvitationByToken();

  const {
    mutate: acceptInvitationByGenerate,
    isPending: isAcceptInvitedByGeneratePending,
  } = useAcceptInvitationByGenerate();
  if (!workspaceId) {
    return <div>Workspace not found</div>;
  }

  const handleAcceptInvite = () => {
    if (!workspaceId) return;

    if (token) {
      acceptInvitationByToken(token, {
        onSuccess: () => {
          toast.success("Invitation accepted");
          navigate(`/workspaces/${workspaceId}`);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
          console.log(error);
        },
      });
    } else {
      acceptInvitationByGenerate(workspaceId, {
        onSuccess: () => {
          toast.success("Invitation accepted");
          navigate(`/workspaces/${workspaceId}`);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
          console.log(error);
        },
      });
    }
  };

  const handleDeclineInvite = () => {
    toast.info("Invitation declined");
    navigate("/workspaces");
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (!workspace) {
    return (
      <div className=" flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              this workspace invitation is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/workspaces")} className="w-full">
              Go to workspaces
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <WorkspaceAvatar name={workspace.name} color={workspace.color} />
            <CardTitle>{workspace.name}</CardTitle>
          </div>
          <CardDescription>
            You've been invited to join the "<strong>{workspace.name}</strong>"
            workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workspace.description && (
            <p className="text-sm text-muted-foreground">
              {workspace.description}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              variant="default"
              className="flex-1"
              onClick={handleAcceptInvite}
              disabled={
                isAcceptInvitedByTokenPending ||
                isAcceptInvitedByGeneratePending
              }
            >
              {isAcceptInvitedByTokenPending || isAcceptInvitedByGeneratePending
                ? "Joining..."
                : "Accept Invitation"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDeclineInvite}
              disabled={
                isAcceptInvitedByTokenPending ||
                isAcceptInvitedByGeneratePending
              }
            >
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceInvite;
