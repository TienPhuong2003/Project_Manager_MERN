import type { User, Workspace } from "app/types";
import { WorkspaceAvatar } from "./workspace-avatar";
import { Button } from "../ui/button";
import { Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface WorkspaceHeaderProps {
  workspace?: Workspace;
  members: {
    _id: string;
    user: User;
    role: "admin" | "member" | "viewer" | "owner";
    joinedAt: Date;
  }[];
  onCreateProject: () => void;
  onInviteMember: () => void;
}

export const WorkspaceHeader = ({
  workspace,
  members = [],
  onCreateProject,
  onInviteMember,
}: WorkspaceHeaderProps) => {
  if (!workspace) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg border">
        <div className="w-12 h-12 rounded-md bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          <div className="h-3 w-60 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-background p-5 space-y-5">
      {/* TOP */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4 min-w-0">
          <WorkspaceAvatar
            color={workspace.color}
            name={workspace.name}
            size="lg"
          />

          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-semibold truncate">
              {workspace.name}
            </h2>

            {workspace.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {workspace.description}
              </p>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onInviteMember}>
            <UserPlus className="mr-2 size-4" />
            Invite
          </Button>

          <Button size="sm" onClick={onCreateProject}>
            <Plus className="mr-2 size-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* MEMBERS */}
      {members.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground shrink-0">
            Members ({members.length})
          </span>

          <div className="flex -space-x-2">
            {members.slice(0, 6).map((member) => (
              <Avatar
                key={member._id}
                className="h-8 w-8 border-2 border-background shadow-sm font-bold "
                title={`${member.user.name} - ${member.role}`}
              >
                <AvatarImage src={member.user.profilePicture} />
                <AvatarFallback className="capitalize text-black">{member.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}

            {members.length > 6 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                +{members.length - 6}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
