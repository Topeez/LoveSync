"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/app/actions/auth";
import { useTransition, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import ActionButton from "../action-button";

export function PasswordForm() {
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await updatePassword(null, formData);

            if (result?.success) {
                toast.success(result.message);
                formRef.current?.reset();
            } else {
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
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimálně 12 znaků"
                        required
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="top-1/2 right-3 absolute text-muted-foreground hover:text-foreground transition-colors -translate-y-1/2"
                        tabIndex={-1}
                        aria-label={
                            showPassword ? "Skrýt heslo" : "Zobrazit heslo"
                        }
                    >
                        {showPassword ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Potvrzení hesla */}
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Potvrdit nové heslo</Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Zadejte heslo znovu"
                        required
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="top-1/2 right-3 absolute text-muted-foreground hover:text-foreground transition-colors -translate-y-1/2"
                        tabIndex={-1}
                        aria-label={
                            showConfirm ? "Skrýt heslo" : "Zobrazit heslo"
                        }
                    >
                        {showConfirm ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex justify-start pt-2">
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
