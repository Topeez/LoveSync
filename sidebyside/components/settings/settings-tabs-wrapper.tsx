"use client";

import { ReactNode, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useUnsavedChanges } from "@/components/unsaved-changes-context";

type SettingsTabProps = {
    defaultValue?: string;
    children: ReactNode;
};

export function SettingsTabs({
    defaultValue = "profile",
    children,
}: SettingsTabProps) {
    const [value, setValue] = useState(defaultValue);
    const { requestNavigation } = useUnsavedChanges();

    const handleTabChange = (next: string) => {
        if (next === value) return;

        requestNavigation(() => {
            setValue(next);
        });
    };

    return (
        <Tabs value={value} onValueChange={handleTabChange} className="w-full">
            {children}
        </Tabs>
    );
}
