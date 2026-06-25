"use client";

import { useState } from "react";
import ActionButton from "@/components/action-button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMilestone } from "@/app/actions/couple";
import {
    Plus,
    Heart,
    Home,
    Plane,
    Circle,
    Baby,
    Car,
    Star,
    MapPin,
    CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

const ICONS = [
    { id: "heart", icon: Heart, label: "Láska" },
    { id: "home", icon: Home, label: "Domov" },
    { id: "plane", icon: Plane, label: "Cesta" },
    { id: "ring", icon: Circle, label: "Výročí" },
    { id: "baby", icon: Baby, label: "Rodina" },
    { id: "car", icon: Car, label: "Auto" },
    { id: "map", icon: MapPin, label: "Místo" },
    { id: "star", icon: Star, label: "Jiné" },
];

export function AddMilestoneDialog({ coupleId }: { coupleId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState("heart");
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <ActionButton>
                    <Plus className="size-4" />
                    <span className="hidden sm:block">Přidat milník</span>
                </ActionButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Nový milník</DialogTitle>
                </DialogHeader>

                <form
                    action={async (formData) => {
                        if (date) formData.set("date", date.toISOString());
                        await createMilestone(formData);
                        setIsOpen(false);
                        setDate(undefined);
                    }}
                    className="gap-4 grid py-4"
                >
                    <input type="hidden" name="coupleId" value={coupleId} />
                    <input type="hidden" name="icon" value={selectedIcon} />

                    <div className="gap-2 grid">
                        <Label htmlFor="title">Název</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Např. První dovolená"
                            required
                        />
                    </div>

                    <div className="gap-2 grid">
                        <Label>Datum</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "justify-start w-full font-normal text-left",
                                        !date && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 size-4" />
                                    {date ? (
                                        format(date, "PPP", { locale: cs })
                                    ) : (
                                        <span>Vyberte datum</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-auto">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    autoFocus
                                    locale={cs}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="gap-2 grid">
                        <Label>Ikona</Label>
                        <div className="flex flex-wrap gap-2">
                            {ICONS.map((item) => {
                                const Icon = item.icon;
                                const isSelected = selectedIcon === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSelectedIcon(item.id)}
                                        className={cn(
                                            "hover:bg-muted p-2 border rounded-md transition-all",
                                            isSelected
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-muted text-muted-foreground",
                                        )}
                                        title={item.label}
                                    >
                                        <Icon className="size-5" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="gap-2 grid">
                        <Label htmlFor="description">Popis (volitelné)</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Krátká poznámka..."
                        />
                    </div>

                    <ActionButton type="submit">Uložit vzpomínku</ActionButton>
                </form>
            </DialogContent>
        </Dialog>
    );
}
