"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, MapPin, CalendarIcon } from "lucide-react";
import { EVENT_TYPES, EventType } from "@/lib/event-types";
import { cn } from "@/lib/utils";
import ActionButton from "../../action-button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { DateRange } from "react-day-picker";

export interface EventFormInitialValues {
    title?: string;
    location?: string;
    type?: EventType;
    dateRange?: DateRange;
    startTime?: string;
    endTime?: string;
    coupleId: string;
}

interface EventFormProps {
    initialValues: EventFormInitialValues;
    onSubmit: (formData: FormData) => Promise<void>;
    submitLabel?: string;
}

export function EventForm({
    initialValues,
    onSubmit,
    submitLabel = "Uložit",
}: EventFormProps) {
    const [location, setLocation] = useState(initialValues.location ?? "");
    const [selectedType, setSelectedType] = useState<EventType>(
        initialValues.type ?? "date",
    );
    const [date, setDate] = useState<DateRange | undefined>(
        initialValues.dateRange,
    );

    const handleOpenChange = (open: boolean) => {
        if (open && !date) {
            setDate({ from: new Date(), to: undefined });
        }
    };

    const iconClasses =
        "top-2.5 left-2.5 absolute size-4 text-muted-foreground";

    return (
        <form action={onSubmit} className="space-y-4 pt-4">
            <input
                type="hidden"
                name="coupleId"
                value={initialValues.coupleId}
            />
            <input type="hidden" name="type" value={selectedType} />
            <input
                type="hidden"
                name="dateFrom"
                value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
            />
            <input
                type="hidden"
                name="dateTo"
                value={
                    date?.to
                        ? format(date.to, "yyyy-MM-dd")
                        : date?.from
                          ? format(date.from, "yyyy-MM-dd")
                          : ""
                }
            />

            {/* Datum */}
            <div className="space-y-1">
                <Label>Kdy?</Label>
                <Popover onOpenChange={handleOpenChange}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className={cn(
                                "justify-center w-full font-normal text-center",
                                !date && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="mr-2 size-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "dd.MM.yyyy", {
                                            locale: cs,
                                        })}
                                        {" - "}
                                        {format(date.to, "dd.MM.yyyy", {
                                            locale: cs,
                                        })}
                                    </>
                                ) : (
                                    format(date.from, "dd.MM.yyyy", {
                                        locale: cs,
                                    })
                                )
                            ) : (
                                <span>Vyberte datum</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="center">
                        <Calendar
                            autoFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            locale={cs}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Název */}
            <div className="space-y-1">
                <Label htmlFor="title">Co podniknete?</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="Večeře, Kino..."
                    defaultValue={initialValues.title}
                    required
                    autoFocus
                />
            </div>

            {/* Čas */}
            <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                    <Label htmlFor="startTime">Začátek</Label>
                    <div className="relative">
                        <Clock className={iconClasses} />
                        <Input
                            id="startTime"
                            name="startTime"
                            type="time"
                            className="pl-9"
                            defaultValue={initialValues.startTime ?? "18:00"}
                            required
                        />
                    </div>
                </div>
                <div className="flex-1 space-y-1">
                    <Label htmlFor="endTime">Konec</Label>
                    <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        defaultValue={initialValues.endTime}
                    />
                </div>
            </div>

            {/* Lokace */}
            <div className="space-y-1">
                <Label htmlFor="location">Kde?</Label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <MapPin className={iconClasses} />
                        <Input
                            id="location"
                            name="location"
                            placeholder="Místo..."
                            className="pl-9"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    {location && (
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                window.open(
                                    `https://maps.google.com/?q=${location}`,
                                    "_blank",
                                )
                            }
                        >
                            <MapPin className="size-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Typ akce */}
            <div className="space-y-3">
                <Label>Typ akce</Label>
                <div className="gap-2 grid grid-cols-3">
                    {Object.entries(EVENT_TYPES).map(([key, config]) => {
                        const isSelected = selectedType === key;
                        const Icon = config.icon;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() =>
                                    setSelectedType(key as EventType)
                                }
                                className={cn(
                                    "flex flex-col justify-center items-center gap-2 hover:bg-muted p-4 border rounded-md transition-all",
                                    isSelected
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-muted text-muted-foreground",
                                )}
                            >
                                <Icon
                                    className="size-5"
                                    style={{
                                        color: isSelected
                                            ? "currentColor"
                                            : config.color,
                                    }}
                                />
                                <span className="font-medium text-xs">
                                    {config.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <ActionButton type="submit" className="w-full">
                {submitLabel}
            </ActionButton>
        </form>
    );
}
