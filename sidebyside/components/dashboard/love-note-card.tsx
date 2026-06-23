"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition, useRef } from "react";
import { updateLoveNote } from "@/app/actions/update-note";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ActionButton from "../action-button";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface LoveNoteCardProps {
    initialNote: string;
    coupleId: string;
    authorId: string;
    currentUserId: string;
}

type CoupleRow = {
    id: string;
    love_note: string | null;
    love_note_author_id: string | null;
    love_note_updated_at: string | null;
};

export function LoveNoteCard({
    initialNote,
    coupleId,
    authorId,
    currentUserId,
}: LoveNoteCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [note, setNote] = useState(initialNote);
    const [authorIdState, setAuthorIdState] = useState(authorId);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const focusParam = searchParams.get("focus");

    const isMyNote = authorIdState === currentUserId;
    const isEmpty = !note || note.trim().length === 0;

    // Fokus z onboardingu – bez sync setState v těle efektu
    useEffect(() => {
        if (focusParam !== "love-note") return;

        const id = setTimeout(() => {
            // přepneme do edit modu (asynchronně)
            setIsEditing(true);

            textareaRef.current?.focus();
            textareaRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            // vyčistit query param, aby se efekt znovu netriggeroval
            const params = new URLSearchParams(searchParams.toString());
            params.delete("focus");

            const nextUrl =
                params.toString().length > 0
                    ? `${pathname}?${params.toString()}`
                    : pathname;

            router.replace(nextUrl, { scroll: false });
        }, 50);

        return () => clearTimeout(id);
    }, [focusParam, pathname, router, searchParams]);

    // Realtime update – type-safe payload
    useEffect(() => {
        const supabase = createClient();

        const channel = supabase
            .channel(`couple-love-note-${coupleId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "couples",
                    filter: `id=eq.${coupleId}`,
                },
                (payload: RealtimePostgresChangesPayload<CoupleRow>) => {
                    const newRow = payload.new as CoupleRow | null;
                    if (!newRow) return;

                    let displayNote = newRow.love_note ?? "";
                    if (newRow.love_note_updated_at) {
                        const diffInHours =
                            (Date.now() -
                                new Date(
                                    newRow.love_note_updated_at,
                                ).getTime()) /
                            (1000 * 60 * 60);
                        if (diffInHours > 24) {
                            displayNote = "";
                        }
                    } else {
                        displayNote = "";
                    }

                    setNote(displayNote);
                    setAuthorIdState(newRow.love_note_author_id ?? "");
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [coupleId]);

    const handleDelete = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("coupleId", coupleId);
            formData.append("note", "");
            setNote("");
            setAuthorIdState("");
            await updateLoveNote(formData);
        });
    };

    return (
        <Card className="group relative inset-shadow-secondary-foreground/75 inset-shadow-xs col-span-12 md:col-span-4 bg-secondary/15 shadow-md border-none h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center gap-2 font-medium text-secondary text-sm">
                    <div className="flex items-center gap-2">
                        <Heart className="fill-current size-4" />
                        {isMyNote ? "Tvůj vzkaz" : "Vzkaz pro tebe"}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {!isEmpty && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={isPending}
                                        className="hover:bg-transparent size-8 text-secondary hover:text-destructive cursor-pointer"
                                        title="Smazat vzkaz"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Opravdu smazat vzkaz?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tato akce je nevratná. Vzkaz bude
                                            trvale odstraněn.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Zrušit
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-destructive hover:bg-destructive/90"
                                        >
                                            Smazat
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing((prev) => !prev)}
                            className={`hover:bg-transparent size-8 text-secondary ${isEmpty ? "hover:text-green-400" : "hover:text-amber-400"} cursor-pointer`}
                            title={isEmpty ? "Napsat vzkaz" : "Upravit vzkaz"}
                        >
                            {isEmpty ? (
                                <Plus className="size-4" />
                            ) : (
                                <Pencil className="size-4" />
                            )}
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <form
                        action={async (formData) => {
                            const newNote =
                                (formData.get("note") as string) ?? "";
                            setNote(newNote);
                            setAuthorIdState(currentUserId);
                            await updateLoveNote(formData);
                            setIsEditing(false);
                        }}
                        className="space-y-2"
                    >
                        <input type="hidden" name="coupleId" value={coupleId} />
                        <Textarea
                            name="note"
                            defaultValue={note}
                            ref={textareaRef}
                            className="bg-white/50 border-[#E27D60]/20 focus-visible:border-secondary-foreground/50 focus:ring-secondary-foreground/50! min-h-20 font-sans! text-sm"
                            placeholder="Napiš něco hezkého..."
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(false)}
                            >
                                Zrušit
                            </Button>
                            <ActionButton
                                type="submit"
                                size="sm"
                                className="bg-secondary hover:bg-secondary-foreground"
                            >
                                Uložit
                            </ActionButton>
                        </div>
                    </form>
                ) : (
                    <p
                        className={cn(
                            "flex items-center min-h-10 font-sans whitespace-pre-wrap",
                            isEmpty
                                ? "text-muted-foreground/60 italic text-sm"
                                : "text-muted-foreground",
                        )}
                    >
                        {isEmpty
                            ? isMyNote
                                ? "Zatím jsi nic nenapsal(a). Klikni na tužku a potěš svou polovičku!"
                                : "Zatím tu žádný vzkaz není."
                            : `"${note}"`}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
