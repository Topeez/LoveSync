import { useOptimistic, startTransition, useEffect } from "react";
import {
  format,
  addYears,
  setYear,
  startOfDay,
  isBefore,
  differenceInYears,
} from "date-fns";
import { Event } from "@/types/event";
import { Profile } from "@/types/profile";
import { createEvent, deleteEvent } from "@/app/actions/events";
import { toast } from "sonner";
import { CalendarItem, OptimisticAction } from "@/types/calendar";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface UseCalendarEventsProps {
  events: Event[];
  coupleId: string;
  relationshipStart?: string | Date | null;
  userProfile?: Profile | null;
  partnerProfile?: Profile | null;
}

export function useCalendarEvents({
  events,
  coupleId,
  relationshipStart,
  userProfile,
  partnerProfile,
}: UseCalendarEventsProps) {
  const [optimisticEvents, updateOptimisticEvents] = useOptimistic(
    events,
    (state: Event[], action: OptimisticAction) => {
      if (action.type === "ADD")
        return [...state, { ...action.event, isOptimistic: true }];
      if (action.type === "UPDATE")
        return state.map((e) => (e.id === action.event.id ? action.event : e));
      if (action.type === "DELETE")
        return state.filter((e) => e.id !== action.id);
      return state;
    },
  );

  useEffect(() => {
    if (!coupleId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`events-${coupleId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload: RealtimePostgresChangesPayload<Event>) => {
          const newRow = (payload.new as Event | null) ?? undefined;
          const oldRow = (payload.old as Event | null) ?? undefined;

          startTransition(() => {
            switch (payload.eventType) {
              case "INSERT":
                if (!newRow) return;
                updateOptimisticEvents({
                  type: "ADD",
                  event: {
                    ...newRow,
                    couple_id: newRow.couple_id ?? coupleId,
                  },
                });
                break;

              case "UPDATE":
                if (!newRow) return;
                updateOptimisticEvents({
                  type: "UPDATE",
                  event: {
                    ...newRow,
                    couple_id: newRow.couple_id ?? coupleId,
                  },
                });
                break;

              case "DELETE":
                if (!oldRow) return;
                updateOptimisticEvents({
                  type: "DELETE",
                  id: oldRow.id,
                });
                break;
            }
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId, updateOptimisticEvents]);

  const handleAddEvent = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const dateFrom = formData.get("dateFrom") as string;
    const startTimeStr = formData.get("startTime") as string;
    const type = formData.get("type") as string;
    const location = formData.get("location") as string;
    const endTimeStr = formData.get("endTime") as string;
    const dateTo = formData.get("dateTo") as string;

    if (!title || !dateFrom || !startTimeStr) return;

    const startIso = new Date(`${dateFrom}T${startTimeStr}`).toISOString();
    let endIso: string | null = null;

    if (endTimeStr) {
      endIso = new Date(`${dateTo || dateFrom}T${endTimeStr}`).toISOString();
    } else if (dateTo && dateTo !== dateFrom) {
      endIso = new Date(`${dateTo}T00:00:00`).toISOString();
    }

    const newEvent: Event = {
      id: Math.random().toString(),
      title,
      start_time: startIso,
      end_time: endIso,
      location,
      couple_id: coupleId,
      created_at: new Date().toISOString(),
      type: type || "date",
      description: null,
      color: null,
      creator_id: "me",
    };

    startTransition(() =>
      updateOptimisticEvents({ type: "ADD", event: newEvent }),
    );

    try {
      const result = await createEvent(formData);

      if (!result.success) {
        startTransition(() =>
          updateOptimisticEvents({ type: "DELETE", id: newEvent.id }),
        );
        toast.error(result.error ?? "Nepodařilo se vytvořit událost.");
      }
    } catch {
      startTransition(() =>
        updateOptimisticEvents({ type: "DELETE", id: newEvent.id }),
      );
      toast.error("Nepodařilo se vytvořit událost.");
    }
  };

  const handleUpdateEvent = async (updated: CalendarItem) => {
    startTransition(() =>
      updateOptimisticEvents({ type: "UPDATE", event: updated }),
    );
  };

  const handleDeleteEvent = async (eventId: string) => {
    const previous = optimisticEvents.find((e) => e.id === eventId);

    startTransition(() =>
      updateOptimisticEvents({ type: "DELETE", id: eventId }),
    );

    try {
      const result = await deleteEvent(eventId);

      if (!result.success) {
        if (previous) {
          startTransition(() =>
            updateOptimisticEvents({ type: "ADD", event: previous }),
          );
        }
        toast.error(result.error ?? "Nepodařilo se smazat událost.");
      } else {
        toast.success("Událost smazána.");
      }
    } catch {
      if (previous) {
        startTransition(() =>
          updateOptimisticEvents({ type: "ADD", event: previous }),
        );
      }
      toast.error("Nepodařilo se smazat událost.");
    }
  };

  // --- Buildování items ---
  const items: CalendarItem[] = optimisticEvents.map((e) => ({
    ...e,
    couple_id: (e as unknown as CalendarItem).couple_id || coupleId,
    created_at:
      (e as unknown as CalendarItem).created_at || new Date().toISOString(),
    color: e.color || "#E27D60",
  }));

  // Narozeniny
  const addBirthday = (
    profile: Profile | null | undefined,
    title: string,
  ) => {
    if (!profile?.birth_date) return;
    const bdayDate = new Date(profile.birth_date);
    const currentYear = new Date().getFullYear();
    items.push({
      id: `bday-${title}-${currentYear}`,
      title,
      start_time: new Date(
        currentYear,
        bdayDate.getMonth(),
        bdayDate.getDate(),
      ).toISOString(),
      end_time: null,
      location: "Oslava?",
      is_birthday: true,
      couple_id: coupleId,
      created_at: new Date().toISOString(),
    });
  };

  addBirthday(userProfile, "Moje narozeniny 🎂");
  addBirthday(
    partnerProfile,
    `${partnerProfile?.nickname || "Partner"} má narozeniny 🎉`,
  );

  // Výročí
  if (relationshipStart) {
    const startDate = startOfDay(new Date(relationshipStart));
    if (!Number.isNaN(startDate.getTime())) {
      const today = startOfDay(new Date());
      const candidate = startOfDay(setYear(startDate, today.getFullYear()));
      const next = isBefore(candidate, today)
        ? addYears(candidate, 1)
        : candidate;
      const years = differenceInYears(next, startDate);

      items.push({
        id: `anniv-${format(next, "yyyy")}`,
        title: years > 0 ? `Výročí ${years}. rok ❤️` : "Výročí ❤️",
        start_time: next.toISOString(),
        end_time: null,
        location: "Oslava?",
        is_anniversary: true,
        couple_id: coupleId,
        created_at: new Date().toISOString(),
        type: "other",
        color: "#FF4D6D",
      });
    }
  }

  // Mapa datum -> CalendarItem[]
  const eventsMap: Record<string, CalendarItem[]> = {};
  items.forEach((event) => {
    const current = startOfDay(new Date(event.start_time));
    const end = startOfDay(
      event.end_time ? new Date(event.end_time) : new Date(event.start_time),
    );

    while (current <= end) {
      const dateKey = format(current, "yyyy-MM-dd");
      if (!eventsMap[dateKey]) eventsMap[dateKey] = [];
      eventsMap[dateKey].push(event);
      current.setDate(current.getDate() + 1);
    }
  });

  return { eventsMap, handleAddEvent, handleUpdateEvent, handleDeleteEvent };
}
