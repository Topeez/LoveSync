import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Cake } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { cs } from "date-fns/locale";

interface PartnerCardProps {
    nickname: string | null;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    birth_date: string | null;
    love_language: string | null;
}

export function PartnerCard({
    nickname,
    full_name,
    avatar_url,
    bio,
    birth_date,
    love_language,
}: PartnerCardProps) {
    const initials =
        full_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) ?? "??";

    const age = birth_date
        ? differenceInYears(new Date(), new Date(birth_date))
        : null;

    const birthday = birth_date
        ? format(new Date(birth_date), "d. MMMM", { locale: cs })
        : null;

    return (
        <div className="flex sm:flex-row flex-col gap-5 bg-muted/40 mx-auto p-5 border rounded-xl w-full">
            <div className="flex flex-col items-center gap-2 min-w-20">
                <Avatar className="border-2 border-muted size-20">
                    <AvatarImage
                        src={avatar_url ?? undefined}
                        className="object-cover"
                    />
                    <AvatarFallback className="text-xl">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <p className="font-semibold text-sm leading-tight">
                        {nickname ?? full_name ?? "Partner"}
                    </p>
                    {nickname && full_name && (
                        <p className="text-muted-foreground text-xs">
                            {full_name}
                        </p>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 gap-3">
                {bio && (
                    <p className="text-muted-foreground italic leading-relaxed">
                        &quot;{bio}&quot;
                    </p>
                )}

                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {birthday && (
                        <Badge
                            variant="outline"
                            className="flex items-center gap-1.5 font-normal text-sm"
                        >
                            <Cake className="size-5" />
                            {birthday}
                            {age !== null && `, ${age} let`}
                        </Badge>
                    )}
                    {love_language && (
                        <Badge
                            variant="outline"
                            className="flex items-center gap-1.5 font-normal text-sm"
                        >
                            <Heart className="size-5 text-rose-400" />
                            {love_language}
                        </Badge>
                    )}
                </div>

                {!bio && !birthday && !love_language && (
                    <p className="text-muted-foreground text-xs italic">
                        Partner zatím nevyplnil svůj profil.
                    </p>
                )}
            </div>
        </div>
    );
}
