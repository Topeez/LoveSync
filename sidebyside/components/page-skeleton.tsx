import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SkeletonProps } from "@/types/skeleton";

export function PageSkeleton({
    titleWidth = "w-48",
    subtitleWidth = "w-64",
    cards,
}: SkeletonProps) {
    return (
        <div className="space-y-6 p-4 md:p-8">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8 px-6 w-full">
                <div className="space-y-2 mt-2">
                    <Skeleton
                        className={cn(
                            "rounded-md w-24 h-8",
                            `md:${titleWidth}`,
                        )}
                    />
                    <Skeleton
                        className={cn(
                            "hidden md:block rounded-md w-32 h-4",
                            `md:${subtitleWidth}`,
                        )}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="rounded-full w-16 h-8" />
                    <Skeleton className="rounded-full size-8" />
                    <Skeleton className="rounded-full size-10" />
                </div>
            </div>

            {/* GRID */}
            <div className="gap-4 grid grid-cols-12">
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        className={cn(
                            "col-span-12",
                            card.colSpan || "md:col-span-4",
                            card.height || "h-full",
                        )}
                    >
                        {card.hasHeader && (
                            <CardHeader>
                                <Skeleton className="rounded-md w-1/3 h-6" />
                            </CardHeader>
                        )}

                        <CardContent className="space-y-4">
                            {card.customContent
                                ? card.customContent
                                : Array.from({
                                      length: card.contentLines || 3,
                                  }).map((_, i) => (
                                      <Skeleton
                                          key={i}
                                          className="rounded-md w-full h-5"
                                      />
                                  ))}
                        </CardContent>

                        {card.hasFooter && (
                            <CardFooter>
                                <Skeleton className="rounded-md w-1/3 h-10" />
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
