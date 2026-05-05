"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { notifyPartner } from "@/lib/couple-utils";

export async function updateLoveNote(formData: FormData) {
    const note = (formData.get("note") as string | null) ?? "";
    const coupleId = formData.get("coupleId") as string;

    if (!coupleId) return { success: false };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false };

    const { error } = await supabase
        .from("couples")
        .update({
            love_note: note,
            love_note_author_id: user.id,
            love_note_updated_at: new Date().toISOString(),
        })
        .eq("id", coupleId);

    if (error) {
        console.error("Error updating love note:", error);
        return { success: false };
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