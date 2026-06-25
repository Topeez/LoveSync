"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotificationToUser } from "./push";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getPartnerId } from "@/lib/couple-utils";
import { ActionResult } from "@/types/actions";

const MilestoneSchema = z.object({
    title: z.string().min(1, "Název je povinný"),
    description: z.string().optional(),
    date: z.string().min(1, "Datum je povinné"),
    icon: z.string().min(1),
    coupleId: z.uuid(),
});

const BucketItemSchema = z.object({
  title: z.string().min(1, "Název je povinný"),
    image_url: z.url("Neplatný formát URL").optional().or(z.literal("")), 
    status: z.enum(["planned", "in_progress", "completed"]),
    coupleId: z.uuid(),
})

export async function updateRelationshipDate(coupleId: string, date: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if(!user) return { success: false, error: "Nepřihlášen" }


  const { data: couple } = await supabase
  .from("couples")
    .select("id")
    .eq("id", coupleId)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .maybeSingle();

  if(!couple) return { success: false, error: "Nemáte oprávnění" }
  
  const { error } = await supabase
  .from("couples")
    .update({ relationship_start: date })
    .eq("id", coupleId);

  if(error) { 
    console.error("deleteError: ", error)
    return { success: false, error: "Nepodřilo se aktualizovat datum" }
  };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateCoverPhoto(coupleId: string, formData: FormData): Promise<ActionResult> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Nepřihlášen" };
    
    const imageFile = formData.get("cover") as File;

    if (!coupleId || !imageFile) return { success: false, error: "Chyba nmáš pár nebo soubor neexistuje" };

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if(!allowedTypes.includes(imageFile.type)) return { success: false, error: "Nepodporovaný formát. Povolen je pouze JPG, PNG nebo WebP." };

    if(imageFile.size > 1 * 1204 * 1024) return { success: false, error: "Soubor je příliš velký. Maximum je 1 MB." };

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `covers/${coupleId}/${uuidv4()}.${fileExt}`;

    const { data: couple } = await supabase
      .from("couples")
        .select("id")
        .eq("id", coupleId)
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .maybeSingle();

    if(!couple) return { success: false, error: "Nemáte oprávnění" }

    const { error: uploadError } = await supabase.storage
        .from('couple-photos')
        .upload(fileName, imageFile);

    if (uploadError) {
        console.error("Cover upload error:", uploadError);
        return { success: false, error: "Nepodřilo se nahrát obrázek" };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('couple-photos')
        .getPublicUrl(fileName);

    await supabase
        .from("couples")
        .update({ cover_url: publicUrl })
        .eq("id", coupleId);

    revalidatePath("/dashboard/couple");
    revalidatePath("/couple");

    return { success: true };
}

export async function createMilestone(formData: FormData): Promise<ActionResult> {
const validated = MilestoneSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        date: formData.get("date"),
        icon: formData.get("icon"),
        coupleId: formData.get("coupleId"),
    });

  if (!validated.success) {
        return { success: false, error: "Chyba validace" };
    }

    const { title, description, date, icon, coupleId } = validated.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Nepřihlášen" };

    const { data: couple } = await supabase
        .from("couples")
        .select("id")
        .eq("id", coupleId)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .maybeSingle();

    if(!couple) return { success: false, error: "Nemáte oprávnění" }

    const { error } = await supabase.from("milestones").insert({
        title, description, date,
        icon: icon || "star",
        couple_id: coupleId,
    });

    if (error) return { success: false, error: "Chyba při ukládání" };

    const partnerId = await getPartnerId(supabase, coupleId, user.id);
    if (partnerId) {
        const fullName = user.user_metadata.full_name || "Partner";
        await sendNotificationToUser(
            partnerId,
            "Nový milník!",
            `${fullName} přidal vzpomínku: ${title}`,
            "/dashboard/couple",
            "milestone",
        );
    }

    revalidatePath("/dashboard/couple");
    return { success: true };
}

