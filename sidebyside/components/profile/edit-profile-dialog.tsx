"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProfile } from "@/app/actions/profile";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Profile } from "@/types/profile";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}: EditProfileDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(null, formData);

      if (result?.success) {
        toast.success("Profil aktualizován");
        onOpenChange(false);
      } else {
        toast.error(result?.error ?? "Něco se pokazilo");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upravit profil</DialogTitle>
          <DialogDescription>
            Udělej změny ve svém profilu. Klikni na uložit, až budeš hotov.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="gap-6 grid py-4">
          <div className="space-y-4">
            <h3 className="pb-1 border-b font-medium text-muted-foreground text-sm">
              Základní info
            </h3>
            <div className="gap-4 grid grid-cols-2">
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
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Něco o mně (Bio)</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio || ""}
                placeholder="Co máš rád/a?"
                className="resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="pb-1 border-b font-medium text-muted-foreground text-sm">
              Velikosti (Tahák pro partnera)
            </h3>
            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clothing_size_top">Tričko / Top</Label>
                <Input
                  id="clothing_size_top"
                  name="clothing_size_top"
                  placeholder="XS, S, M..."
                  defaultValue={profile.clothing_size_top || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clothing_size_bottom">Kalhoty / Spodek</Label>
                <Input
                  id="clothing_size_bottom"
                  name="clothing_size_bottom"
                  placeholder="32/34, M..."
                  defaultValue={profile.clothing_size_bottom || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shoe_size">Boty</Label>
                <Input
                  id="shoe_size"
                  name="shoe_size"
                  placeholder="38, 42..."
                  defaultValue={profile.shoe_size || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ring_size">Prstýnek</Label>
                <Input
                  id="ring_size"
                  name="ring_size"
                  placeholder="52, 54..."
                  defaultValue={profile.ring_size || ""}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="pb-1 border-b font-medium text-muted-foreground text-sm">
              Detaily
            </h3>
            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="love_language">Jazyk lásky</Label>
                <Select
                  name="love_language"
                  defaultValue={profile.love_language || "Slova ujištění"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyber..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slova ujištění">
                      Slova ujištění
                    </SelectItem>
                    <SelectItem value="Skutky služby">
                      Skutky služby
                    </SelectItem>
                    <SelectItem value="Dárky">Dárky</SelectItem>
                    <SelectItem value="Pozornost (Čas)">
                      Pozornost (Čas)
                    </SelectItem>
                    <SelectItem value="Fyzický kontakt">
                      Fyzický kontakt
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="favorite_color">Oblíbená barva (HEX)</Label>
                <div className="flex gap-2">
                  <Input
                    id="favorite_color"
                    name="favorite_color"
                    type="color"
                    className="p-1 w-12 h-10 cursor-pointer"
                    defaultValue={profile.favorite_color || "#000000"}
                  />
                  <Input
                    type="text"
                    placeholder="#000000"
                    name="favorite_color_text"
                    defaultValue={profile.favorite_color || ""}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="text-background"
            >
              {isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Uložit změny
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
