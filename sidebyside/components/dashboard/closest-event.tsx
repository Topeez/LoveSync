"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Plus } from "lucide-react";
import { ClosestEventProps } from "@/types/event";
import ActionButton from "../action-button";
import dynamic from "next/dynamic";

const AddEventDialog = dynamic(
    () => import("./calendar/add-event-dialog").then((m) => m.AddEventDialog),
    { ssr: false },
);

export function ClosestEvent({
    nextEvent,
    hasCouple,
    coupleId,
}: ClosestEventProps) {
    return (
        <Card className="inset-shadow-primary/75 inset-shadow-xs col-span-12 md:col-span-8 bg-primary/15 shadow-md border-none h-full">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
                <CardTitle className="font-medium text-primary text-lg">
                    Nejbližší plán
                </CardTitle>
                <CalendarDays className="size-5 text-primary" />
            </CardHeader>
            <CardContent className="items-center">
                {nextEvent ? (
                    <>
                        <div className="mb-2 font-bold text-foreground text-3xl">
                            {nextEvent.title}
                        </div>
                        <p className="flex items-center gap-2 mb-6 text-muted-foreground capitalize">
                            {new Date(nextEvent.start_time).toLocaleDateString(
                                "cs-CZ",
                                {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    hour: "numeric",
                                    minute: "2-digit",
                                },
                            )}
                            {nextEvent.location ? (
                                <>
                                    {" "}
                                    <span className="inline-flex items-center gap-1">
                                        {" "}
                                        <MapPin className="inline-block mb-0.5 size-4 text-destructive" />
                                        {nextEvent.location}
                                    </span>
                                </>
                            ) : (
                                ""
                            )}
                        </p>
                    </>
                ) : (
                    <>
                        <div className="opacity-60 mb-2 font-bold text-foreground text-3xl">
                            {hasCouple
                                ? "Žádný plán v dohledu"
                                : "Zatím žádný plán"}
                        </div>
                        <p className="mb-6 text-muted-foreground">
                            {hasCouple
                                ? "Co takhle si něco naplánovat?"
                                : "Naplánuj si něco hezkého."}
                        </p>
                    </>
                )}

                {coupleId ? (
                    <AddEventDialog coupleId={coupleId}>
                        <ActionButton>
                            <Plus className="mr-2 size-4" /> Přidat
                        </ActionButton>
                    </AddEventDialog>
                ) : (
                    <ActionButton>
                        <Plus className="mr-2 size-4" /> Přidat
                    </ActionButton>
                )}
            </CardContent>
        </Card>
    );
}
