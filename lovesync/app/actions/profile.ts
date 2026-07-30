"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ProfileSchema } from "@/lib/schemas";
import { DashboardLayoutType } from "@/types/profile";
import { ActionResult } from "@/types/actions";


export async function updateProfile(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Nejste přihlášen." };

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
    birth_date: formData.get("birth_date")
      ? new Date(formData.get("birth_date") as string)
      : undefined,
    gender: formData.get("gender") || undefined,
  };

  const validatedFields = ProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    if (process.env.NODE_ENV === "development") {
        console.log("Validation errors:", validatedFields.error.flatten());
    }

    return {
        success: false,
        error: "Chyba validace: Zkontrolujte zadané údaje.",
    };
}

  const { error } = await supabase
    .from("profiles")
    .update(validatedFields.data)
    .eq("id", user.id);

  if (error) {
    return {
      success: false,
      error: "Chyba při ukládání: " + error.message,
    };
  }

  revalidatePath(`/profile/${user.id}`);
  return { success: true };
}

export async function updateTheme(theme: string): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {  success: false, error: "Nejste přihlášen" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ theme })
        .eq("id", user.id);

    if (error) {
        console.error("Error updating theme:", error);
        return { success: false, error: "Chyba při ukládání vzhledu" };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateLayout(layout: DashboardLayoutType): Promise<ActionResult>{
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if(!user) {
    return { success: false, error: "Nejste přihlášen" };
  } 

  const { error } = await supabase
  .from("profiles")
    .update({ dashboard_layout: layout })
    .eq("id", user.id);

  if(error) {
    console.error("Error updating layout:", error);
    return { success: false, error: "Chyba při ukládání vzhledu" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateAvatar(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  const file = formData.get("avatar") as File;
  if (!file) {
    return { success: false, error: "Chybí soubor s novým avatarem." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Nejste přihlášen." };
  }

  const fileName = `${user.id}/avatar.webp`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    console.error("Avatar upload error:", uploadError);
    return {
      success: false,
      error: "Nepodařilo se nahrát obrázek. Zkuste to prosím znovu.",
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  const cacheBustedUrl = `${publicUrl}?v=${Date.now()}`;

  const { error: updateProfileError } = await supabase
    .from("profiles")
    .update({ avatar_url: cacheBustedUrl })
    .eq("id", user.id);

  if (updateProfileError) {
    console.error("Avatar profile update error:", updateProfileError);
    return {
      success: false,
      error: "Avatar se nahrál, ale nepodařilo se uložit profil.",
    };
  }

  const { error: updateAuthError } = await supabase.auth.updateUser({
    data: { avatar_url: publicUrl },
  });

  if (updateAuthError) {
    console.error("Avatar auth update error:", updateAuthError);
    return {
      success: false,
      error: "Avatar se nahrál, ale nepodařilo se aktualizovat účet.",
    };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/couple");
  revalidatePath("/dashboard/profile");

  return {
    success: true,
    data: { url: publicUrl },
  };
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
