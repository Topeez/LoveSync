"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import Link from "next/link";
import { ProfileData } from "@/types/profile";
import { differenceInDays } from "date-fns";

interface CoupleProfileWidgetProps {
    userProfile?: ProfileData | null;
    partnerProfile?: ProfileData | null;
    relationshipStart?: string | null;
}

export function CoupleProfileWidget({
    userProfile,
    partnerProfile,
    relationshipStart,
}: CoupleProfileWidgetProps) {
    const daysTogether = relationshipStart
        ? differenceInDays(new Date(), new Date(relationshipStart))
        : null;

    return (
        <Card className="relative inset-shadow-muted inset-shadow-xs flex flex-col justify-center shadow-lg border-none h-full overflow-hidden">
            <CardHeader>
                <CardTitle className="text-lg">My dva</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col">
                <div className="flex flex-row xl:flex-row md:flex-col items-center gap-4 size-full">
                    {/* JÁ */}
                    <div className="z-100 flex flex-col items-center gap-2">
                        <Link
                            href={`/dashboard/profile/${userProfile?.id}`}
                            aria-label="partner profile link"
                        >
                            <Avatar className="border-2 border-primary size-16">
                                <AvatarImage
                                    src={userProfile?.avatar_url}
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                    alt="your avatar image"
                                />
                                <AvatarFallback>JÁ</AvatarFallback>
                            </Avatar>
                        </Link>
                        <span className="font-medium text-muted-foreground text-sm">
                            {userProfile?.nickname || userProfile?.full_name}
                        </span>
                    </div>

                    <div className="z-10 relative flex flex-1 justify-center items-center min-w-28 sm:min-w-52 h-28 sm:h-52 animate-heart">
                        <Heart
                            className="absolute opacity-50 dark:opacity-30 size-100 md:size-200 text-red-700 transition-all animate-heart"
                            strokeWidth={1}
                            style={{ animationDelay: "0s" }}
                        />
                        <Heart
                            className="absolute opacity-50 dark:opacity-30 size-70 md:size-150 text-red-500 transition-all animate-heart"
                            strokeWidth={1}
                            style={{ animationDelay: "0.15s" }}
                        />
                        <Heart
                            className="absolute opacity-50 dark:opacity-30 size-50 md:size-110 text-red-300 transition-all animate-heart"
                            strokeWidth={1}
                            style={{ animationDelay: "0.3s" }}
                        />

                        {daysTogether !== null ? (
                            <div className="z-10 relative flex flex-col justify-center items-center pb-2 animate-in duration-500 fade-in zoom-in">
                                <span className="drop-shadow-sm font-bold tabular-nums text-xl sm:text-4xl">
                                    {daysTogether}
                                </span>
                                <span className="font-semibold text-[9px] text-muted-foreground sm:text-xs uppercase tracking-widest">
                                    Dní
                                </span>
                            </div>
                        ) : (
                            <div className="absolute px-2 w-full">
                                <div className="bg-border/50 w-full h-px"></div>
                                <Heart className="top-1/2 left-1/2 absolute fill-red-500 size-4 text-red-500 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                        )}
                    </div>

                    {/* PARTNER */}
                    <div className="z-100 flex flex-col items-center gap-2">
                        <Link
                            href={`/dashboard/profile/${partnerProfile?.id}`}
                            aria-label="partner profile link"
                        >
                            <Avatar className="border-2 border-muted size-16">
                                <AvatarImage
                                    src={partnerProfile?.avatar_url}
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                    alt="partner avatar image"
                                />
                                <AvatarFallback>TY</AvatarFallback>
                            </Avatar>
                        </Link>
                        <span className="font-medium text-muted-foreground text-sm">
                            {partnerProfile?.nickname ||
                                partnerProfile?.full_name}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
