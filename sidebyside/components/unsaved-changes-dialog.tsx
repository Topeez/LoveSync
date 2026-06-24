"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUnsavedChanges } from "@/components/unsaved-changes-context";

export function UnsavedChangesDialog() {
    const { confirmOpen, closeDialog, confirm } = useUnsavedChanges();

    return (
        <Dialog
            open={confirmOpen}
            onOpenChange={(open) => !open && closeDialog()}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Neuložené změny</DialogTitle>
                </DialogHeader>
                <p className="mb-4 text-muted-foreground text-sm">
                    Máš neuložené změny. Opravdu chceš odejít bez uložení?
                </p>
                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>
                        Zůstat
                    </Button>
                    <Button variant="destructive" onClick={confirm}>
                        Odejít bez uložení
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
