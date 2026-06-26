import { ArrowUpRight, CirclePlay, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getReleases } from "@/lib/github";
import Squares from "@/components/Squares";
import ActionButton from "./action-button";
import LoginButton from "./login-button";
import { createClient } from "@/utils/supabase/server";

export default async function Hero() {
    const releases = await getReleases();
    const latestRelease = releases.length > 0 ? releases[0] : null;
    const versionLabel = latestRelease?.tag_name || "Nová verze";

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div className="relative flex justify-center items-center bg-background px-6 w-full min-h-screen overflow-hidden transform-3d">
            <div className="absolute inset-0 size-full">
                <Squares
                    direction="diagonal"
                    speed={0.2}
                    squareSize={40}
                    borderColor="--muted"
                    hoverFillColor="#fce7f3"
                />
            </div>

            <div className="right-0 bottom-0 left-0 z-10 absolute bg-linear-to-t from-background to-transparent w-full h-32"></div>

            <div className="z-10 relative max-w-3xl text-center">
                <Badge
                    asChild
                    className="backdrop-blur-[10px] py-1 border-border rounded-full cursor-pointer"
                    variant="outline"
                >
                    <Link href="/changelog">
                        Právě vyšla{" "}
                        <span className="mx-1 font-bold">{versionLabel}</span>
                        <ArrowUpRight className="ml-1 size-4" />
                    </Link>
                </Badge>

                <h1 className="bg-clip-text bg-linear-to-b from-foreground mt-6 p-2 font-semibold text-transparent text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] tracking-tighter to-accent-foreground">
                    LoveSync
                </h1>
                <p className="mt-6 p-8 font-sans text-foreground md:text-xl">
                    Plánujte společně, žijte lépe. Aplikace pro páry, která
                    sjednocuje sdílený kalendář, plány a vzpomínky na jedno
                    místo.
                </p>
                <div className="flex md:flex-row flex-col justify-center items-center gap-4 mt-12">
                    {user ? (
                        <Link href="/dashboard">
                            <ActionButton className="gap-2 bg-secondary-foreground dark:bg-primary p-4! md:p-6! rounded-full text-md md:text-lg cursor-pointer">
                                <LayoutDashboard className="size-4" />
                                Přejít do aplikace
                            </ActionButton>
                        </Link>
                    ) : (
                        <LoginButton>
                            Začít zdarma <ArrowUpRight className="size-5" />
                        </LoginButton>
                    )}
                    <ActionButton
                        className="group bg-white/50 shadow-none backdrop-blur-sm p-4! md:p-6! border-background rounded-full text-foreground text-md md:text-lg"
                        variant="outline"
                        size="lg"
                    >
                        <Link
                            href="/changelog"
                            className="flex items-center gap-2"
                        >
                            <CirclePlay className="size-5 group-hover:text-secondary duration-200 ease-in-out" />{" "}
                            <span className="group-hover:text-secondary duration-200 ease-in-out">
                                Co je nového
                            </span>
                        </Link>
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}
