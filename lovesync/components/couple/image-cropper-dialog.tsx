"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { getCroppedImg, PixelCrop } from "@/lib/crop-image";
import { toast } from "sonner";
import ActionButton from "../action-button";

interface ImageCropperDialogProps {
    isOpen: boolean;
    imageSrc: string | null;
    onClose: () => void;
    onCropSave: (croppedFile: File) => Promise<void>;
    isUploading: boolean;
    aspectRatio?: number;
    title?: string;
}

export default function ImageCropperDialog({
    isOpen,
    imageSrc,
    onClose,
    onCropSave,
    isUploading,
    aspectRatio = 16 / 9,
    title = "Oříznout obrázek",
}: ImageCropperDialogProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] =
        useState<PixelCrop | null>(null);

    const onCropComplete = (
        croppedArea: Area,
        croppedAreaPixels: PixelCrop,
    ) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        try {
            // Zavoláme naši utilitu pro vytažení souboru
            const croppedFile = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
            );
            // Předáme hotový File zpět do hlavní komponenty
            await onCropSave(croppedFile);
        } catch (error) {
            console.error(error);
            toast.error("Chyba při ořezu obrázku.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-full max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="relative bg-slate-900 rounded-md w-full h-100 overflow-hidden">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    )}
                </div>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <ActionButton
                        variant="destructive"
                        onClick={onClose}
                        disabled={isUploading}
                    >
                        Zrušit
                    </ActionButton>
                    <ActionButton
                        disabled={isUploading || !imageSrc}
                        onClick={handleSave}
                    >
                        {isUploading && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Uložit
                    </ActionButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
