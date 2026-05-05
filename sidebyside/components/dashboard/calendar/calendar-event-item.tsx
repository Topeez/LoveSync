"use client";

import { cn } from "@/lib/utils";
import { MapPin, Gift, Trash2, Heart } from "lucide-react";
import { getEventColor, getEventLabel } from "@/lib/event-types";
import { CalendarItem } from "@/types/calendar";
import { EditEventDialog } from "@/components/dashboard/calendar/edit-event-dialog";

interface CalendarEventItemProps {
    event: CalendarItem;
    onDelete: (id: string) => void;
    onUpdate: (updated: CalendarItem) => void;
}

export function CalendarEventItem({
    event,
    onDelete,
    onUpdate,
}: CalendarEventItemProps) {
    const start = new Date(event.start_time).toLocaleTimeString("cs-CZ", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const end = event.end_time
        ? new Date(event.end_time).toLocaleTimeString("cs-CZ", {
              hour: "2-digit",
              minute: "2-digit",
          })
        : null;

    const label = event.is_birthday
        ? "Narozeniny"
        : event.is_anniversary
          ? "Výročí"
          : getEventLabel(event.type ?? undefined);

    const leftColor = event.is_birthday
        ? "#FFD700"
        : event.is_anniversary
          ? "#FF4D6D"
          : getEventColor(event.type ?? undefined);

    const isSpecial = event.is_birthday || event.is_anniversary;

    return (
        <div
            className={cn(
                "group flex flex-col gap-1 hover:bg-muted/50 p-3 border rounded-lg transition-all",
                event.isOptimistic && "opacity-60 grayscale-[0.5]",
            )}
            style={{ borderLeft: `4px solid ${leftColor}` }}
        >
            <div className="flex justify-between items-center">
                <h3 className="font-semibold group-hover:text-primary text-sm transition-colors">
                    {event.title}
                </h3>

                <span className="block mb-1 font-bold text-muted-foreground text-xs uppercase tracking-wider">
                    {label}
                </span>

                <span className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] text-muted-foreground">
                    {isSpecial
                        ? "CELÝ DEN"
                        : `${start}${end ? ` - ${end}` : ""}`}
                </span>

                <div className="flex items-center gap-2">
                    <EditEventDialog event={event} onUpdate={onUpdate} />

                    <Trash2
                        className={cn(
                            "size-4 hover:text-destructive transition-colors cursor-pointer",
                            (event.isOptimistic || isSpecial) && "invisible",
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isSpecial) onDelete(event.id);
                        }}
                    />
                </div>
            </div>

            {event.description && (
                <p className="text-muted-foreground text-xs line-clamp-1">
                    {event.description}
                </p>
            )}

            <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs">
                {event.location && (
                    <>
                        <MapPin className="size-3" /> {event.location}
                    </>
                )}
                {event.is_birthday && (
                    <Gift className="size-3 text-yellow-600" />
                )}
                {event.is_anniversary && (
                    <Heart className="size-3 text-rose-500" />
                )}
            </div>
        </div>
    );
}
