'use server'

import { notifyPartner } from "@/lib/couple-utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const coupleId = formData.get("coupleId") as string;
  const type = formData.get("type") as string;
  
  const dateFrom = formData.get("dateFrom") as string;
  const dateTo = formData.get("dateTo") as string;
  
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;

  if (!title || !dateFrom || !startTimeStr) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

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
  });

  if (error) {
    console.error("Chyba při insertu events:", error);
    throw new Error("Database insert failed"); 
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
}

export async function updateEvent(eventId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;
    const dateFrom = formData.get("dateFrom") as string;
    const dateTo = formData.get("dateTo") as string;
    const startTimeStr = formData.get("startTime") as string;
    const endTimeStr = formData.get("endTime") as string;

    if (!title || !dateFrom || !startTimeStr) return { success: false };

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
        return { success: false };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", eventId);
  revalidatePath("/dashboard");
}
