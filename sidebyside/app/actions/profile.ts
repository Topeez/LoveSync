"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ProfileSchema } from "@/lib/schemas";
import { v4 as uuidv4 } from 'uuid';
import { DashboardLayoutType } from "@/types/profile";


export async function updateProfile(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { message: "Nejste přihlášen" };

  // Vytáhneme data z FormData
    const rawData = {
    full_name: formData.get("full_name"), 
    nickname: formData.get("nickname") || undefined,
    bio: formData.get("bio") || undefined,
    clothing_size_top: formData.get("clothing_size_top") || undefined,
    clothing_size_bottom: formData.get("clothing_size_bottom") || undefined,
    shoe_size: formData.get("shoe_size") || undefined,
    ring_size: formData.get("ring_size") || undefined,
    love_language: formData.get("love_language") || undefined,
    favorite_color: formData.get("favorite_color") || undefined,
    birth_date: formData.get("birth_date") ? new Date(formData.get("birth_date") as string) : undefined
  };

  // Validace
  const validatedFields = ProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
      // Pro jistotu si to vypiš do terminálu, kdyby tam bylo ještě něco
      console.log("Validation errors:", validatedFields.error.flatten().fieldErrors);
      
      return {
          success: false,
          message: "Chyba validace: Zkontrolujte zadané údaje.",
          errors: validatedFields.error.flatten().fieldErrors
      };
  }

  // Update v databázi
  const { error } = await supabase
    .from("profiles")
    .update(validatedFields.data)
    .eq("id", user.id);

  if (error) {
    return { message: "Chyba při ukládání: " + error.message };
  }

  // Překreslíme stránku profilu
  revalidatePath(`/profile/${user.id}`);
  
  return { message: "Uloženo úspěšně", success: true };
}

export async function updateTheme(theme: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Nejste přihlášen");
    }

    const { error } = await supabase
        .from("profiles")
        .update({ theme })
        .eq("id", user.id);

    if (error) {
        console.error("Error updating theme:", error);
        throw new Error("Chyba při ukládání vzhledu");
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateLayout(layout: DashboardLayoutType){
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if(!user) {
    throw new Error("Nejste přihlášen");
  } 

  const { error } = await supabase
  .from("profiles")
    .update({ dashboard_layout: layout })
    .eq("id", user.id);

  if(error) throw new Error("Chyba při ukládání vzhledu");

  revalidatePath("/dashboard");
}

export async function updateAvatar(formData: FormData) {
    const file = formData.get("avatar") as File;
    if (!file) return { success: false };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    const fileName = `${user.id}/${uuidv4()}.webp`;

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

    if (uploadError) {
        console.error("Avatar upload error:", uploadError);
        return { success: false };
    }

    const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

    await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);


    await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/couple");
    revalidatePath("/dashboard/profile");  
    return { success: true, url: publicUrl };
}

export async function updateNotificationPreferences(prefs: Record<string, boolean>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    const { error } = await supabase
        .from("profiles")
        .update({ notification_preferences: prefs })
        .eq("id", user.id);

    if (error) return { success: false };
    return { success: true };
}

export async function updateFont(font: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    const { error } = await supabase
        .from("profiles")
        .update({ font })
        .eq("id", user.id);

    if (error) return { success: false };

    revalidatePath("/dashboard");
    return { success: true };
}
