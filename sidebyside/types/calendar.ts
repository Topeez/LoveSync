import { Event } from "@/types/event";
import { Profile } from "@/types/profile";

export type CalendarItem = Event & {
    is_birthday?: boolean;
    is_anniversary?: boolean;
    couple_id: string;
    created_at: string;
    description?: string | null;
    type?: string | null;
    isOptimistic?: boolean;
};

export interface CalendarWidgetProps {
    events: Event[];
    coupleId: string;
    relationshipStart?: string | Date | null;
    userProfile?: Profile | null;
    partnerProfile?: Profile | null;
    cycle?: {
        last_period_start: string;
        cycle_length_days: number;
        period_length_days: number;
        sharing_mode: string;
    } | null;
}

export type OptimisticAction =
    | { type: "ADD"; event: Event }
    | { type: "DELETE"; id: string }
    | { type: "UPDATE"; event: Event };
