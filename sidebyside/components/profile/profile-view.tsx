"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Edit,
    Heart,
    Palette,
    Ruler,
    Shirt,
    Footprints,
    Sparkles,
    Icon,
    LayoutDashboard,
} from "lucide-react";
import { trousers } from "@lucide/lab";
import { EditProfileDialog } from "./edit-profile-dialog";
import React, { useState } from "react";
import { Profile } from "@/types/profile";
import { UserNav } from "../dashboard/user-nav";
import { ThemeToggle } from "../theme-switcher";
import Link from "next/link";

interface ProfileViewProps {
    profile: Profile;
    isEditable: boolean;
    hasCouple?: boolean;
}

export function ProfileView({
    profile,
    isEditable,
    hasCouple,
}: ProfileViewProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const initials = profile.full_name
        ? profile.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "JA";

    return (
        <div className="space-y-4 cs-container">
            {/* --- HLAVIČKA A AKCE --- */}
            <div className="flex md:flex-row-reverse flex-col justify-between items-end gap-4 shadow-sm mb-6 px-6 py-2">
                <div className="flex items-center gap-4">
                    {isEditable && (
                        <Button
                            onClick={() => setIsEditDialogOpen(true)}
                            className="inset-shadow-primary-foreground inset-shadow-xs gap-2 shadow-md border-none text-button-text cursor-pointer"
                        >
                            <Edit className="size-4" />
                            <span className="hidden md:block">
                                Upravit údaje
                            </span>
                        </Button>
                    )}
                    <Link href={"/dashboard"} aria-label="Zpět na dashboard">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative bg-accent shadow-md border border-muted rounded-full text-muted-foreground hover:text-foreground"
                        >
                            <LayoutDashboard />
                        </Button>
                    </Link>
                    <div className="hidden md:inline">
                        <ThemeToggle />
                    </div>
                    {isEditable && (
                        <UserNav
                            id={(profile.id as string) || ""}
                            email={profile.email || ""}
                            avatar_url={
                                (profile.avatar_url as string) || undefined
                            }
                            full_name={
                                profile.full_name || profile.nickname || ""
                            }
                            couple_id={hasCouple ? "has-couple" : undefined}
                        />
                    )}
                </div>
                <div>
                    <h1 className="font-bold text-2xl md:text-left text-center tracking-tight">
                        {isEditable
                            ? "Můj Profil"
                            : `Profil ${profile.nickname || "partnera"}`}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditable
                            ? "Tady si nastav, co má tvůj partner vědět."
                            : "Podívej se na údaje, které s tebou tvůj partner sdílí."}
                    </p>
                </div>
            </div>

            {/* --- BENTO GRID --- */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(120px,auto)]">
                {/* 1. KARTA IDENTITY (Velká) - col-span-2 */}
                <Card className="inset-shadow-muted inset-shadow-xs flex flex-col justify-center items-center md:col-span-2 md:row-span-2 bg-linear-to-br from-background to-muted/50 shadow-lg p-6 border-2 border-none text-center">
                    <Avatar className="shadow-xl mb-4 border-4 border-background w-32 h-32">
                        <AvatarImage
                            src={
                                typeof profile.avatar_url === "string"
                                    ? profile.avatar_url
                                    : profile.avatar_url?.toISOString()
                            }
                            className="object-cover"
                            referrerPolicy="no-referrer"
                            alt="your avatar image"
                        />
                        <AvatarFallback className="text-4xl">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="font-bold text-2xl">{profile.full_name}</h2>
                    <p className="mb-4 text-muted-foreground text-lg">
                        @{profile.nickname || "Přezdívka"}
                    </p>
                    {profile.bio && (
                        <div className="inset-shadow-muted inset-shadow-xs bg-background/80 shadow-sm p-3 border-none rounded-lg max-w-xs text-foregroundD text-sm italic">
                            &quot;{profile.bio}&quot;
                        </div>
                    )}
                </Card>

                {/* 2. LOVE LANGUAGE (Jazyk lásky) - col-span-2 */}
                <Card className="inset-shadow-pink-500/50 inset-shadow-xs md:col-span-2 bg-pink-50/50 dark:bg-pink-950/10 shadow-lg border-none">
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-pink-600 text-sm">
                            Jazyk lásky
                        </CardTitle>
                        <Heart
                            className="size-4 text-pink-500"
                            fill="currentColor"
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl capitalize">
                            {profile.love_language || "Nezadáno"}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">
                            Jak nejraději přijímá lásku?
                        </p>
                    </CardContent>
                </Card>

                {/* 3. CHEAT SHEET (Velikosti) - col-span-2, row-span-2 (vysoká) */}
                <Card className="relative inset-shadow-muted inset-shadow-xs md:col-span-2 md:row-span-2 shadow-lg border-none overflow-hidden">
                    <div className="top-0 right-0 absolute opacity-5 p-4">
                        <Ruler className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="size-4 text-primary" />
                            Velikostní tahák
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="gap-4 grid grid-cols-2">
                        <SizeItem
                            icon={<Shirt className="size-4" />}
                            label="Tričko / Top"
                            value={profile.clothing_size_top}
                        />
                        <SizeItem
                            icon={
                                <Icon iconNode={trousers} className="size-4" />
                            }
                            label="Kalhoty"
                            value={profile.clothing_size_bottom}
                        />
                        <SizeItem
                            icon={<Footprints className="size-4" />}
                            label="Boty"
                            value={profile.shoe_size}
                        />
                        <SizeItem
                            icon={
                                <div className="border-2 border-current rounded-full size-4" />
                            }
                            label="Prstýnek"
                            value={profile.ring_size}
                            highlight
                        />
                    </CardContent>
                </Card>

                {/* 4. OBLÍBENÁ BARVA - col-span-1 */}
                <Card className="inset-shadow-muted inset-shadow-xs flex flex-col justify-center items-center md:col-span-1 shadow-lg p-4 border-none">
                    <div className="flex items-center gap-2 mb-2 font-medium text-muted-foreground text-sm">
                        <Palette className="w-4 h-4" /> Oblíbená barva
                    </div>
                    {profile.favorite_color ? (
                        <div className="flex items-center gap-2">
                            <div
                                className="shadow-sm border-2 rounded-full w-8 h-8"
                                style={{
                                    backgroundColor: profile.favorite_color,
                                }}
                            />
                            <span className="font-mono text-xs">
                                {profile.favorite_color}
                            </span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                    )}
                </Card>

                {/* 5. Placeholder pro další info - col-span-1 */}
                <Card className="flex flex-col justify-center items-center md:col-span-1 bg-muted/30 p-4 border-dashed">
                    <span className="text-muted-foreground text-xs">
                        Další detaily brzy...
                    </span>
                </Card>
            </div>

            {/* Dialog pro editaci */}
            <EditProfileDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                profile={profile}
            />
        </div>
    );
}

// Pomocná komponenta pro velikosti
function SizeItem({
    icon,
    label,
    value,
    highlight,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | null;
    highlight?: boolean;
}) {
    return (
        <div
            className={`flex flex-col p-3 border-none shadow-lg inset-shadow-xs inset-shadow-muted rounded-lg border ${highlight ? "bg-primary/10 inset-shadow-primary/50  border-primary/50" : "bg-muted/30 border-transparent"}`}
        >
            <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                {icon}
                <span className="font-medium text-xs uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <div
                className={`text-xl font-bold ${!value && "text-muted-foreground text-sm font-normal"}`}
            >
                {value || "Neznámo"}
            </div>
        </div>
    );
}
