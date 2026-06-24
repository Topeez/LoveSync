import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ActionButton from "../action-button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

export function CycleSettingsSection() {
    const [lastPeriodStart, setLastPeriodStart] = useState<Date | undefined>();

    return (
        <div className="space-y-4">
            <h3 className="pb-1 border-b font-medium text-muted-foreground text-sm">
                Zdraví & cyklus
            </h3>

            <div className="space-y-2">
                <Label htmlFor="last_period_start">Poslední menstruace</Label>

                {/* hodnota pro server action */}
                <input
                    type="hidden"
                    name="last_period_start"
                    value={
                        lastPeriodStart
                            ? format(lastPeriodStart, "yyyy-MM-dd")
                            : ""
                    }
                />

                <Popover>
                    <PopoverTrigger asChild>
                        <ActionButton
                            type="button"
                            variant="outline"
                            className={cn(
                                "justify-start w-full md:w-70 font-normal text-foreground text-left",
                                !lastPeriodStart && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="mr-2 size-4" />
                            {lastPeriodStart ? (
                                format(lastPeriodStart, "PPP", { locale: cs })
                            ) : (
                                <span>Vyberte datum</span>
                            )}
                        </ActionButton>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                            mode="single"
                            selected={lastPeriodStart}
                            onSelect={setLastPeriodStart}
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
            </div>

            <div className="gap-4 grid grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="cycle_length_days">Délka cyklu (dní)</Label>
                    <Input
                        id="cycle_length_days"
                        name="cycle_length_days"
                        type="number"
                        min={21}
                        max={38}
                        defaultValue={28}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="period_length_days">
                        Délka menstruace (dní)
                    </Label>
                    <Input
                        id="period_length_days"
                        name="period_length_days"
                        type="number"
                        min={3}
                        max={8}
                        defaultValue={5}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="sharing_mode">Sdílení s partnerem</Label>
                <Select
                    name="sharing_mode"
                    defaultValue="share_phase_with_partner"
                >
                    <SelectTrigger className="w-full max-w-64">
                        <SelectValue placeholder="Vyber..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="private">Jen já</SelectItem>
                        <SelectItem value="share_phase_with_partner">
                            Sdílet fázi s partnerem
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
