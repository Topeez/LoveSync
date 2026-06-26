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
                    alt="LoveSync logo"
                    className="mx-auto mb-4 size-12"
                />
                <p className="mt-5 text-muted-foreground text-sm text-center leading-6">
                    © {new Date().getFullYear()} LoveSync. Všechna práva
                    vyhrazena.
                </p>
                <div className="flex sm:flex-row flex-col justify-center items-center space-x-4 mt-8 font-semibold text-foreground text-sm leading-6">
                    <Link
                        href="/privacy-policy"
                        className="hover:text-secondary duration-200 ease-in-out"
                    >
                        Zásady ochrany osobních údajů
                    </Link>
                    <Separator
                        orientation="vertical"
                        className="hidden sm:inline bg-foreground h-4"
                    />
                    <Link
                        href="/terms-of-service"
                        className="hover:text-secondary duration-200 ease-in-out"
                    >
                        Podmínky použití
                    </Link>
                    <Separator
                        orientation="vertical"
                        className="hidden sm:inline bg-foreground h-4"
                    />
                    <Link
                        href="/cookie-policy"
                        className="hover:text-secondary duration-200 ease-in-out"
                    >
                        Cookies
                    </Link>
                    <Separator
                        orientation="vertical"
                        className="hidden sm:inline bg-foreground h-4"
                    />
                    <Link
                        href="/changelog"
                        className="hover:text-secondary duration-200 ease-in-out"
                    >
                        Changelog
                    </Link>
                </div>
            </div>
        </footer>
    );
}
