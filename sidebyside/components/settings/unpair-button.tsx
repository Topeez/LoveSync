"use client";

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
import { uncoupleUser } from "@/app/actions/couple";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, HeartCrack } from "lucide-react";
import ActionButton from "../action-button";
import { useRouter } from "next/navigation";

export function UnpairButton({ coupleId }: { coupleId: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleUnpair = () => {
        startTransition(async () => {
            const result = await uncoupleUser(coupleId);

            if (result.success) {
                toast.success("Propojení bylo zrušeno.");
                router.refresh();
            } else {
                toast.error(result.error ?? "Nepodarilo se zrušit propojení.");
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <ActionButton
                    variant="destructive"
                    className="w-full sm:w-auto"
                >
                    <HeartCrack className="mr-2 size-4" />
                    Zrušit propojení s partnerem
                </ActionButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Opravdu se chcete rozejít?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tato akce zruší propojení vašich účtů. Ztratíte přístup
                        ke společnému kalendáři, poznámkám a historii. Tuto akci
                        nelze vzít zpět (museli byste se znovu spárovat).
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Zůstat spolu
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleUnpair();
                        }}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Odpojuji...
                            </>
                        ) : (
                            "Ano, zrušit propojení"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
