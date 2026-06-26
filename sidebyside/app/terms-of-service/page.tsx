import Link from "next/link";

export const metadata = {
    title: "Podmínky použití - LoveSync",
};

export default function TermsOfService() {
    return (
        <div className="px-4 py-12 text-foreground cs-container">
            <h1 className="mb-6 font-bold text-3xl">Podmínky použití</h1>
            <p className="mb-4 text-muted-foreground">
                Poslední aktualizace: {new Date().toLocaleDateString("cs-CZ")}
            </p>

            <div className="space-y-6">
                <section>
                    <h2 className="mb-2 font-semibold text-xl">1. Úvod</h2>
                    <p>
                        Používáním aplikace <strong>LoveSync</strong> (dále jen
                        &quot;Aplikace&quot;) souhlasíte s těmito podmínkami
                        použití. Aplikace je vyvíjena jako osobní/studentský
                        projekt a je poskytována zdarma a bez záruky.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        2. Podmínky přístupu
                    </h2>
                    <ul className="space-y-1 pl-5 list-disc">
                        <li>
                            Aplikaci smíte používat pouze pro osobní, nekomerční
                            účely.
                        </li>
                        <li>
                            Pro používání je nutné být starší 16 let, nebo mít
                            souhlas zákonného zástupce.
                        </li>
                        <li>
                            Je zakázáno zneužívat Aplikaci k šíření nezákonného,
                            urážlivého nebo škodlivého obsahu.
                        </li>
                        <li>
                            Je zakázáno pokoušet se o neoprávněný přístup k
                            datům jiných uživatelů.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        3. Uživatelský obsah
                    </h2>
                    <p>
                        Veškerý obsah, který do Aplikace vložíte (fotky, texty,
                        poznámky, události), zůstává vaším vlastnictvím.
                        Poskytujete nám pouze nezbytné oprávnění k jeho
                        zobrazení v rámci Aplikace. Nejsme odpovědni za obsah,
                        který vloží váš partner.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        4. Citlivé údaje
                    </h2>
                    <p>
                        Funkce sledování menstruačního cyklu je dobrovolná.
                        Zadáním těchto údajů souhlasíte s jejich zpracováním
                        výhradně pro účely zobrazení v rámci Aplikace. Sdílení s
                        partnerem je volitelné a kdykoli jej lze vypnout.
                        Podrobnosti v{" "}
                        <Link
                            href="/privacy-policy"
                            className="text-primary hover:underline"
                        >
                            Zásadách ochrany osobních údajů
                        </Link>
                        .
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        5. Dostupnost a záruky
                    </h2>
                    <p>
                        Aplikace je poskytována &quot;tak, jak je&quot; (as-is)
                        bez jakékoli záruky dostupnosti nebo bezchybnosti.
                        Vývojář si vyhrazuje právo Aplikaci kdykoli upravit,
                        pozastavit nebo ukončit – s předchozím upozorněním,
                        pokud to bude možné.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        6. Omezení odpovědnosti
                    </h2>
                    <p>
                        Vývojář nenese odpovědnost za jakékoli přímé ani nepřímé
                        škody vzniklé používáním Aplikace, včetně ztráty dat.
                        Zdravotní informace zobrazované v Aplikaci (cyklus) jsou
                        pouze orientační a nenahrazují lékařskou péči.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        7. Změny podmínek
                    </h2>
                    <p>
                        Tyto podmínky můžeme aktualizovat. O podstatných změnách
                        budeme informovat v{" "}
                        <Link
                            href="/changelog"
                            className="text-primary hover:underline"
                        >
                            Changelogu
                        </Link>{" "}
                        nebo přímo v aplikaci. Dalším používáním Aplikace po
                        změně podmínek vyjadřujete souhlas s novými podmínkami.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">8. Kontakt</h2>
                    <p>
                        Dotazy k podmínkám zasílejte na:{" "}
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
