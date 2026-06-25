import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function SettingsLoading() {
    return (
        <div className="space-y-8 py-10 max-w-4xl cs-container">
            <div className="flex justify-between items-center space-y-2">
                <div className="flex flex-col">
                    <Skeleton className="rounded-md w-48 h-8" />
                    <Skeleton className="mt-2 rounded-md w-64 h-6" />
                </div>
            </div>
            <Separator />

            <Skeleton className="rounded-md w-full h-8" />
        </div>
    );
}
