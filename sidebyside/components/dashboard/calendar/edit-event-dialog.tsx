"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { updateEvent } from "@/app/actions/events";
import { CalendarItem } from "@/types/calendar";
import { EventType } from "@/lib/event-types";
import { toast } from "sonner";
import { EventForm } from "./event-form";

interface EditEventDialogProps {
    event: CalendarItem;
    onUpdate: (updated: CalendarItem) => void;
}

export function EditEventDialog({ event, onUpdate }: EditEventDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsOpen(false);

        // Optimistic update ihned
        const updated: CalendarItem = {
            ...event,
            title: formData.get("title") as string,
            location: (formData.get("location") as string) || null,
            type: formData.get("type") as string,
            start_time: new Date(
                `${formData.get("dateFrom")}T${formData.get("startTime")}`,
            ).toISOString(),
        };
        onUpdate(updated);

        const result = await updateEvent(event.id, formData);
        if (!result?.success) {
            toast.error("Nepodařilo se uložit změny.");
        } else {
            toast.success("Událost upravena.");
        }
    };

    const startDate = new Date(event.start_time);
    const endDate = event.end_time ? new Date(event.end_time) : undefined;
    const isSpecial = event.is_birthday || event.is_anniversary;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    className={`p-1 hover:text-primary ${isSpecial && "hidden"} transition-all cursor-pointer`}
                    title="Upravit událost"
                >
                    <Pencil className="size-3.5" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upravit událost</DialogTitle>
                    <DialogDescription className="sr-only">
                        Formulář pro úpravu události
                    </DialogDescription>
                </DialogHeader>
                <EventForm
                    onSubmit={handleSubmit}
                    submitLabel="Uložit změny"
                    initialValues={{
                        coupleId: event.couple_id,
                        title: event.title,
                        location: event.location ?? undefined,
                        type: (event.type as EventType) ?? "date",
                        dateRange: { from: startDate, to: endDate },
                        startTime: format(startDate, "HH:mm"),
                        endTime: endDate ? format(endDate, "HH:mm") : undefined,
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
