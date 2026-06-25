import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="px-4 py-12 text-foreground cs-container">
            <h1 className="mb-6 font-bold text-3xl">
                Zásady ochrany osobních údajů (Privacy Policy)
            </h1>
            <p className="mb-4 text-muted-foreground">
                Poslední aktualizace: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-6">
                <section>
                    <h2 className="mb-2 font-semibold text-xl">1. Úvod</h2>
                    <p>
                        Aplikace <strong>SideBySide</strong> (dále jen
                        &quot;Aplikace) je vyvíjena jako studentský/osobní
                        projekt. Respektujeme vaše soukromí a zavazujeme se
                        chránit veškeré osobní údaje, které s námi sdílíte.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        2. Jaké údaje shromažďujeme
                    </h2>
                    <ul className="space-y-1 pl-5 list-disc">
                        <li>
                            <strong>Google Účet:</strong> Při přihlášení přes
                            Google získáváme váš e-mail, jméno a profilovou
                            fotku (avatar).
                        </li>
                        <li>
                            <strong>Uživatelský obsah:</strong> Data, která do
                            aplikace sami vložíte (datum začátku vztahu,
                            společné fotografie, poznámky &quot;Love
                            Notes&quot;, události v kalendáři).
                        </li>
                        <li>
                            <strong>Technická data:</strong> Cookies nezbytné
                            pro udržení přihlášení (session).
                        </li>
                    </ul>
                    <h2 className="my-2 font-semibold text-lg">
                        2b. Zdravotní a citlivé údaje
                    </h2>
                    <p>
                        Aplikace umožňuje ženám volitelně zadat údaje o
                        menstruačním cyklu (datum poslední menstruace, délka
                        cyklu). Tato data považujeme za{" "}
                        <strong>
                            citlivé osobní údaje zdravotního charakteru
                        </strong>{" "}
                        a zpracováváme je s nejvyšší opatrností:
                    </p>
                    <ul className="space-y-1 mt-2 pl-5 list-disc">
                        <li>
                            Zadání těchto údajů je zcela{" "}
                            <strong>dobrovolné</strong>.
                        </li>
                        <li>
                            Data jsou viditelná výhradně vám, případně vašemu
                            partnerovi v aplikaci – a pouze pokud sdílení sami
                            zapnete.
                        </li>
                        <li>
                            Nejsou sdílena s žádnou třetí stranou, analyzována
                            ani použita k jiným účelům než k zobrazení v rámci
                            aplikace.
                        </li>
                        <li>
                            Sdílení s partnerem lze kdykoliv vypnout v nastavení
                            profilu.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        3. Jak údaje využíváme
                    </h2>
                    <p>
                        Vaše údaje používáme výhradně pro zajištění funkčnosti
                        aplikace:
                    </p>
                    <ul className="space-y-1 pl-5 list-disc">
                        <li>
                            K vytvoření a správě vašeho uživatelského profilu.
                        </li>
                        <li>K propojení s vaším partnerem v rámci aplikace.</li>
                        <li>
                            K ukládání vašich vzpomínek a plánování v kalendáři.
                        </li>
                        <li>
                            <strong>
                                Nikdy neprodáváme vaše data třetím stranám ani
                                je nevyužíváme k marketingu.
                            </strong>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        4. Služby třetích stran
                    </h2>
                    <p>
                        Pro provoz aplikace využíváme ověřené služby třetích
                        stran:
                    </p>
                    <ul className="space-y-1 pl-5 list-disc">
                        <li>
                            <strong>Supabase:</strong> Poskytovatel databáze a
                            autentizace. Data jsou uložena na jejich
                            zabezpečených serverech.
                        </li>
                        <li>
                            <strong>Google OAuth:</strong> Pro bezpečné
                            přihlášení.
                        </li>
                        <li>
                            <strong>Vercel:</strong> Pro hosting webové
                            aplikace.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        5. Práva uživatele
                    </h2>
                    <p>Máte právo kdykoliv požádat o:</p>
                    <ul className="space-y-1 pl-5 list-disc">
                        <li>Výpis všech údajů, které o vás evidujeme.</li>
                        <li>
                            Úplné smazání vašeho účtu a všech souvisejících dat
                            (fotky, poznámky).
                        </li>
                        <li>
                            Smazání konkrétních citlivých údajů (cyklus) bez
                            nutnosti smazání celého účtu – v nastavení profilu,
                            sekce Zdraví & cyklus.
                        </li>
                    </ul>
                    <p className="mt-2">
                        Pro smazání účtu nás kontaktujte na níže uvedeném emailu
                        nebo využijte funkci v nastavení profilu (pokud je
                        dostupná).
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">6. Kontakt</h2>
                    <p>
                        Pokud máte jakékoliv dotazy ohledně ochrany soukromí,
                        kontaktujte vývojáře na emailu: <br />
                        <Link
                            href="mailto:topetopinka7@seznam.cz"
                            className="text-primary hover:underline"
                        >
                            topetopinka7@seznam.cz
                        </Link>
                    </p>
                </section>
            </div>
        </div>
    );
}
