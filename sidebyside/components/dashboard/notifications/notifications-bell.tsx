"use client";

import { useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { NotificationsBellProps } from "@/types/notifications";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { NotificationItem } from "./notifications-item";

export function NotificationsBell({ userId }: NotificationsBellProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
    } = useNotifications(userId);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative bg-accent shadow-md border border-muted rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                >
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                        <span className="top-1 right-1 absolute flex justify-center items-center bg-primary rounded-full min-w-4 h-4 font-bold text-[10px] text-primary-foreground">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="p-1 w-dvw md:w-100" align="end">
                {/* Hlavička */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">Oznámení</h4>
                        {unreadCount > 0 && (
                            <span className="bg-primary/10 px-1.5 py-0.5 rounded-full font-medium text-primary text-xs">
                                {unreadCount} nových
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 h-7 text-xs"
                                onClick={markAllAsRead}
                            >
                                <CheckCheck className="size-3.5" />
                                Přečíst vše
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 h-7 text-destructive hover:text-destructive text-xs"
                                onClick={deleteAllNotifications}
                            >
                                <Trash2 className="size-3.5" />
                                Smazat vše
                            </Button>
                        )}
                    </div>
                </div>

                {/* Seznam */}
                <ScrollArea className="max-h-105 overflow-scroll">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col justify-center items-center gap-2 py-10 text-muted-foreground text-sm">
                            <Bell className="opacity-30 size-8" />
                            <p>Žádná nová oznámení</p>
                        </div>
                    ) : (
                        <div className={cn("divide-y")}>
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onRead={markAsRead}
                                    onDelete={deleteNotification}
                                    onClose={() => setIsOpen(false)}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
