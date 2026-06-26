import { ReactNode } from "react";
import { Calendar, Share2, CheckCircle2 } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import FAQ from "@/components/faq";
import HowItWorks from "@/components/how-it-works";

export default function LandingPage() {
    return (
        <>
            <Header />
            <div className="flex flex-col bg-background min-h-screen">
                {" "}
                {/* Off-white pozadí */}
                <main className="flex-1">
                    {/* HERO SECTION */}
                    <Hero />

                    {/* FEATURES GRID */}
                    <section className="mx-auto px-4 py-16 max-w-5xl -translate-y-14">
                        <div className="gap-8 grid md:grid-cols-3">
                            <FeatureCard
                                icon={
                                    <Calendar className="size-10 text-secondary" />
                                }
                                title="Společný kalendář"
                                desc="Propoj si svůj Google účet s aplikací a vidíš, kdy má partner čas. Už žádné dvojité bookingy."
                            />
                            <FeatureCard
                                icon={
                                    <Share2 className="size-10 text-secondary" />
                                }
                                title="Sdílené nápady"
                                desc="Všechny nápady na dárky, filmy a výlety na jednom místě. Přidej teď, rozhodněte se později."
                            />
                            <FeatureCard
                                icon={
                                    <CheckCircle2 className="size-10 text-secondary" />
                                }
                                title="Žádné zapomínání"
                                desc="Notifikace na výročí a společné úkoly. Myšlení na detaily nech na nás."
                            />
                        </div>

                        <h2 className="mt-12 font-bold text-2xl sm:text-4xl text-center">
                            A mnoho dalších funkcí!
                        </h2>
                    </section>

                    <HowItWorks />

                    <FAQ />
                </main>
            </div>
            <Footer />
        </>
    );
}

function FeatureCard({
    icon,
    title,
    desc,
}: {
    icon: ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div className="flex flex-col items-center bg-card shadow-sm hover:shadow-md p-6 border border-muted rounded-2xl text-center transition-shadow md:even:-translate-y-8">
            <div className="mb-4">{icon}</div>
            <h2 className="mb-2 font-bold text-foreground text-xl">{title}</h2>
            <p className="text-muted-foreground">{desc}</p>
        </div>
    );
}
