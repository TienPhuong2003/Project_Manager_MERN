import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "app/types";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ListCheck,
  CheckCircle2,
  Settings,
  Wrench,
  ChevronsRight,
  ChevronsLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

export const SidebarComponent = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Workspaces", href: "/workspaces", icon: Users },
    { title: "My Tasks", href: "/my-tasks", icon: ListCheck },
    { title: "Members", href: "/members", icon: Users },
    { title: "Achieved", href: "/achieved", icon: CheckCircle2 },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "md:w-[80px]" : "md:w-[240px]"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Wrench className="size-6 text-blue-600" />
          {!isCollapsed && (
            <span className="font-semibold text-lg hidden md:block">
              TaskHub
            </span>
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden md:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </Button>
      </div>

      {/* Scrollable navigation */}
      <ScrollArea className="flex-1 px-2 py-3">
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          className={cn(isCollapsed && "items-center space-y-2")}
          currentWorkspace={currentWorkspace}
        />
      </ScrollArea>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={logout}
        >
          <LogOut className="size-4" />
          {!isCollapsed && <span className="hidden md:block">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};
