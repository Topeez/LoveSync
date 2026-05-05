"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createEvent } from "@/app/actions/events";
import ActionButton from "../../action-button";
import { toast } from "sonner";
import { EventForm } from "./event-form";

export interface AddEventDialogProps {
    coupleId: string;
    defaultDate?: Date;
    children?: React.ReactNode;
    onAddEvent?: (formData: FormData) => Promise<void>;
}

export function AddEventDialog({
    coupleId,
    defaultDate,
    children,
    onAddEvent,
}: AddEventDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        if (!formData.get("dateFrom")) {
            toast.error("Vyberte prosím datum.");
            return;
        }
        setIsOpen(false);

        const promise = onAddEvent
            ? onAddEvent(formData)
            : createEvent(formData);
        toast.promise(promise, {
            loading: "Ukládám událost…",
            success: "Událost vytvořena.",
            error: "Nepodařilo se vytvořit událost.",
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <ActionButton>
                        <Plus className="size-4" />
                    </ActionButton>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nová událost</DialogTitle>
                </DialogHeader>
                <EventForm
                    onSubmit={handleSubmit}
                    submitLabel="Přidat událost"
                    initialValues={{
                        coupleId,
                        dateRange: defaultDate
                            ? { from: defaultDate, to: undefined }
                            : undefined,
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
