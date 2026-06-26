import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import {
    Geist,
    Geist_Mono,
    Playfair_Display,
    Nunito,
    Inter,
} from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#E27D60",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: "LoveSync - Sdílený kalendář a plánování pro páry",
        template: "%s | LoveSync",
    },
    description:
        "Zjednodušte si společný život. LoveSync je aplikace pro páry, která nabízí sdílený kalendář, úkoly, nákupní seznamy a prostor pro vaše vzpomínky. Zaregistrujte se zdarma.",
    applicationName: "LoveSync",
    authors: [{ name: "Topeeez", url: "https://topeeez.cz" }],
    keywords: [
        "vztah",
        "pár",
        "plánování",
        "kalendář",
        "sdílené úkoly",
        "love note",
        "aplikace pro páry",
    ],
    metadataBase: new URL("https://side-by-side-nu.vercel.app"),

    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        title: "LoveSync",
        statusBarStyle: "default",
    },

    openGraph: {
        type: "website",
        locale: "cs_CZ",
        url: "https://side-by-side-nu.vercel.app",
        title: "LoveSync - Sdílený kalendář, úkoly a plánování pro páry",
        description:
            "Zjednodušte si společný život. LoveSync je aplikace pro páry, která nabízí sdílený kalendář, úkoly, nákupní seznamy a prostor pro vaše vzpomínky. Zaregistrujte se zdarma.",
        siteName: "LoveSync",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "LoveSync Aplikace Náhled",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "LoveSync - Aplikace pro páry",
        description: "Plánujte společně, žijte lépe. Kalendář a úkoly pro dva.",
        images: ["/android-chrome-192x192.png"],
    },

    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },

    // boboti od googlu
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="cs"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${nunito.variable} ${inter.variable}`}
        >
            <body
                suppressHydrationWarning
                className="bg-background min-h-screen text-foreground antialiased"
            >
                <main>{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
