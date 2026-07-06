"use client";

import { cn } from "@/lib/utils";
import { getEventColor } from "@/lib/event-types";
import { CalendarItem } from "@/types/calendar";

interface CalendarDayCellProps {
    date: Date;
    dayEvents: CalendarItem[];
    isCalendarLayout: boolean;
    cyclePhase?:
        | "menstruation"
        | "follicular"
        | "ovulation"
        | "luteal"
        | "pms"
        | null;
}

export function CalendarDayCell({
    date,
    dayEvents,
    isCalendarLayout,
    cyclePhase,
}: CalendarDayCellProps) {
    const hasEvents = dayEvents.length > 0;
    const maxDots = isCalendarLayout ? 8 : 4;

    const phaseRingClass =
        cyclePhase === "menstruation"
            ? "ring-rose-300"
            : cyclePhase === "ovulation"
              ? "ring-emerald-300"
              : cyclePhase === "pms"
                ? "ring-amber-300"
                : cyclePhase
                  ? "ring-sky-200"
                  : "";

    const phaseLabelMap: Record<string, string> = {
        menstruation: "MS",
        follicular: "FO",
        ovulation: "OV",
        luteal: "LU",
        pms: "PMS",
    };

    return (
        <div
            className={cn(
                "relative flex flex-col justify-start items-center p-2 rounded-md size-full",
                phaseRingClass && "ring-2 ring-offset-2 ring-offset-background",
                phaseRingClass,
            )}
        >
            <span
                className={cn(
                    "font-medium text-xl",
                    isCalendarLayout && "md:text-2xl",
                )}
            >
                {date.getDate()}
            </span>

            {cyclePhase && (
                <span className="hidden sm:inline bg-muted/60 mt-0.5 px-1 rounded-full font-medium text-[9px] text-muted-foreground">
                    {phaseLabelMap[cyclePhase]}
                </span>
            )}

            {hasEvents && (
                <div
                    className={cn(
                        "flex gap-1 px-1 w-full",
                        "flex-wrap justify-center content-start md:gap-1.5",
                    )}
                >
                    {dayEvents.slice(0, maxDots).map((event, i) => (
                        <div
                            key={i}
                            className={cn(
                                "shadow-sm rounded-sm size-1.5 transition-all shrink-0",
                                "md:size-2 md:rounded-full ",
                                event.isOptimistic && "opacity-50",
                            )}
                            style={{
                                backgroundColor: event.is_birthday
                                    ? "#FFD700"
                                    : event.is_anniversary
                                      ? "#FF4D6D"
                                      : getEventColor(event.type ?? undefined),
                            }}
                            title={event.title}
                        />
                    ))}

                    {dayEvents.length > maxDots && (
                        <div
                            className={cn(
                                "bg-muted-foreground/30 rounded-sm size-1 shrink-0",
                                "md:size-2 md:rounded-full",
                            )}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
