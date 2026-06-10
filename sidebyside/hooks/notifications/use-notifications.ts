"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Notification } from "@/types/notifications";

export function useNotifications(userId: string) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(20);

            if (data) {
                setNotifications(data as Notification[]);
                setUnreadCount(data.filter((n) => !n.is_read).length);
            }
        };

        fetchNotifications();

        const channel = supabase
            .channel("realtime-notifications")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const newNotif = payload.new as Notification;
                    setNotifications((prev) => [newNotif, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, supabase]);

    const markAsRead = async (notificationId: string) => {
        const notification = notifications.find((n) => n.id === notificationId);
        if (notification?.is_read) return;

        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notificationId ? { ...n, is_read: true } : n,
            ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", notificationId)
            .eq("user_id", userId);
    };

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;

        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);

        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", userId)
            .eq("is_read", false);
    };

    const deleteNotification = async (
        e: React.MouseEvent,
        notificationId: string,
    ) => {
        e.preventDefault();
        e.stopPropagation();

        const wasUnread =
            notifications.find((n) => n.id === notificationId)?.is_read === false;

        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

        if (wasUnread) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", notificationId)
            .eq("user_id", userId);

        if (error) {
            console.error("Chyba při mazání:", error);
        }
    };

    const deleteAllNotifications = async () => {
        await supabase
            .from("notifications")
            .delete()
            .eq("user_id", userId);
        
        setNotifications([]);
        setUnreadCount(0);
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications
    };
}
