import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LoginButton from "@/components/login-button";

export default async function InvitePage({
    searchParams,
}: {
    searchParams: Promise<{ code: string }>; // V Next.js 15 je searchParams Promise
}) {
    const { code } = await searchParams; // Partnerovo ID (kdo zve)

    if (!code) {
        return redirect("/"); // Neplatný odkaz -> domů
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 1. Pokud uživatel není přihlášený -> poslat na login
    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center p-4 min-h-screen text-center">
                <h1 className="mb-4 font-bold text-2xl">Skoro tam!</h1>
                <p className="mb-8 text-stone-600">
                    Pro přijetí pozvánky se musíš přihlásit.
                </p>
                {/* Tady bys ideálně měl dát <LoginButton /> s parametrem redirectTo */}
                <LoginButton nextUrl={`/invite?code=${code}`} />
            </div>
        );
    }

    // 2. Pokud JE přihlášený -> zkontrolujeme, jestli nejde o toho samého člověka
    if (user.id === code) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>
                    Nemůžeš pozvat sám sebe, blázínku!{" "}
                    <Link href="/dashboard" className="underline">
                        Zpět
                    </Link>
                </p>
            </div>
        );
    }

    // 3. Vytvoříme pár v DB
    // Nejdřív zkusíme zjistit, jestli už spolu nejsou
    const { data: existingCouple } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${code},user2_id.eq.${code}`)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single();

    if (existingCouple) {
        // Už jsou v páru (nebo jeden z nich)
        return redirect("/dashboard?msg=already_paired");
    }

    // Vložíme nový pár
    const { error } = await supabase.from("couples").insert({
        user1_id: code, // Ten kdo zval (Partner 1)
        user2_id: user.id, // Ten kdo přišel (Partner 2 - Ty)
    });

    if (error) {
        console.error("Chyba při párování:", error);
        return <div>Něco se pokazilo při spojování... Zkus to znovu.</div>;
    }

    // 4. Hotovo -> Dashboard
    return redirect("/dashboard?welcome=true");
}
