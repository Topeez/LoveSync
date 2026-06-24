"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile, updateAvatar } from "@/app/actions/profile";
import { useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import { Loader2, CalendarIcon, Camera } from "lucide-react";
import { Gender, Profile } from "@/types/profile";
import ActionButton from "../action-button";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import imageCompression from "browser-image-compression";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { CycleSettingsSection } from "./health-and-cycle";
// import router from "next/router";
// import {
//     Dialog,
//     DialogContent,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "../ui/dialog";
import { useUnsavedChanges } from "../unsaved-changes-context";

export function ProfileForm({ profile }: { profile: Profile }) {
    const { markDirty, markSaved } = useUnsavedChanges();

    const [isPending, startTransition] = useTransition();
    const [birthDate, setBirthDate] = useState<Date | undefined>(
        profile.birth_date ? new Date(profile.birth_date) : undefined,
    );

    const [gender, setGender] = useState<Gender>(
        (profile.gender as Gender) ?? "unknown",
    );

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
        (profile.avatar_url as string) || undefined,
    );

    // const [confirmOpen, setConfirmOpen] = useState(false);

    const initials =
        profile.full_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) ?? "JA";

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Vyberte prosím obrázek.");
            return;
        }

        setIsUploading(true);
        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 400,
                useWebWorker: true,
                fileType: "image/webp",
            });

            const formData = new FormData();
            formData.append("avatar", compressed);

            const result = await updateAvatar(formData);
            if (result?.success && result.data?.url) {
                setAvatarUrl(result.data.url);
                toast.success("Avatar aktualizován!");
            } else {
                toast.error(result?.error ?? "Nepodařilo se nahrát avatar.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Chyba při nahrávání.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
            const result = await updateProfile(null, formData);
            if (result?.success) {
                markSaved();
                toast.success("Nastavení uloženo");
            } else {
                toast.error(result?.error ?? "Něco se pokazilo");
            }
        });
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                onChange={markDirty}
                className="space-y-8 w-full max-w-3xl"
            >
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Avatar className="border-2 border-muted size-20">
                            <AvatarImage
                                src={avatarUrl}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <ActionButton
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="right-0 bottom-0 absolute flex justify-center items-center bg-primary hover:opacity-90 disabled:opacity-50 shadow-md rounded-full size-7 text-primary-foreground transition-opacity"
                        >
                            {isUploading ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <Camera className="size-3.5" />
                            )}
                        </ActionButton>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <div>
                        <p className="font-medium text-sm">Profilová fotka</p>
                        <p className="text-muted-foreground text-xs">
                            JPG, PNG nebo WebP. Max 5 MB.
                        </p>
                        <ActionButton
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="disabled:opacity-50 mt-1 text-foreground text-xs"
                        >
                            Změnit fotku
                        </ActionButton>
                    </div>
                </div>

                {/* Osobní údaje grid */}
                <div className="gap-4 grid md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Celé jméno</Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            defaultValue={profile.full_name || ""}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nickname">Přezdívka</Label>
                        <Input
                            id="nickname"
                            name="nickname"
                            defaultValue={profile.nickname || ""}
                            placeholder="Jak ti má říkat?"
                        />
                    </div>
                </div>

                {/* Datum narození */}
                <div className="flex flex-col space-y-2">
                    <Label>Datum narození</Label>
                    <input
                        type="hidden"
                        name="birth_date"
                        value={birthDate ? format(birthDate, "yyyy-MM-dd") : ""}
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <ActionButton
                                type="button"
                                variant="outline"
                                className={cn(
                                    "justify-start w-full md:w-70 font-normal text-left",
                                    !birthDate && "text-muted-foreground",
                                )}
                            >
                                <CalendarIcon className="mr-2 size-4" />
                                {birthDate ? (
                                    format(birthDate, "PPP", { locale: cs })
                                ) : (
                                    <span>Vyberte datum</span>
                                )}
                            </ActionButton>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto" align="start">
                            <Calendar
                                mode="single"
                                selected={birthDate}
                                onSelect={setBirthDate}
                                locale={cs}
                                disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                }
                                captionLayout="dropdown"
                                startMonth={new Date(1940, 0)}
                                endMonth={new Date()}
                            />
                        </PopoverContent>
                    </Popover>
                    <p className="text-muted-foreground text-xs">
                        Použije se pro zobrazení narozenin v kalendáři.
                    </p>
                </div>

                <div className="flex flex-col space-y-2">
                    <Label htmlFor="gender">Pohlaví</Label>
                    <Select
                        name="gender"
                        defaultValue={profile.gender ?? "unknown"}
                        onValueChange={(value) => setGender(value as Gender)}
                    >
                        <SelectTrigger className="w-full max-w-48">
                            <SelectValue placeholder="Vyberte pohlaví" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Muž</SelectItem>
                            <SelectItem value="female">Žena</SelectItem>
                            <SelectItem value="other">Jiné</SelectItem>
                            <SelectItem value="unknown">
                                Nechci uvádět
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {gender === "female" && <CycleSettingsSection />}

                {/* Bio */}
                <div className="space-y-2">
                    <Label htmlFor="bio">Bio / O mně</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        defaultValue={profile.bio || ""}
                        className="h-32 resize-none"
                        placeholder="Napiš něco o sobě..."
                    />
                </div>

                <div className="flex justify-center pt-4">
                    <ActionButton type="submit" disabled={isPending}>
                        {isPending && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Uložit změny
                    </ActionButton>
                </div>
            </form>

            {/* <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Neuložené změny</DialogTitle>
                    </DialogHeader>
                    <p className="mb-4 text-muted-foreground text-sm">
                        Máš neuložené změny. Opravdu chceš odejít bez uložení?
                    </p>
                    <DialogFooter className="flex justify-end gap-2">
                        <ActionButton
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Zůstat
                        </ActionButton>
                        <ActionButton
                            variant="destructive"
                            onClick={confirmLeave}
                        >
                            Odejít bez uložení
                        </ActionButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
        </>
    );
}
