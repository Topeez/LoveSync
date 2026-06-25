"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBucketItem } from "@/app/actions/couple";
import {
    Plus,
    ImageOff,
    CalendarIcon,
    CalendarClock,
    Construction,
    Check,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ActionButton from "@/components/action-button";
import { toast } from "sonner";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

export function AddBucketItemDialog({ coupleId }: { coupleId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState<Date>();

    // State pro preview obrázku
    const [imageUrl, setImageUrl] = useState("");
    const [isImageValid, setIsImageValid] = useState(true);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setImageUrl(url);
        setIsImageValid(true); // Resetujeme validitu při změně URL
    };

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);

        // Zavoláme server action
        const result = await createBucketItem(formData);

        setIsLoading(false);

        if (!result?.success) {
            toast.error(result.error ?? "Něco se pokazilo");
            setIsOpen(true);
            // Reset formuláře řeší zavření dialogu (Next.js server action resetuje form automaticky, pokud nepoužíváme JS submit, ale tady je to hybrid)
            return;
        } else {
            setIsOpen(false);
            toast.success(result?.success || "Nový sen uložen!");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <ActionButton>
                    <Plus className="size-4" />{" "}
                    <span className="hidden sm:block">Přidat sen</span>
                </ActionButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Nový sen do Bucket Listu</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="gap-4 grid py-4">
                    <input type="hidden" name="coupleId" value={coupleId} />

                    <div className="gap-2 grid">
                        <Label htmlFor="title">Co chcete zažít?</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Např. Cesta kolem světa, Naučit se tančit..."
                            required
                            autoFocus
                        />
                    </div>

                    <div className="gap-2 grid">
                        <Label htmlFor="image_url">Obrázek (URL)</Label>
                        <Input
                            placeholder="https://example.com/obrazek.jpg"
                            id="image_url"
                            name="image_url"
                            value={imageUrl}
                            onChange={handleImageChange}
                        />

                        {imageUrl && (
                            <div className="relative flex justify-center items-center bg-muted/50 mt-2 border rounded-lg w-full h-40 overflow-hidden">
                                {isImageValid ? (
                                    <Image
                                        src={imageUrl}
                                        alt="Preview"
                                        className="size-full object-cover"
                                        onError={() => setIsImageValid(false)}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-muted-foreground text-sm">
                                        <ImageOff className="opacity-50 size-6" />
                                        <span>Obrázek nelze načíst</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="gap-2 grid">
                        <Label htmlFor="status">Stav</Label>
                        <Select name="status" defaultValue="planned">
                            <SelectTrigger>
                                <SelectValue placeholder="Vyber stav" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="planned">
                                    Plánujeme{" "}
                                    <CalendarClock className="text-destructive" />
                                </SelectItem>
                                <SelectItem value="in_progress">
                                    Pracujeme na tom{" "}
                                    <Construction className="text-amber-400" />
                                </SelectItem>
                                <SelectItem value="completed">
                                    Splněno <Check className="text-green-400" />
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="gap-2 grid">
                        <Label>Cílové datum (volitelné)</Label>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start w-full font-normal text-left",
                                        !date && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 w-4 h-4" />
                                    {date ? (
                                        format(date, "PPP", { locale: cs })
                                    ) : (
                                        <span>Vybrat datum</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="p-0 w-auto"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    autoFocus
                                    locale={cs}
                                />
                            </PopoverContent>
                        </Popover>

                        <input
                            type="hidden"
                            name="target_date"
                            value={date ? date.toISOString() : ""}
                        />
                    </div>

                    <ActionButton type="submit" isLoading={isLoading}>
                        Přidat na seznam
                    </ActionButton>
                </form>
            </DialogContent>
        </Dialog>
    );
}
