"use client";

import { Button } from "@/components/ui/button";
import { Plus, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getOrCreateInviteCode } from "@/app/actions/couple";

export default function InviteButton({
    userId,
    className,
}: {
    userId: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCopyInvite = async () => {
        setLoading(true);
        try {
            const code = await getOrCreateInviteCode(userId);
            if (!code) throw new Error("Nepodařilo se získat kód");

            const inviteLink = `${window.location.origin}/invite?code=${code}`;

            if (navigator.share) {
                await navigator.share({
                    title: "Připoj se ke mně na LoveSync",
                    text: "Plánujme spolu!",
                    url: inviteLink,
                });
            } else {
                await navigator.clipboard.writeText(inviteLink);
                toast.success("Odkaz zkopírován!", {
                    description: "Pošli ho své polovičce a začněte plánovat.",
                    duration: 3000,
                });
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            toast.error("Nepodařilo se zkopírovat odkaz.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleCopyInvite}
            disabled={loading}
            className={cn(
                "z-0 hover:z-20 flex justify-center items-center bg-secondary hover:bg-[#cf866c] shadow-sm p-0 rounded-full w-10 h-10 text-white hover:scale-105 transition-all",
                className,
            )}
            title="Pozvat partnera"
        >
            {loading ? (
                <Loader2 className="size-4 animate-spin" />
            ) : copied ? (
                <Check className="size-5" />
            ) : (
                <Plus className="size-5" />
            )}
        </Button>
    );
}
