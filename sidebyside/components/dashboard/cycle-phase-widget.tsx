"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCyclePhase } from "@/lib/cycle";
import type { Profile } from "@/types/profile";

interface CyclePhaseWidgetProps {
    user: { id: string };
    userProfile: Profile | null;
    partnerProfile: Profile | null;
    cycle?: {
        last_period_start: string;
        cycle_length_days: number;
        period_length_days: number;
        sharing_mode: "private" | "share_phase_with_partner";
    } | null;
}

export function CyclePhaseWidget({
    partnerProfile,
    cycle,
}: CyclePhaseWidgetProps) {
    // pokud nemáme partnerku nebo nastavený cyklus, jen info
    if (!partnerProfile || partnerProfile.gender !== "female" || !cycle) {
        return (
            <Card className="inset-shadow-muted inset-shadow-xs bg-card border-none">
                <CardHeader>
                    <CardTitle className="text-sm">Zdraví & cyklus</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                    Až si partnerka v profilu zapne sledování cyklu, uvidíš tady
                    přehled fází.
                </CardContent>
            </Card>
        );
    }

    const phase = getCyclePhase(
        new Date(),
        new Date(cycle.last_period_start),
        cycle.cycle_length_days,
        cycle.period_length_days,
    );

    const phaseLabelMap: Record<string, string> = {
        menstruation: "Menstruace",
        follicular: "Folikulární fáze",
        ovulation: "Ovulační fáze",
        luteal: "Luteální fáze",
        pms: "PMS",
    };

    return (
        <Card className="inset-shadow-secondary inset-shadow-xs bg-secondary/10 border-none">
            <CardHeader>
                <CardTitle className="text-sm">
                    Zdraví & cyklus – aktuální fáze
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="font-semibold text-2xl">
                    {phaseLabelMap[phase] ?? "Cyklus"}
                </div>
                <p className="text-muted-foreground text-sm">
                    Tohle je orientační přehled fází jejího cyklu. Není to
                    lékařská rada.
                </p>
            </CardContent>
        </Card>
    );
}
