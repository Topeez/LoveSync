import Link from "next/link";
import Image from "next/image";
import { Separator } from "./ui/separator";

export default function Footer() {
    return (
        <footer className="py-6 text-muted-foreground text-sm text-center cs-container">
            <div className="py-10 border-slate-900/5 border-t">
                <Image
                    src="/android-chrome-192x192.png"
                    width={192}
                    height={192}
                    alt="SideBySide logo"
                    className="mx-auto mb-4 size-12"
                />
                <p className="mt-5 text-muted-foreground text-sm text-center leading-6">
                    © {new Date().getFullYear()} SideBySide. Všechna práva
                    vyhrazena.
                </p>
                <div className="flex sm:flex-row flex-col justify-center items-center space-x-4 mt-8 font-semibold text-foreground text-sm leading-6">
                    <Link href="/privacy-policy">
                        Zásady ochrany osobních údajů
                    </Link>
                    <Separator
                        orientation="vertical"
                        className="hidden sm:inline bg-foreground h-4"
                    />
                    <Link href="/terms-of-service">Podmínky použití</Link>
                    <Separator
                        orientation="vertical"
                        className="hidden sm:inline bg-foreground h-4"
                    />
                    <Link href="/cookie-policy">Cookies</Link>
                    <Separator
                        orientation="vertical"
                        className="hidden sm:inline bg-foreground h-4"
                    />
                    <Link href="/changelog">Changelog</Link>
                </div>
            </div>
        </footer>
    );
}
