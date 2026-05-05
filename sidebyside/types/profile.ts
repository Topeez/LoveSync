export interface Profile {
  full_name: string | null;
  nickname: string | null;
  email: string | null;
  bio: string | null;
  clothing_size_top: string | null;
  clothing_size_bottom: string | null;
  shoe_size: string | null;
  ring_size: string | null;
  love_language: string | null;
  favorite_color: string | null;
  [key: string]: string | Date | null;
  birth_date: Date | null;
}

export interface ProfileData {
  id: string; // user ID
  email: string;
  full_name: string;
  nickname?: string;
  avatar_url?: string;
  couple_id?: string;
}

export type DashboardLayoutType = "default" | "focus" | "calendar";

const VALID_LAYOUTS: DashboardLayoutType[] = ["default", "focus", "calendar"];

export function isValidLayout(value: string | null | undefined): DashboardLayoutType | undefined {
    if (!value) return undefined;
    return VALID_LAYOUTS.includes(value as DashboardLayoutType)
        ? (value as DashboardLayoutType)
        : undefined;
}