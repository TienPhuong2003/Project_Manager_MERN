import { fetchData } from "@/lib/fetch-util";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { ActivityLog } from "app/types";
import { ACTIVITY_TEXT } from "@/lib/activity-text";
import { getActivityIcon } from "@/helper/get-activity-icon";
import { formatDateTime } from "@/helper/format-day-time";
import { ExpandableText } from "@/components/ui/expandable-text";
import { ScrollArea } from "../ui/scroll-area";

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
    <div className="flex h-full flex-col min-w-0">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">Activity</h3>
      </div>

      {/* Scroll content */}
      <ScrollArea className="w-full max-h-105 min-h-0">
        <div className="space-y-4 py-3">
          {data.map((log, index) => {
            const { icon: Icon, className } = getActivityIcon(log);

            return (
              <div
                key={log._id}
                className="
                  group relative flex gap-3 sm:gap-4
                  rounded-md p-2 sm:p-3
                  min-w-0
                  transition-colors
                  hover:bg-muted/40
                "
              >
                {/* Timeline */}
                <div className="relative flex w-8 justify-center shrink-0 pt-1">
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
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm leading-snug">
                    <Avatar className="size-6 border">
                      <AvatarImage src={log.user?.profilePicture} />
                      <AvatarFallback>
                        {log.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <span className="font-medium text-foreground">
                      {log.user?.name || "Unknown user"}
                    </span>

                    <span className="text-[13px] font-medium italic text-muted-foreground">
                      — {ACTIVITY_TEXT[log.action]}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="flex w-60">
                    {log.details?.description && (
                      <ExpandableText
                        text={log.details.description}
                        lines={2}
                      />
                    )}
                  </div>

                  {/* Time */}
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
