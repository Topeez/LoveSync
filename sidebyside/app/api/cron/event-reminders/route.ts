import { createAdminClient } from "@/utils/supabase/admin";
import { sendNotificationToUser } from "@/app/actions/push";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const now = new Date();

    // Načteme eventy kde:
    // - notify_before je nastaveno
    // - notification_sent je false
    // - start_time je v budoucnosti
    const { data: events, error } = await supabase
        .from("events")
        .select("id, title, start_time, notify_before, couple_id")
        .not("notify_before", "is", null)
        .eq("notification_sent", false)
        .gt("start_time", now.toISOString());

    if (error || !events) {
        console.error("Cron fetch error:", error);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    const toNotify = events.filter((event) => {
        const startTime = new Date(event.start_time);
        const notifyAt = new Date(startTime.getTime() - event.notify_before * 60 * 1000);
        return notifyAt <= now;
    });

    for (const event of toNotify) {
        // Získáme oba usery z páru
        const { data: couple } = await supabase
            .from("couples")
            .select("user1_id, user2_id")
            .eq("id", event.couple_id)
            .single();

        if (!couple) continue;

        const startFormatted = new Date(event.start_time).toLocaleString("cs-CZ", {
            day: "numeric",
            month: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        const message = `Začíná za ${event.notify_before >= 60
            ? `${event.notify_before / 60} hod`
            : `${event.notify_before} min`} (${startFormatted})`;

        // Pošleme oběma
        const userIds = [couple.user1_id, couple.user2_id].filter(Boolean);
        await Promise.all(
            userIds.map((userId) =>
                sendNotificationToUser(
                    userId,
                    `📅 ${event.title}`,
                    message,
                    "/dashboard",
                    "events",
                )
            )
        );

        // Označíme jako odesláno
        await supabase
            .from("events")
            .update({ notification_sent: true })
            .eq("id", event.id);
    }

    return NextResponse.json({
        checked: events.length,
        notified: toNotify.length,
    });
}