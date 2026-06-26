import { getReleases } from "@/lib/github";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import Link from "next/link";

export const metadata = {
    title: "Changelog | LoveSync",
    description: "Historie změn a novinek v aplikaci.",
};

export default async function ChangelogPage() {
    const releases = await getReleases();

    return (
        <div className="px-4 py-12 cs-container">
            <h1 className="mb-2 font-bold text-4xl tracking-tight">
                Co je nového
            </h1>
            <p className="mb-8 text-muted-foreground">
                Historie verzí a aktualizací aplikace LoveSync.
            </p>

            <div className="relative space-y-12 ml-3 border-border border-l">
                {releases.length === 0 ? (
                    <p className="pl-6 text-muted-foreground">
                        Zatím nebyly vydány žádné verze.
                    </p>
                ) : (
                    releases.map((release) => (
                        <div key={release.id} className="relative pl-8">
                            {/* Tečka na časové ose */}
                            <div className="top-2 -left-1.25 absolute bg-primary rounded-full ring-4 ring-background size-2.5" />

                            <div className="flex sm:flex-row flex-col sm:items-center gap-2 mb-2">
                                <h2 className="font-semibold text-2xl hover:underline">
                                    <Link
                                        href={release.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {release.name || release.tag_name}
                                    </Link>
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="font-mono"
                                    >
                                        {release.tag_name}
                                    </Badge>
                                    <span className="text-muted-foreground text-sm">
                                        {format(
                                            new Date(release.published_at),
                                            "d. MMMM yyyy",
                                            {
                                                locale: cs,
                                            },
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Obsah Release Note */}
                            <Card className="bg-muted/30 mt-4">
                                <CardContent className="dark:prose-invert pt-6 max-w-none text-foreground/90 prose">
                                    {/* Zde se renderuje Markdown z GitHubu */}
                                    <ReactMarkdown
                                        components={{
                                            ul: ({ ...props }) => (
                                                <ul
                                                    className="space-y-1 my-2 pl-5 list-disc"
                                                    {...props}
                                                />
                                            ),
                                            li: ({ ...props }) => (
                                                <li
                                                    className="pl-1"
                                                    {...props}
                                                />
                                            ),
                                            h1: ({ ...props }) => (
                                                <h3
                                                    className="mt-4 mb-2 font-bold text-lg"
                                                    {...props}
                                                />
                                            ),
                                            h2: ({ ...props }) => (
                                                <h4
                                                    className="mt-3 mb-1 font-bold text-base"
                                                    {...props}
                                                />
                                            ),
                                        }}
                                    >
                                        {release.body}
                                    </ReactMarkdown>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
