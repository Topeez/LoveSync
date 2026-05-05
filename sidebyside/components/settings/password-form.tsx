"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/app/actions/auth";
import { useTransition, useRef } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ActionButton from "../action-button";

export function PasswordForm() {
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await updatePassword(null, formData);

            if (result?.success) {
                toast.success(result.message);
                formRef.current?.reset();
            } else {
                // Pokud je chyba specifická pro validaci
                if (result?.errors?.confirmPassword) {
                    toast.error(result.errors.confirmPassword[0]);
                } else {
                    toast.error("Chyba: " + result?.message);
                }
            }
        });
    };

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4 max-w-lg"
        >
            {/* Nové heslo */}
            <div className="space-y-2">
                <Label htmlFor="password">Nové heslo</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimálně 12 znaků"
                    required
                />
            </div>

            {/* Potvrzení hesla */}
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Potvrdit nové heslo</Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Zadejte heslo znovu"
                    required
                />
            </div>

            <div className="flex justify-end pt-2">
                <ActionButton type="submit" disabled={isPending}>
                    {isPending && (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Změnit heslo
                </ActionButton>
            </div>
        </form>
    );
}
