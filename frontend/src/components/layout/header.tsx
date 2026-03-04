import type { Workspace } from "app/types";
import { Button } from "../ui/button";
import { Bell, PlusCircle, PlusCircleIcon } from "lucide-react";
import { useAuth } from "@/provider/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
  onCreateWorkspace: () => void;
}
export const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}: HeaderProps) => {
  const navigate = useNavigate();
  
  const { user, logout } = useAuth();
  const {workspaces} = useLoaderData() as {workspaces: Workspace[]};
  const isOnWorkspacePage = useLocation().pathname.startsWith("/workspaces");
  
  const handleOnClick = (workspace: Workspace) => {
    onWorkspaceSelected(workspace);
    const location = window.location;
    if (isOnWorkspacePage) {
      navigate(`/workspaces/${workspace._id}`);
    } else {
      const basePath = location.pathname
      navigate(`${basePath}?workspaceId=${workspace._id}`);
    }
  }

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 px-3">
              {selectedWorkspace ? (
                <>
                  <WorkspaceAvatar
                    color={selectedWorkspace.color}
                    name={selectedWorkspace.name}
                    size="md"
                  />
                  <span className="font-semibold truncate max-w-[140px]">
                    {selectedWorkspace.name}
                  </span>
                </>
              ) : (
                <span className="font-medium">
                  Select Workspace
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {workspaces.map((ws) => {
                const isSelected = selectedWorkspace?._id === ws._id;
              
                return (
                  <DropdownMenuItem
                    key={ws._id}
                    onClick={() => handleOnClick(ws)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer",
                      "transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <WorkspaceAvatar
                      color={ws.color}
                      name={ws.name}
                      size="sm"
                    />

                    <span className="flex-1 font-medium truncate">
                      {ws.name}
                    </span>

                    {isSelected && (
                      <span className="text-xs text-primary font-semibold">
                        ✓
                      </span>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onCreateWorkspace}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="rounded-full border p-1 w-8 h-8">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0).toLocaleUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/user/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