export async function createBucketItem(formData: FormData): Promise<ActionResult> {
    const validated = BucketItemSchema.safeParse({
        title: formData.get("title"),
        image_url: formData.get("image_url"),
        status: formData.get("status"),
        coupleId: formData.get("coupleId"),
    });

    if (!validated.success) {
        return { success: false, error: "Chyba validace" };
    }

    const { title, image_url, status, coupleId } = validated.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Nepřihlášen" };

    const { data: couple } = await supabase
        .from("couples")
        .select("id")
        .eq("id", coupleId)
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .maybeSingle();

    if(!couple) return { success: false, error: "Nemáte oprávnění" }

    const { error } = await supabase.from("bucket_list_items").insert({
        title, status,
        image_url: image_url || null,
        couple_id: coupleId,
    });

    if (error) return { success: false, error: "Chyba při ukládání" };

    const partnerId = await getPartnerId(supabase, coupleId, user.id);
    if (partnerId) {
        const fullName = user.user_metadata.full_name || "Partner";
        await sendNotificationToUser(
            partnerId,
            "Nový sen do Bucket Listu",
            `${fullName} přidal: ${title}`,
            "/dashboard/couple",
            "bucket_item",
        );
    }

    revalidatePath("/dashboard/couple");
    return { success: true };
}
export async function deleteBucketItem(itemId: string): Promise<ActionResult> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Nepřihlášen" };

    const { data: item } = await supabase
        .from("bucket_list_items")
        .select("couple_id")
        .eq("id", itemId)
        .single();

    if (!item) return { success: false, error: "Položka nenalezena." };

    const { data: couple } = await supabase
        .from("couples")
        .select("id")
        .eq("id", item.couple_id)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .maybeSingle();

    if (!couple) return { success: false, error: "Nemáte oprávnění." };

    const { error } = await supabase
        .from("bucket_list_items")
        .delete()
        .eq("id", itemId);

    if (error) {
        console.error("Error deleting bucket item:", error);
        return { success: false, error: "Nepodařilo se smazat položku." };
    }

    revalidatePath("/dashboard/couple");
    return { success: true };
}


export async function toggleBucketItemStatus(
  itemId: string,
  newStatus: string,
): Promise<ActionResult> {
  if (!itemId) {
    return { success: false, error: "Chybí ID položky." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Uživatel není přihlášen." };
  }

  const { error } = await supabase
    .from("bucket_list_items")
    .update({ status: newStatus })
    .eq("id", itemId);

  if (error) {
    console.error("toggleBucketItemStatus error:", error);
    return {
      success: false,
      error: "Nepodařilo se aktualizovat stav položky. Zkus to prosím znovu.",
    };
  }

  revalidatePath("/dashboard/couple");
  return { success: true };
}

export async function uncoupleUser(coupleId: string): Promise<ActionResult> {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Nejste přihlášen" };

    const { data: couple, error: fetchError } = await supabase
        .from("couples")
        .select("user1_id, user2_id")
        .eq("id", coupleId)
        .single();

    if (fetchError || !couple) {
        return { success: false, error: "Pár nenalezen." };
    }

    if (couple.user1_id !== user.id && couple.user2_id !== user.id) {
        return { success: false, error: "Nemáte oprávnění k této akci." };
    }

    const { error: deleteError } = await supabase
        .from("couples")
        .delete()
        .eq("id", coupleId);

    if (deleteError) {
        console.error("Uncouple error:", deleteError);
        return { success: false, error: "Nepodařilo se zrušit propojení." };
    }

    revalidatePath("/", "layout");
    return { success: true };
}

export async function updateMood(mood: string): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Nepřihlášen" };

    const { data: couple } = await supabase
        .from("couples")
        .select("id, user1_id, user2_id")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single();

    if (!couple) return { success: false, error: "Nemáte oprávnění" };

    const isUser1 = couple.user1_id === user.id;
    await supabase.from("couples").update(
        isUser1
            ? { user1_mood: mood, user1_mood_updated_at: new Date().toISOString() }
            : { user2_mood: mood, user2_mood_updated_at: new Date().toISOString() }
    ).eq("id", couple.id);

    // ← getPartnerId funguje i tady, couple.id je coupleId
    const partnerId = await getPartnerId(supabase, couple.id, user.id);
    if (partnerId) {
        const fullName = user.user_metadata.full_name || "Partner";
        await sendNotificationToUser(
            partnerId,
            "Nová nálada!",
            `${fullName} sdílel/a svou náladu: ${mood}`,
            "/dashboard",
        );
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function getOrCreateInviteCode(userId: string): Promise<ActionResult | string> {
    const supabase = await createClient();

    // Zkontroluj jestli už existuje pending couple
    const { data: existing } = await supabase
        .from("couples")
        .select("invite_code")
        .eq("user1_id", userId)
        .is("user2_id", null)
        .maybeSingle();

    if (existing?.invite_code) return existing.invite_code;

    const invite_code = nanoid(8).toUpperCase();

    const { error } = await supabase
        .from("couples")
        .insert({
            user1_id: userId,
            invite_code,
        });

    if (error) {
        console.error("getOrCreateInviteCode error:", error);
        return { success: false, error: "Nepodařilo se vytvořit kód." };
    }

    return invite_code;
}

export async function acceptInvite(inviteCode: string): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Nepřihlášen" };

    const { data: couple } = await supabase
        .from("couples")
        .select("*")
        .eq("invite_code", inviteCode)
        .is("user2_id", null)
        .single();

    if (!couple) return { success: false, error: "Neplatný kód" };
    if (couple.user1_id === user.id) return { success: false, error: "Nemůžeš se spárovat sám se sebou" };

    const { error } = await supabase
        .from("couples")
        .update({
            user2_id: user.id,
            invite_code: null,
        })
        .eq("id", couple.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard");
    return { success: true };
}