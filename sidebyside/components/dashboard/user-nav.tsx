"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ProfileData } from "@/types/profile";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { ThemeToggleWrapper } from "../theme-switcher-wrapper";
export function UserNav({
    id,
    email,
    avatar_url,
    full_name,
    nickname,
    couple_id,
}: ProfileData) {
    const router = useRouter();
    const supabase = createClient();

    useKeyboardNavigation({ userId: id });

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const initials = full_name
        ? full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "JA";

    const fullAvatarUrl = avatar_url?.startsWith("http")
        ? avatar_url
        : undefined;

    const hasCouple = !!couple_id;
    const hasProfile = !!id;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative shadow-md rounded-full size-10 cursor-pointer"
                >
                    <Avatar className="border border-muted size-10">
                        {fullAvatarUrl && (
                            <AvatarImage
                                src={fullAvatarUrl}
                                alt={nickname || full_name}
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                        )}
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-screen xs:w-100"
                align="end"
                forceMount
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col space-y-1">
                            <p className="font-medium text-sm leading-none">
                                Můj Profil
                            </p>
                            <p className="text-muted-foreground text-xs leading-none">
                                {email}
                            </p>
                        </div>
                        <span className="md:hidden">
                            <ThemeToggleWrapper />
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link
                        href={`/dashboard/profile/${id}`}
                        className={
                            !hasProfile
                                ? "pointer-events-none cursor-not-allowed!"
                                : ""
                        }
                        aria-disabled={!hasProfile}
                        tabIndex={!hasProfile ? -1 : undefined}
                    >
                        <DropdownMenuItem
                            className={
                                !hasProfile
                                    ? "pointer-events-none cursor-not-allowed!"
                                    : ""
                            }
                            disabled={!hasProfile}
                        >
                            <User className="mr-2 size-4" />
                            <span>O mně</span>
                            <DropdownMenuShortcut>⌥P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className={
                            !hasProfile
                                ? "pointer-events-none cursor-not-allowed!"
                                : ""
                        }
                        aria-disabled={!hasProfile}
                        tabIndex={!hasProfile ? -1 : undefined}
                    >
                        <DropdownMenuItem
                            className={
                                !hasProfile
                                    ? "pointer-events-none cursor-not-allowed!"
                                    : ""
                            }
                            disabled={!hasProfile}
                        >
                            <Settings className="mr-2 size-4" />
                            <span>Nastavení</span>
                            <DropdownMenuShortcut>⌥S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    <Link
                        href="/dashboard/couple"
                        className={
                            !hasCouple
                                ? "pointer-events-none cursor-not-allowed!"
                                : ""
                        }
                        aria-disabled={!hasCouple}
                        tabIndex={!hasCouple ? -1 : undefined}
                    >
                        <DropdownMenuItem
                            className={
                                !hasCouple
                                    ? "pointer-events-none cursor-not-allowed!"
                                    : ""
                            }
                            disabled={!hasCouple}
                        >
                            <Heart className="mr-2 size-4 text-destructive" />
                            <span>Náš vztah</span>
                            <DropdownMenuShortcut>⌥C</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive cursor-pointer"
                >
                    <LogOut className="mr-2 size-4 text-destructive" />
                    <span>Odhlásit se</span>
                    <DropdownMenuShortcut>⌥Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
