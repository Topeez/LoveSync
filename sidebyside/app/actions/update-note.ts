"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { notifyPartner } from "@/lib/couple-utils";
import { ActionResult } from "@/types/actions";

export async function updateLoveNote(formData: FormData): Promise<ActionResult> {
    const note = (formData.get("note") as string | null) ?? "";
    const coupleId = formData.get("coupleId") as string;

    if (!coupleId) return { success: false, error: "Chyba coupleId" };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Nepřihlášen" };

    const { data: couple } = await supabase
        .from("couples")
        .select("user1_id")
        .eq("id", coupleId)
        .single();

    const isUser1 = couple?.user1_id === user.id;

    const { error } = await supabase
        .from("couples")
        .update({
            love_note: note,
            love_note_author_id: note ? user.id : null,
            love_note_updated_at: new Date().toISOString(),
            ...(note.trim().length > 0 && {
                [isUser1 ? "user1_wrote_note" : "user2_wrote_note"]: true,
            }),
        })
        .eq("id", coupleId);

    if (error) {
        console.error("Error updating love note:", error);
        return { success: false, error: error.message };
    }

    if (note.trim().length > 0) {
        const fullName = user.user_metadata.full_name || "Partner";
        const preview = note.length > 50 ? `${note.substring(0, 50)}...` : note;

        await notifyPartner({
            supabase,
            coupleId,
            fullName,
            userId: user.id,
            title: "Nový vzkaz ❤️",
            message: `${fullName} ti nechal(a) vzkaz: "${preview}"`,
            type: "love_note",
        });
    }

    revalidatePath("/dashboard");
    return { success: true };
}