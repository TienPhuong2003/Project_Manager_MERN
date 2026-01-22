import { fetchData } from "@/lib/fetch-util";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { ActivityLog } from "app/types";
import { ACTIVITY_TEXT } from "@/lib/activity-text";
import { ExpandableText } from "../ui/expandable-text";
import { getActivityIcon } from "@/helper/get-activity-icon";
import { formatDateTime } from "@/helper/format-day-time";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TaskActivity = ({ resourceId }: { resourceId: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ["task-activity", resourceId],
    queryFn: () => fetchData(`/tasks/${resourceId}/activity`),
  }) as { data: ActivityLog[]; isPending: boolean };

  if (isPending) return <Loader />;

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-sm text-muted-foreground italic">
        No activity yet
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">
          Activity
        </h3>
      </div>

      {/* Scroll content */}
      <ScrollArea className="w-full max-h-[420px]">
        <div className="space-y-3 py-3">
          {data.map((log, index) => {
            const { icon: Icon, className } = getActivityIcon(log);

            return (
              <div
                key={log._id}
                className="
                  group relative flex gap-4 rounded-md p-2
                  transition hover:bg-muted/50
                "
              >
                {/* Timeline */}
                <div className="relative flex w-8 justify-center">
                  {index !== data.length - 1 && (
                    <span className="absolute top-8 h-full w-px bg-border" />
                  )}

                  <span
                    className="
                      relative z-10 flex size-8 items-center justify-center
                      rounded-md bg-background ring-1 ring-border
                      transition group-hover:ring-primary
                    "
                  >
                    <Icon className={`size-5 ${className}`} />
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Avatar className="size-6 border">
                      <AvatarImage src={log.user?.profilePicture} />
                      <AvatarFallback>
                        {log.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <span className="font-medium text-foreground">
                      {log.user?.name || "Unknown user"}
                    </span>

                    <span className="text-[13px] font-semibold text-foreground">
                      — {ACTIVITY_TEXT[log.action]}
                    </span>
                  </div>

                  {log.details?.description && (
                    <ExpandableText
                      text={log.details.description}
                      lines={2}
                    />
                  )}

                  <span className="block text-xs text-muted-foreground">
                    {formatDateTime(log.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};