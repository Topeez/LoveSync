import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import ActionButton from "./action-button";

export default async function Header() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <header className="top-0 right-0 left-0 z-999 fixed bg-muted/5 shadow-xs backdrop-blur-sm">
            <nav className="flex justify-between items-center py-4 w-full cs-container">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-foreground text-xl"
                >
                    <Image
                        src="/android-chrome-512x512.png"
                        width={30}
                        height={30}
                        alt="LoveSync logo"
                    />{" "}
                    LoveSync
                </Link>

                <div className="flex items-center gap-3">
                    {user ? (
                        <Link href="/dashboard">
                            <ActionButton className="gap-2 bg-secondary-foreground dark:bg-secondary">
                                <LayoutDashboard className="size-4" />
                                Přejít do aplikace
                            </ActionButton>
                        </Link>
                    ) : (
                        <Link href="/register">
                            <ActionButton className="bg-secondary-foreground">
                                Zaregistrovat se zdarma
                            </ActionButton>
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
