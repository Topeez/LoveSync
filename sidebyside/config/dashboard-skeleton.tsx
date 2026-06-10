import { layoutConfig } from "./dashboard-layouts";
import { ReactNode } from "react";
import { DashboardLayoutType } from "@/types/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";

export type SkeletonCardConfig = {
    colSpan?: string;
    height?: string;
    hasHeader?: boolean;
    hasFooter?: boolean;
    contentLines?: number;
    customContent?: ReactNode;
};

export function getDashboardSkeleton(
    layout: DashboardLayoutType,
): SkeletonCardConfig[] {
    const cfg = layoutConfig[layout] ?? layoutConfig.default;

    return [
        {
            colSpan: cfg.closestEvent,
            height: "h-full",
            hasHeader: true,
            hasFooter: true,
            contentLines: 2,
        },
        {
            colSpan: cfg.loveNote,
            height: "h-full",
            hasHeader: true,
            customContent: (
                <div className="flex flex-col justify-center items-start h-full">
                    <Skeleton className="w-52 h-6" />
                </div>
            ),
        },
        {
            colSpan: cfg.todo,
            height: "h-full",
            hasHeader: true,
            hasFooter: true,
            contentLines: 4,
        },
        {
            colSpan: cfg.calendar,
            height: "h-full",
            customContent: (
                <>
                    <div className="flex justify-between items-center mb-4 px-2 w-full">
                        <Skeleton className="rounded-md size-8" />
                        <Skeleton className="rounded-md w-32 h-6" />
                        <Skeleton className="rounded-md size-8" />
                    </div>

                    <div className="gap-4 grid grid-cols-7 mb-4 w-full">
                        {[...Array(7)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="opacity-50 rounded-sm w-full h-6"
                            />
                        ))}
                    </div>

                    <div className="gap-4 grid grid-cols-7 w-full">
                        {[...Array(35)].map((_, i) => (
                            <div
                                key={i}
                                className="flex justify-center items-center h-8"
                            >
                                <Skeleton className="rounded-md size-8" />
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            colSpan: cfg.profile,
            height: "h-full",
            hasHeader: true,
            hasFooter: true,
            customContent: (
                <div className="flex justify-between items-center pt-8">
                    {/* levý avatar */}
                    <div className="flex flex-col items-center gap-2">
                        <Skeleton className="border-2 border-background rounded-full w-14 h-14" />
                        <div className="w-16 h-3" />
                    </div>

                    {/* střed – srdce + číslo */}
                    <div className="relative flex justify-center items-center min-w-32 h-32">
                        <Heart
                            className="absolute text-muted animate-pulse"
                            size={200}
                            strokeWidth={1}
                        />
                        <div className="z-10 relative flex flex-col justify-center items-center pb-2 animate-pulse">
                            <Skeleton className="mb-2 rounded-md w-12 h-8" />
                        </div>
                    </div>

                    {/* pravý avatar */}
                    <div className="flex flex-col items-center gap-2">
                        <Skeleton className="border-2 border-background rounded-full size-14" />
                        <Skeleton className="rounded-md w-24 h-3" />
                    </div>
                </div>
            ),
        },
    ];
}
