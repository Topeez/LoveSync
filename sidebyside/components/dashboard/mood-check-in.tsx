"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { updateMood } from "@/app/actions/couple";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MoodCheckInProps } from "@/types/mood";
import { Smile } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ActionButton from "../action-button";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

const MOODS = [
    { emoji: "🥰", label: "Zamilovaně" },
    { emoji: "😁", label: "Skvěle" },
    { emoji: "😀", label: "Dobře" },
    { emoji: "😐", label: "Ujde to" },
    { emoji: "😔", label: "Smutně" },
    { emoji: "😤", label: "Naštvaně" },
    { emoji: "😴", label: "Unaveně" },
    { emoji: "😰", label: "Stresově" },
];

function isTodayMood(updatedAt: string | null): boolean {
    if (!updatedAt) return false;
    return new Date(updatedAt).toDateString() === new Date().toDateString();
}

type CoupleRow = {
    id: string;
    user1_id: string;
    user2_id: string | null;
    user1_mood: string | null;
    user2_mood: string | null;
    user1_mood_updated_at: string | null;
    user2_mood_updated_at: string | null;
};

export function MoodCheckIn({
    myMood,
    myMoodUpdatedAt,
    partnerMood,
    partnerMoodUpdatedAt,
    myNickname,
    partnerNickname,
    myAvatar,
    partnerAvatar,
    coupleId,
    currentUserId,
    compact = false,
}: MoodCheckInProps) {
    const [currentMood, setCurrentMood] = useState<string | null>(() =>
        isTodayMood(myMoodUpdatedAt) ? myMood : null,
    );
    const [partnerMoodState, setPartnerMoodState] = useState<string | null>(
        () => (isTodayMood(partnerMoodUpdatedAt) ? partnerMood : null),
    );
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        const channel = supabase
            .channel(`couple-mood-${coupleId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "couples",
                    filter: `id=eq.${coupleId}`,
                },
                (payload: RealtimePostgresChangesPayload<CoupleRow>) => {
                    const newRow =
                        (payload.new as CoupleRow | null) ?? undefined;
                    if (!newRow) return;

                    const isUser1 = newRow.user1_id === currentUserId;

                    const myMoodValue = isUser1
                        ? newRow.user1_mood
                        : newRow.user2_mood;
                    const myMoodUpdatedAtValue = isUser1
                        ? newRow.user1_mood_updated_at
                        : newRow.user2_mood_updated_at;

                    const partnerMoodValue = isUser1
                        ? newRow.user2_mood
                        : newRow.user1_mood;
                    const partnerMoodUpdatedAtValue = isUser1
                        ? newRow.user2_mood_updated_at
                        : newRow.user1_mood_updated_at;

                    if (isTodayMood(myMoodUpdatedAtValue)) {
                        setCurrentMood(myMoodValue);
                    } else {
                        setCurrentMood(null);
                    }

                    if (isTodayMood(partnerMoodUpdatedAtValue)) {
                        setPartnerMoodState(partnerMoodValue);
                    } else {
                        setPartnerMoodState(null);
                    }
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [coupleId, currentUserId]);

    const handleSelect = async (emoji: string) => {
        setIsLoading(true);
        setCurrentMood(emoji);
        setOpen(false);

        const result = await updateMood(emoji);

        setIsLoading(false);
        if (!result?.success) {
            setCurrentMood(null);
            toast.error("Nepodařilo se uložit náladu.");
            return;
        }

        toast.success("Nálada sdílena!");
    };

    return (
        <div className="flex items-center gap-3">
            {/* Partner */}
            {!compact && (
                <>
                    <div className="flex items-center gap-1.5">
                        <Avatar className="size-7">
                            <AvatarImage src={partnerAvatar ?? undefined} />
                            <AvatarFallback className="text-xs">
                                {partnerNickname[0]}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-lg leading-none">
                            {partnerMoodState ?? (
                                <span className="text-muted-foreground text-xs">
                                    –
                                </span>
                            )}
                        </span>
                    </div>
                </>
            )}

            {/* Divider */}
            <Separator
                orientation="vertical"
                className="hidden sm:inline bg-muted-foreground/40 select-none"
            />

            {/* Já — trigger dialogu */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button
                        disabled={isLoading}
                        title="Jak se dnes cítíš?"
                        className={cn(
                            "flex items-center gap-1.5 px-2 py-1 rounded-full",
                            "hover:bg-muted transition-colors cursor-pointer",
                            "disabled:opacity-50",
                        )}
                    >
                        <Avatar className="size-7">
                            <AvatarImage src={myAvatar ?? undefined} />
                            <AvatarFallback className="text-xs">
                                {myNickname[0]}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-lg leading-none">
                            {currentMood ?? (
                                <Smile className="size-4 text-muted-foreground" />
                            )}
                        </span>
                    </button>
                </DialogTrigger>

                <DialogContent className="max-w-xs" aria-describedby="mood">
                    <DialogHeader>
                        <DialogTitle>Jak se dnes cítíš?</DialogTitle>
                        <DialogDescription>
                            Vyber, jak se dnes cítíš. Uvidíte to jen vy dva.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Partner mood v dialogu — viditelné i na mobilu */}
                    <div className="flex items-center gap-2 bg-muted/40 px-3 py-2 rounded-lg text-sm">
                        <Avatar className="size-6">
                            <AvatarImage src={partnerAvatar ?? undefined} />
                            <AvatarFallback className="text-xs">
                                {partnerNickname[0]}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">
                            {partnerNickname.split(" ")[0]}:
                        </span>
                        <span className="text-lg">
                            {partnerMoodState ?? (
                                <span className="text-muted-foreground text-xs italic">
                                    ještě nesdílel/a
                                </span>
                            )}
                        </span>
                    </div>

                    <div className="gap-2 grid grid-cols-4 pt-2">
                        {MOODS.map((mood) => (
                            <button
                                key={mood.emoji}
                                onClick={() => handleSelect(mood.emoji)}
                                disabled={isLoading}
                                aria-label={mood.label}
                                className={cn(
                                    "flex flex-col justify-center items-center gap-2 hover:bg-muted p-4 border rounded-md text-lg transition-all",
                                    currentMood === mood.emoji
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-muted text-muted-foreground",
                                )}
                            >
                                {mood.emoji}
                                <span className="text-muted-foreground text-xs">
                                    {mood.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {currentMood && (
                        <ActionButton
                            onClick={() => {
                                setCurrentMood(null);
                                setOpen(false);
                            }}
                            className="inset-shadow-black bg-destructive hover:bg-red-500 mt-2 w-full text-sm text-center"
                        >
                            Vymazat náladu
                        </ActionButton>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
