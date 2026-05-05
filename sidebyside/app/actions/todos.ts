"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { notifyPartner } from "@/lib/couple-utils";

export async function createTodo(formData: FormData) {
    const title = formData.get("title") as string;
    const coupleId = formData.get("coupleId") as string;

    if (!title || !coupleId) {
        console.error("Chybí title nebo coupleId");
        return { success: false };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error("Uživatel není přihlášen");
        return { success: false };
    }

    const { error } = await supabase
        .from("todos")
        .insert({
            title,
            couple_id: coupleId,
            created_by: user.id,
        })
        .select();

    if (error) {
        console.error("Chyba při insertu todos:", error);
        return { success: false };
    }

    const fullName = user.user_metadata.full_name || "Partner";

    await notifyPartner({
        supabase,
        coupleId,
        fullName,
        userId: user.id,
        title: "Nový úkol 📝",
        message: `${fullName} přidal(a): ${title}`,
        type: "todos",
    });

    revalidatePath("/dashboard");
    return { success: true };
}

export async function toggleTodo(todoId: string, isCompleted: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: todo, error } = await supabase
        .from("todos")
        .update({ is_completed: isCompleted })
        .eq("id", todoId)
        .select("title, couple_id")
        .single();

    if (error) {
        console.error("Error toggling todo:", error);
        return { success: false };
    }

    revalidatePath("/dashboard");

    if (user && isCompleted && todo) {
        const fullName = user.user_metadata.full_name || "Partner";

        await notifyPartner({
            supabase,
            fullName,
            coupleId: todo.couple_id,
            userId: user.id,
            title: "Úkol splněn! ✅",
            message: `${fullName} splnil(a): ${todo.title}`,
            type: "todos",
        });
    }

    return { success: true };
}

export async function deleteTodo(todoId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Nepřihlášen" };

    const { data: todo } = await supabase
        .from("todos")
        .select("couple_id")
        .eq("id", todoId)
        .single();

    if (!todo) return { success: false, error: "Úkol nenalezen." };

    const { data: couple } = await supabase
        .from("couples")
        .select("id")
        .eq("id", todo.couple_id)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .maybeSingle();

    if (!couple) return { success: false, error: "Nemáte oprávnění" };

    const { error } = await supabase.from("todos").delete().eq("id", todoId);
    if (error) return { success: false };

    revalidatePath("/dashboard");
    return { success: true };
}