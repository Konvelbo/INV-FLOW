"use client";

import {
  BellIcon,
  Trash2,
  X,
  Clock,
  Info,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { useNotifications } from "@/src/context/NotificationContext";
import { cn } from "@/lib/utils";

export default function NotificationMenu() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();

  const getIcon = (type?: string) => {
    switch (type) {
      case "reminder":
        return <Clock className="size-3.5 text-amber-500" />;
      case "invoice":
        return <FileText className="size-3.5 text-blue-500" />;
      case "system":
        return <Info className="size-3.5 text-primary" />;
      default:
        return <BellIcon className="size-3.5 text-muted-foreground" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Open notifications"
          className="relative size-10 rounded-xl text-muted-foreground shadow-none hover:bg-muted/50 transition-all border border-transparent hover:border-border/50"
          size="icon"
          variant="ghost"
        >
          <BellIcon aria-hidden="true" size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2.5 bg-primary border-2 border-background"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden"
        align="end"
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm tracking-tight text-foreground/90">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                {unreadCount} Nouvelles
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                onClick={markAllAsRead}
              >
                Tout lire
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 size-7 p-0 text-muted-foreground hover:text-rose-500 transition-colors"
                onClick={clearAllNotifications}
                title="Tout effacer"
              >
                <Trash2 size={13} />
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-[350px] overflow-y-auto scrollbar-none">
          {notifications.length === 0 ? (
            <div className="px-6 py-10 text-center space-y-3">
              <div className="mx-auto size-10 rounded-full bg-muted/30 flex items-center justify-center">
                <BellIcon className="size-5 text-muted-foreground/40" />
              </div>
              <p className="text-xs font-medium text-muted-foreground italic">
                Aucune notification pour le moment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/20">
              {notifications.map((notification) => (
                <div
                  className={cn(
                    "relative group px-4 py-3 transition-all hover:bg-muted/30",
                    notification.unread && "bg-primary/5",
                  )}
                  key={notification.id}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="size-7 rounded-lg bg-background border flex items-center justify-center shadow-sm">
                        {getIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          className="text-left text-xs leading-relaxed"
                          onClick={() => markAsRead(notification.id)}
                          type="button"
                        >
                          <span className="font-extrabold text-foreground tracking-tight">
                            {notification.user}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {notification.action}
                          </span>{" "}
                          <span className="font-bold text-primary">
                            {notification.target}
                          </span>
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-5 h-5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X size={10} />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-medium opacity-60">
                          {notification.timestamp}
                        </span>
                        {notification.unread && (
                          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
