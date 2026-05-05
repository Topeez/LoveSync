import { SupabaseClient } from "@supabase/supabase-js";
import { sendNotificationToUser } from "@/app/actions/push";

export async function getPartnerId(
    supabase: SupabaseClient,
    coupleId: string,
    userId: string,
): Promise<string | null> {
    const { data: couple } = await supabase
        .from("couples")
        .select("user1_id, user2_id")
        .eq("id", coupleId)
        .single();

    if (!couple) return null;
    return couple.user1_id === userId ? couple.user2_id : couple.user1_id;
}

interface NotifyPartnerOptions {
    supabase: SupabaseClient;
    fullName: string;
    coupleId: string;
    userId: string;
    title: string;
    message: string;
    link?: string;
    type?: string;
}

export async function notifyPartner({
    supabase,
    coupleId,
    userId,
    title,
    message,
    link = "/dashboard",
    type,
}: NotifyPartnerOptions) {
    const partnerId = await getPartnerId(supabase, coupleId, userId);
    if (!partnerId) return;

    await supabase.from("notifications").insert({
        user_id: partnerId,
        title,
        message,
        link,
        type,
    });

    sendNotificationToUser(partnerId, title, message, link, type).catch((e) =>
        console.error("Push error:", e),
    );
}