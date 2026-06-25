"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ActionButton from "../action-button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { useUnsavedChanges } from "../unsaved-changes-context";

export function ChangeEmailForm() {
    const { markDirty, markSaved } = useUnsavedChanges();

    const [newEmail, setNewEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleChange = async () => {
        if (!newEmail || !newEmail.includes("@")) {
            toast.error("Zadejte platný email.");
            return;
        }
        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser(
            { email: newEmail },
            { emailRedirectTo: `${window.location.origin}/auth/callback` },
        );
        setLoading(false);

        if (error) {
            toast.error("Chyba: " + error.message);
        } else {
            setSent(true);
            markSaved();
            toast.success("Potvrzovací email odeslán na " + newEmail);
        }
    };

    if (sent) {
        return (
            <div className="bg-primary/10 p-4 rounded-lg text-primary text-sm">
                <Check className="mr-1" />
                Potvrzovací email odeslán na <strong>{newEmail}</strong>.
                Zkontroluj svou schránku a klikni na odkaz pro potvrzení změny.
            </div>
        );
    }

    return (
        <div className="space-y-3 max-w-lg">
            <Label htmlFor="new-email">Nový email</Label>
            <div className="flex gap-2">
                <Input
                    id="new-email"
                    type="email"
                    placeholder="novy@email.cz"
                    value={newEmail}
                    onChange={(e) => {
                        setNewEmail(e.target.value);
                        markDirty();
                    }}
                />
            </div>
            <ActionButton
                className="mt-2"
                onClick={handleChange}
                disabled={loading}
            >
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Změnit
            </ActionButton>
            <p className="text-muted-foreground text-xs">
                Na nový email přijde potvrzovací odkaz. Změna se projeví po
                potvrzení.
            </p>
        </div>
    );
}
