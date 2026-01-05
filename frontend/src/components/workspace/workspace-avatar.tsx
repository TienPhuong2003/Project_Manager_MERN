import React from "react";
import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  color: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

export const WorkspaceAvatar = ({
  color,
  name,
  size = "sm",
}: WorkspaceAvatarProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md",
        "font-semibold text-white",
        "transition-transform duration-200",
        "hover:scale-[1.05]", // chỉ motion nhẹ
        sizeMap[size]
      )}
      style={{ backgroundColor: color }}
    >
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};
