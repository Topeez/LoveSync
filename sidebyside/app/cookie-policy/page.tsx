export const metadata = {
    title: "Zásady cookies – LoveSync",
};

export default function CookiePolicy() {
    return (
        <div className="px-4 py-12 text-foreground cs-container">
            <h1 className="mb-6 font-bold text-3xl">Zásady cookies</h1>
            <p className="mb-4 text-muted-foreground">
                Poslední aktualizace: {new Date().toLocaleDateString("cs-CZ")}
            </p>

            <div className="space-y-6">
                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        Co jsou cookies
                    </h2>
                    <p>
                        Cookies jsou malé textové soubory ukládané vaším
                        prohlížečem. Umožňují aplikaci zapamatovat si váš stav
                        přihlášení a preference.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        Jaké cookies používáme
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="mt-2 w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b text-muted-foreground text-left">
                                    <th className="pr-4 pb-2 font-medium">
                                        Název
                                    </th>
                                    <th className="pr-4 pb-2 font-medium">
                                        Účel
                                    </th>
                                    <th className="pb-2 font-medium">Typ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr>
                                    <td className="py-2 pr-4 font-mono text-xs">
                                        sb-*-auth-token
                                    </td>
                                    <td className="py-2 pr-4">
                                        Udržení přihlášení (Supabase session)
                                    </td>
                                    <td className="py-2">Nezbytné</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4 font-mono text-xs">
                                        theme
                                    </td>
                                    <td className="py-2 pr-4">
                                        Uložení zvoleného barevného tématu
                                        (světlé/tmavé)
                                    </td>
                                    <td className="py-2">Funkční</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-muted-foreground text-sm">
                        Nepoužíváme žádné sledovací, analytické ani marketingové
                        cookies.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        Správa cookies
                    </h2>
                    <p>
                        Cookies můžete kdykoli smazat nebo zakázat v nastavení
                        svého prohlížeče. Zakázání nezbytných cookies však může
                        způsobit, že přihlášení do aplikace nebude fungovat.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        Cookies třetích stran
                    </h2>
                    <p>
                        Při přihlášení přes Google OAuth může Google nastavit
                        vlastní cookies dle svých{" "}
                        <a
                            href="https://policies.google.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            zásad ochrany soukromí
                        </a>
                        .
                    </p>
                </section>
            </div>
        </div>
    );
}
