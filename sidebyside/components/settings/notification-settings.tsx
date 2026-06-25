"use client";

import { useState } from "react";
import { PushNotificationManager } from "@/components/push-notification-manager";
import { NotificationPreferences } from "@/components/settings/notification-preferences";

interface NotificationSettingsProps {
    initialPrefs: Record<string, boolean>;
}

export function NotificationSettings({
    initialPrefs,
}: NotificationSettingsProps) {
    const [isPushEnabled, setIsPushEnabled] = useState(false);

    return (
        <div className="space-y-4">
            <PushNotificationManager onSubscriptionChange={setIsPushEnabled} />

            <div className="pt-4 border-t">
                <p className="mb-3 font-medium text-sm">Typy oznámení</p>
                <NotificationPreferences
                    initialPrefs={initialPrefs}
                    disabled={!isPushEnabled}
                />
            </div>
        </div>
    );
}
