"use client";
import { createClient } from "@/utils/supabase/client";
import ActionButton from "./action-button";

export default function LoginButton({
    nextUrl,
    children,
}: {
    nextUrl?: string;
    children?: React.ReactNode;
}) {
    const supabase = createClient();

    const handleLogin = async () => {
        const callbackUrl = `${window.location.origin}/auth/callback${
            nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""
        }`;

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: callbackUrl,
            },
        });
    };

    return (
        <ActionButton
            onClick={handleLogin}
            className="bg-secondary-foreground! dark:bg-secondary p-4! rounded-full! text-button-text"
        >
            {children}
        </ActionButton>
    );
}
