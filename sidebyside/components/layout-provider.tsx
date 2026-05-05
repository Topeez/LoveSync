"use client";

import * as React from "react";
import { DashboardLayoutType } from "@/types/profile";

type LayoutContextType = {
    layout: DashboardLayoutType;
    setLayout: (layout: DashboardLayoutType) => void;
};

const LayoutContext = React.createContext<LayoutContextType>({
    layout: "default",
    setLayout: () => {},
});

export function useDashboardLayout() {
    return React.useContext(LayoutContext);
}

export function DashboardLayoutProvider({
    children,
    initialLayout,
}: {
    children: React.ReactNode;
    initialLayout: DashboardLayoutType;
}) {
    const [layout, setLayout] =
        React.useState<DashboardLayoutType>(initialLayout);

    return (
        <LayoutContext.Provider value={{ layout, setLayout }}>
            {children}
        </LayoutContext.Provider>
    );
}
