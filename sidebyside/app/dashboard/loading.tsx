import { PageSkeleton } from "@/components/page-skeleton";
import { getDashboardSkeleton } from "@/config/dashboard-skeleton";
import { DashboardLayoutType } from "@/types/profile";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLoading() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    let layout: DashboardLayoutType = "default";

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("dashboard_layout")
            .eq("id", user.id)
            .maybeSingle();

        if (profile?.dashboard_layout) {
            layout = profile.dashboard_layout as DashboardLayoutType;
        }
    }

    const cards = getDashboardSkeleton(layout);

    return (
        <PageSkeleton titleWidth="w-48" subtitleWidth="w-64" cards={cards} />
    );
}
