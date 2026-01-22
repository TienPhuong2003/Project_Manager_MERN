import type { User } from "app/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Watchers = ({ watchers }: { watchers: User[] }) => {
  return (
    <div className="space-y-1">
      {/* Header */}
      <h3 className="text-sm font-medium text-muted-foreground">Watchers</h3>
      {/* Avatars */}
      <div className="flex items-center -space-x-2">
        {watchers && watchers.length > 0 ? (
          watchers.slice(0, 5).map((watcher) => (
            <Avatar
              key={watcher._id}
              className="size-7 border-2 border-background"
            >
              <AvatarImage src={watcher.profilePicture} />
              <AvatarFallback>{watcher.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">No Watcher</p>
        )}

        {watchers.length > 5 && (
          <div className="size-7 rounded-full bg-muted text-xs font-medium flex items-center justify-center border-2 border-background">
            +{watchers.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};
