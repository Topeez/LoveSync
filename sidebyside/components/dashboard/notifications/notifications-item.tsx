"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { NotificationItemProps } from "@/types/notifications";

export function NotificationItem({
    notification,
    onRead,
    onDelete,
    onClose,
}: NotificationItemProps) {
    const content = (
        <div
            className={cn(
                "group relative flex flex-col gap-1 hover:bg-muted/50 px-4 py-3 transition-colors cursor-pointer",
                !notification.is_read && "bg-primary/5",
            )}
            onClick={() => {
                onRead(notification.id);
                onClose();
            }}
        >
            {/* Indikátor nepřečteného */}
            {!notification.is_read && (
                <span className="top-4 left-2 absolute bg-primary rounded-full size-1.5" />
            )}

            {/* Tlačítko smazat */}
            <button
                onClick={(e) => onDelete(e, notification.id)}
                title="Smazat upozornění"
                className="top-2 right-2 absolute p-1 hover:text-destructive transition-all"
            >
                <Trash2 className="size-3.5" />
            </button>

            <div className="flex justify-between items-start gap-2 pr-5">
                <p className="font-medium text-sm leading-snug">
                    {notification.title}
                </p>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: cs,
                    })}
                </span>
            </div>

            <p className="text-muted-foreground text-xs line-clamp-2">
                {notification.message}
            </p>
        </div>
    );

    if (notification.link) {
        return <Link href={notification.link}>{content}</Link>;
    }

    return content;
}
