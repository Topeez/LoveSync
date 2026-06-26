"use client";

import { UserPlus, Link2, Palette, CalendarHeart, Heart } from "lucide-react";
import { useRef } from "react";
import {
    m,
    LazyMotion,
    domAnimation,
    useScroll,
    useTransform,
    MotionValue,
} from "framer-motion";

const steps = [
    {
        title: "Vytvořte si účet",
        description:
            "Zaregistrujte se během pár vteřin pomocí Google účtu. Vše je zdarma a bezpečné.",
        icon: UserPlus,
    },
    {
        title: "Pozvěte svou polovičku",
        description:
            "Získáte unikátní párovací kód. Pošlete ho partnerovi/partnerce a jakmile ho zadá, vaše světy se propojí.",
        icon: Link2,
    },
    {
        title: "Přizpůsobte si profil",
        description:
            "Nahrajte společnou fotku na pozadí, vyplňte detaily jako velikosti oblečení (pro dárky!) nebo jazyk lásky.",
        icon: Palette,
    },
    {
        title: "Nastavte výročí",
        description:
            "Zadejte datum začátku vztahu. Aplikace vypočítá váš společný 'Level' a začne odpočítávat dny do dalšího výročí.",
        icon: CalendarHeart,
    },
    {
        title: "Plánujte a sdílejte",
        description:
            "Začněte plnit společný kalendář, přidávat sny do Bucket Listu nebo si jen pošlete zamilovaný vzkaz přes Love Notes.",
        icon: Heart,
    },
];

function TimelineIcon({
    icon: Icon,
    index,
    total,
    scrollYProgress,
}: {
    icon: React.ElementType;
    index: number;
    total: number;
    scrollYProgress: MotionValue<number>;
}) {
    const stepProgress = index / (total - 1);

    const scale = useTransform(
        scrollYProgress,
        [stepProgress - 0.08, stepProgress, stepProgress + 0.08],
        [1, 1.15, 1],
    );

    return (
        <m.div
            className="top-0 left-4 md:left-8 z-10 absolute flex justify-center items-center bg-secondary shadow-sm border-4 border-background rounded-full size-10 md:size-12 text-primary-foreground -translate-x-1/2 will-change-transform"
            style={{ scale }}
        >
            <Icon className="size-5 md:size-6 text-button-text" />
        </m.div>
    );
}

export default function HowItWorks() {
    const timelineRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 70%", "end center"],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div className="mx-auto px-6 py-12 md:py-24 max-w-2xl">
            <div className="mb-12 text-center">
                <h2 className="font-bold text-3xl md:text-4xl tracking-tight">
                    Jak začít se LoveSync?
                </h2>
                <p className="mt-4 text-muted-foreground text-lg">
                    Pět jednoduchých kroků k lepší organizaci vašeho vztahu.
                </p>
            </div>

            <LazyMotion features={domAnimation}>
                <div ref={timelineRef} className="relative ml-4 md:ml-0">
                    <div className="left-4 md:left-8 absolute inset-y-0 bg-primary/20 w-0.5" />

                    <m.div
                        className="top-0 left-4 md:left-8 z-0 absolute bg-primary w-0.5"
                        style={{ height: lineHeight, willChange: "height" }}
                    />

                    {steps.map(({ title, description, icon }, index) => (
                        <div
                            className="relative pb-12 last:pb-0 pl-16"
                            key={index}
                        >
                            <TimelineIcon
                                icon={icon}
                                index={index}
                                total={steps.length}
                                scrollYProgress={scrollYProgress}
                            />

                            <div className="space-y-3 pt-1">
                                <span className="font-bold text-primary-foreground dark:text-primary text-sm uppercase tracking-wider">
                                    Krok {index + 1}
                                </span>
                                <h3 className="font-bold text-foreground text-2xl tracking-tight">
                                    {title}
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </LazyMotion>
        </div>
    );
}
