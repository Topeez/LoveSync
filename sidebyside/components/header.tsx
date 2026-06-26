import { LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "./login-button";
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
                        <LoginButton>
                            <span className="hidden md:inline">
                                Přihlásit se přes Google
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="100"
                                height="100"
                                viewBox="0 0 30 30"
                            >
                                <path
                                    fill="white"
                                    d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"
                                ></path>
                            </svg>
                            <LogIn className="md:hidden size-4" />
                        </LoginButton>
                    )}
                </div>
            </nav>
        </header>
    );
}
