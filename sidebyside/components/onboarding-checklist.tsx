"use client";

import Link from "next/link";
import { CheckCircle2, Circle, PartyPopper } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProfileData } from "@/types/profile";
import InviteButton from "./dashboard/invite-button";
import { useMemo } from "react";

interface OnboardingChecklistProps {
    userProfile: ProfileData;
    eventsCount: number;
    hasActiveCouple: boolean;
}

export function OnboardingChecklist({
    userProfile,
    eventsCount,
    hasActiveCouple,
}: OnboardingChecklistProps) {
    const steps = useMemo(
        () => [
            {
                id: "account",
                label: "Vytvořit účet",
                description: "Jsi členem SideBySide",
                done: true,
                action: null,
            },
            {
                id: "profile",
                label: "Vylepšit profil",
                description: "Přidej si přezdívku nebo fotku",
                done: !!(userProfile.nickname || userProfile.avatar_url),
                action: (
                    <Link
                        href={`/dashboard/profile/${userProfile.id}`}
                        className="bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full font-medium text-primary text-xs whitespace-nowrap transition-colors"
                    >
                        Upravit profil
                    </Link>
                ),
            },
            {
                id: "partner",
                label: "Pozvat polovičku",
                description: "Ve dvou se to lépe táhne",
                done: hasActiveCouple,
                action: <InviteButton userId={userProfile.id} />,
            },
            {
                id: "event",
                label: "Naplánovat první rande",
                description: "Přidej něco do kalendáře",
                done: eventsCount > 0,
                action: (
                    <Link
                        href="/dashboard/"
                        className="bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full font-medium text-primary text-xs whitespace-nowrap transition-colors"
                    >
                        Naplánovat akci
                    </Link>
                ),
            },
        ],
        [userProfile, eventsCount, hasActiveCouple],
    );

    const completedSteps = steps.filter((s) => s.done).length;
    const progress = (completedSteps / steps.length) * 100;

    if (progress === 100) return null;

    return (
        <Card className="inset-shadow-muted inset-shadow-xs shadow-md border-none">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            Vítej na palubě!{" "}
                            <PartyPopper className="size-5 text-yellow-500" />
                        </CardTitle>
                        <CardDescription>
                            Pár kroků, abys využil aplikaci naplno.
                        </CardDescription>
                    </div>
                    <span className="font-bold text-primary text-sm">
                        {completedSteps} z {steps.length}
                    </span>
                </div>
                <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-1">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={cn(
                            "flex justify-between items-center p-3 rounded-lg transition-all",
                            step.done
                                ? "bg-muted/30"
                                : "bg-card border hover:border-primary/50",
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {step.done ? (
                                <CheckCircle2 className="size-6 text-green-500 shrink-0" />
                            ) : (
                                <Circle className="size-6 text-muted-foreground shrink-0" />
                            )}
                            <div className="flex flex-col">
                                <span
                                    className={cn(
                                        "font-medium text-sm",
                                        step.done &&
                                            "text-muted-foreground line-through decoration-muted-foreground/50",
                                    )}
                                >
                                    {step.label}
                                </span>
                                {!step.done && (
                                    <span className="text-muted-foreground text-xs">
                                        {step.description}
                                    </span>
                                )}
                            </div>
                        </div>

                        {!step.done && step.action}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
