"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getCyclePhase } from "@/lib/cycle";
import type { CyclePhase } from "@/lib/cycle";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/profile";
import {
    MoonStar,
    Sprout,
    Sparkles,
    CloudSun,
    CloudLightning,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

type PhaseConfig = {
    label: string;
    Icon: LucideIcon;
    description: string;
    tip: string;
    bgClass: string;
    textClass: string;
    dotClass: string;
    borderClass: string;
};

const phaseConfig: Record<CyclePhase, PhaseConfig> = {
    menstruation: {
        label: "Menstruace",
        Icon: MoonStar,
        description: "Čas na klid a odpočinek. Tělo pracuje tvrdě.",
        tip: "Dnes by ocenila teplo, pohodu a třeba horkou čokoládu místo rande venku.",
        bgClass: "bg-rose-500/10",
        textClass: "text-rose-400",
        dotClass: "bg-rose-400",
        borderClass: "inset-shadow-rose-500/50",
    },
    follicular: {
        label: "Folikulární fáze",
        Icon: Sprout,
        description: "Energie se vrací. Nálada stoupá, kreativita kypí.",
        tip: "Skvělý čas plánovat společné výlety nebo nové zážitky – bude plná elánu.",
        bgClass: "bg-sky-500/10",
        textClass: "text-sky-400",
        dotClass: "bg-sky-400",
        borderClass: "inset-shadow-sky-400/50",
    },
    ovulation: {
        label: "Ovulační fáze",
        Icon: Sparkles,
        description: "Vrchol energie a nálady. Cítí se skvěle.",
        tip: "Ideální čas na rande, nový zážitek nebo prostě jen být spolu – je v top formě.",
        bgClass: "bg-emerald-500/10",
        textClass: "text-emerald-400",
        dotClass: "bg-emerald-400",
        borderClass: "inset-shadow-emerald-400/50",
    },
    luteal: {
        label: "Luteální fáze",
        Icon: CloudSun,
        description: "Pomalejší tempo. Potřeba více klidu a bezpečí.",
        tip: "Víc poslouchej, míň plánuj velké věci. Fungují útulné večery doma.",
        bgClass: "bg-amber-500/10",
        textClass: "text-amber-400",
        dotClass: "bg-amber-400",
        borderClass: "inset-shadow-amber-400/50",
    },
    pms: {
        label: "PMS",
        Icon: CloudLightning,
        description: "Emoce na vlnách. Tělo se připravuje na nový cyklus.",
        tip: "Buď trpělivý, netlač, nebav se o zbytečnostech. Objetí > debata.",
        bgClass: "bg-purple-500/10",
        textClass: "text-purple-400",
        dotClass: "bg-purple-400",
        borderClass: "inset-shadow-purple-400/50",
    },
};

function getDaysUntilNextPeriod(
    today: Date,
    lastPeriodStart: Date,
    cycleLength: number,
): number {
    const diffDays = Math.floor(
        (today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24),
    );
    const dayIndex = ((diffDays % cycleLength) + cycleLength) % cycleLength;
    return cycleLength - dayIndex;
}

export function CyclePhaseWidget({
    partnerProfile,
    cycle,
}: CyclePhaseWidgetProps) {
    if (!partnerProfile || partnerProfile.gender !== "female" || !cycle) {
        return (
            <Card className="inset-shadow-muted inset-shadow-xs bg-card border-none">
                <CardContent className="flex items-center gap-4 py-6">
                    <div>
                        <p className="font-medium text-sm">Cyklus partnerky</p>
                        <p className="mt-0.5 text-muted-foreground text-xs">
                            Až si partnerka v profilu nastaví sledování cyklu a
                            zapne sdílení, uvidíš tady přehled – jak ji lépe
                            rozumět každý den.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const today = new Date();
    const phase = getCyclePhase(
        today,
        new Date(cycle.last_period_start),
        cycle.cycle_length_days,
        cycle.period_length_days,
    );

    const config = phaseConfig[phase];
    const Icon = config.Icon;
    const daysUntilNext = getDaysUntilNextPeriod(
        today,
        new Date(cycle.last_period_start),
        cycle.cycle_length_days,
    );

    const partnerName =
        partnerProfile.nickname ||
        partnerProfile.full_name?.split(" ")[0] ||
        "Partnerka";

    return (
        <Card
            className={cn(
                "inset-shadow-xs border-none",
                config.bgClass,
                config.borderClass,
            )}
        >
            <CardContent className="px-6 py-5">
                <div className="flex sm:flex-row flex-col sm:items-center gap-4">
                    {/* Fáze */}
                    <div className="flex items-center gap-3 sm:min-w-52">
                        <Icon className={`size-7 ${config.textClass}`} />
                        <div>
                            <p className="mb-0.5 text-muted-foreground text-xs">
                                {partnerName} je teď v
                            </p>
                            <p
                                className={`font-bold text-lg leading-tight ${config.textClass}`}
                            >
                                {config.label}
                            </p>
                            <p className="mt-0.5 text-muted-foreground text-xs">
                                {config.description}
                            </p>
                        </div>
                    </div>

                    {/* Oddělovač */}
                    <div className="hidden sm:block self-stretch bg-border/50 w-px" />

                    {/* Tip pro partnera */}
                    <div className="flex-1 space-y-1">
                        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                            Tip pro tebe
                        </p>
                        <p className="text-sm">{config.tip}</p>
                    </div>

                    {/* Odpočet */}
                    <div className="hidden md:flex flex-col justify-center items-center min-w-20 text-center">
                        <div
                            className={`text-3xl font-bold leading-none ${config.textClass}`}
                        >
                            {daysUntilNext}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs leading-tight">
                            dní do dalšího cyklu
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
