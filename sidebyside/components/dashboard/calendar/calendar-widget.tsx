"use client";

import { useState } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AddEventDialog } from "./add-event-dialog";
import { Plus } from "lucide-react";
import ActionButton from "../../action-button";
import { useDashboardLayout } from "../../layout-provider";

import { CalendarWidgetProps } from "@/types/calendar";
import { useCalendarEvents } from "@/hooks/calendar/use-calendar-events";
import { CalendarDayCell } from "./calendar-day-cell";
import { CalendarEventItem } from "./calendar-event-item";

export function CalendarWidget({
    events = [],
    coupleId,
    relationshipStart,
    userProfile,
    partnerProfile,
}: CalendarWidgetProps) {
    const { layout } = useDashboardLayout();
    const isCalendarLayout = layout === "calendar";
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { eventsMap, handleAddEvent, handleDeleteEvent, handleUpdateEvent } =
        useCalendarEvents({
            events,
            coupleId,
            relationshipStart,
            userProfile,
            partnerProfile,
        });

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) setIsDialogOpen(true);
    };

    const selectedDateKey = date ? format(date, "yyyy-MM-dd") : null;
    const selectedDateEvents = selectedDateKey
        ? (eventsMap[selectedDateKey] ?? [])
        : [];

    return (
        <div
            suppressHydrationWarning
            className="inset-shadow-muted inset-shadow-xs flex flex-col space-y-4 bg-card shadow-lg p-2 md:p-4 pb-8 border-none rounded-xl h-full"
        >
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                locale={cs}
                className="bg-card p-0 size-full"
                classNames={{
                    month: cn(
                        "flex flex-col items-center space-y-4 w-full",
                        isCalendarLayout && "text-4xl",
                    ),
                    month_grid: "w-full border-collapse",
                    weekdays: cn("flex my-2 w-full"),
                    weekday: cn(
                        "rounded-xl w-full font-normal text-muted-foreground text-sm",
                        isCalendarLayout && "md:text-xl",
                    ),
                    week: "flex w-full mt-2",
                    day: cn(
                        "flex flex-col justify-start items-center hover:bg-transparent! p-0 size-full font-normal text-foreground transition-colors",
                        "m-0.5 sm:m-1 lg:m-2",
                        isCalendarLayout && "lg:m-4",
                        "rounded-xl!",
                    ),
                    selected: "text-foreground",
                    today: "text-primary font-bold rounded-xl",
                    outside: "text-muted-foreground opacity-50",
                    disabled: "text-muted-foreground opacity-50",
                    hidden: "invisible",
                    month_caption:
                        "flex justify-center py-1 relative items-center mb-4",
                    caption_label: cn(
                        "font-bold text-lg capitalize",
                        isCalendarLayout && "md:text-2xl",
                    ),
                }}
                formatters={{
                    formatDay: (d) => {
                        const dateKey = format(d, "yyyy-MM-dd");
                        const dayEvents = eventsMap[dateKey] ?? [];
                        return (
                            <CalendarDayCell
                                date={d}
                                dayEvents={dayEvents}
                                isCalendarLayout={isCalendarLayout}
                            />
                        ) as never;
                    },
                }}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 capitalize">
                            {date
                                ? format(date, "EEEE, d. MMMM", { locale: cs })
                                : "Události"}
                            {selectedDateEvents.length > 0 && (
                                <span className="px-2 py-0.5 border rounded-full font-normal text-muted-foreground text-xs">
                                    {selectedDateEvents.length}
                                </span>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Přehled plánů pro tento den
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {selectedDateEvents.length > 0 ? (
                            selectedDateEvents.map((event) => (
                                <CalendarEventItem
                                    key={event.id}
                                    event={event}
                                    onDelete={handleDeleteEvent}
                                    onUpdate={handleUpdateEvent}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col justify-center items-center bg-muted/50 py-8 border-2 border-dashed rounded-lg text-muted-foreground text-center">
                                <p className="text-sm">Zatím nic.</p>
                                <p className="opacity-70 text-xs">
                                    Naplánuj rande nebo výlet!
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end mt-2 pt-2 border-t">
                        <AddEventDialog
                            key={date?.toISOString() ?? "new-event"}
                            coupleId={coupleId}
                            defaultDate={date}
                            onAddEvent={handleAddEvent}
                        >
                            <ActionButton>
                                <Plus className="size-4" />
                                Naplánovat akci
                            </ActionButton>
                        </AddEventDialog>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
