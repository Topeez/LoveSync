'use server'

import { notifyPartner } from "@/lib/couple-utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/actions";

export async function createEvent(formData: FormData): Promise<ActionResult> {
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const coupleId = formData.get("coupleId") as string;
  const type = formData.get("type") as string;
  
  const dateFrom = formData.get("dateFrom") as string;
  const dateTo = formData.get("dateTo") as string;
  
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;

  const notifyBefore = formData.get("notifyBefore") as string;

  if (!title || !dateFrom || !startTimeStr) {
    return { success: false, error: "Chybí název nebo datum/čas události." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Uživatel není přihlášen." };
  }

  const startIso = new Date(`${dateFrom}T${startTimeStr}`).toISOString();
  
  let endIso = null;
  
  if (endTimeStr) {
      const endDateBase = dateTo || dateFrom; 
      endIso = new Date(`${endDateBase}T${endTimeStr}`).toISOString();
  } else if (dateTo && dateTo !== dateFrom) {
      endIso = new Date(`${dateTo}T00:00:00`).toISOString();
  }

  const { error } = await supabase.from("events").insert({
    title,
    location,
    start_time: startIso,
    end_time: endIso,
    couple_id: coupleId,
    created_by: user.id,
    type: type || 'other',
    notify_before: notifyBefore ? parseInt(notifyBefore as string): null,
  });

  if (error) {
    console.error("createEvent error:", error);
    return {
      success: false,
      error: "Nepodařilo se uložit událost. Zkus to prosím znovu.",
    };
  }

  const fullName = user.user_metadata.full_name || "Partner";
  const dateDisplay = dateTo && dateTo !== dateFrom
    ? `${dateFrom} - ${dateTo}`
    : dateFrom;

  await notifyPartner({
    supabase,
    coupleId,
    userId: user.id,
    fullName,
    title: `Nová akce: ${title} 📅`,
    message: `${fullName} přidal(a) novou událost. Kdy: ${dateDisplay} v ${startTimeStr}`,
    link: "/dashboard",
    type: "events", 
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateEvent(eventId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Uživatel není přihlášen." };

  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;
  const dateFrom = formData.get("dateFrom") as string;
  const dateTo = formData.get("dateTo") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;

  if (!title || !dateFrom || !startTimeStr) {
    return { success: false, error: "Chybí název nebo datum/čas události." };
  }

  const startIso = new Date(`${dateFrom}T${startTimeStr}`).toISOString();
  let endIso: string | null = null;
  if (endTimeStr) {
      endIso = new Date(`${dateTo || dateFrom}T${endTimeStr}`).toISOString();
  } else if (dateTo && dateTo !== dateFrom) {
      endIso = new Date(`${dateTo}T00:00:00`).toISOString();
  }

  const { error } = await supabase
      .from("events")
      .update({
          title,
          location: location || null,
          start_time: startIso,
          end_time: endIso,
          type: type || "other",
      })
      .eq("id", eventId);

  if (error) {
    console.error("updateEvent error:", error);
    return {
      success: false,
      error: "Nepodařilo se upravit událost. Zkus to prosím znovu.",
    };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteEvent(eventId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Uživatel není přihlášen." };

  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    console.error("deleteEvent error:", error);
    return {
      success: false,
      error: "Nepodařilo se smazat událost. Zkus to prosím znovu.",
    };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
