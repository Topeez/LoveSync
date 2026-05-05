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
import { deleteAccount } from "@/app/actions/account";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import ActionButton from "../action-button";

export function DeleteAccount() {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteAccount();
            if (result && !result.success) {
                toast.error(result.error ?? "Nepodarilo se smazat účet.");
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <ActionButton variant="destructive">
                    <Trash2 className="mr-2 size-4" />
                    Smazat účet
                </ActionButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Jste si naprosto jistí?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tato akce je nevratná. Trvale smaže váš účet a odstraní
                        vaše data z našich serverů.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Zrušit
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        className="inset-shadow-red-700 inset-shadow-xs bg-destructive hover:bg-red-700 focus:ring-red-600 text-foreground cursor-pointer"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Mazání...
                            </>
                        ) : (
                            "Ano, smazat účet"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
