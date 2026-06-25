import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { ProfileForm } from "@/components/profile/profile-form";
import { PasswordForm } from "@/components/settings/password-form";
import { DeleteAccount } from "@/components/settings/delete-account";
import { RelationshipForm } from "@/components/settings/relationships-form";
import { AppearanceForm } from "@/components/settings/appearance-form";
import { PartnerCard } from "@/components/settings/partner-card";
import { ChangeEmailForm } from "@/components/settings/change-email-form";
import { ThemeToggleWrapper } from "@/components/theme-switcher-wrapper";
import { UserNav } from "@/components/dashboard/user-nav";

import { NotificationSettings } from "@/components/settings/notification-settings";
import { UnsavedChangesProvider } from "@/components/unsaved-changes-context";
import { SettingsTabs } from "@/components/settings/settings-tabs-wrapper";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";
import { GuardedLink } from "@/components/guarded-link";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const supabase = await createClient();

    // 1. Auth check
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/");

    // 2. Načtení profilu
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-40 text-xl cs-container">
                Profil nenalezen.
            </div>
        );
    }

    // 3. Načtení vztahu
    const { data: couple } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .not("user2_id", "is", null)
        .maybeSingle();

    const { data: pendingCouple } = await supabase
        .from("couples")
        .select("invite_code")
        .eq("user1_id", user.id)
        .is("user2_id", null)
        .maybeSingle();

    // 4. Načtení partnera (pokud existuje)
    let partnerProfile = null;
    if (couple && !pendingCouple) {
        const partnerId =
            couple.user1_id === user.id ? couple.user2_id : couple.user1_id;
        const { data } = await supabase
            .from("profiles")
            .select(
                "nickname, full_name, avatar_url, bio, birth_date, love_language",
            )
            .eq("id", partnerId)
            .single();
        partnerProfile = data;
    }

    return (
        <UnsavedChangesProvider>
            <div className="space-y-8 py-10 max-w-4xl cs-container">
                {/* Hlavička */}
                <div className="flex justify-between items-center space-y-2">
                    <div>
                        <h2 className="font-bold text-2xl tracking-tight">
                            Nastavení
                        </h2>
                        <p className="text-muted-foreground">
                            Spravuj svůj účet a preference.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <GuardedLink
                            href="/dashboard"
                            aria-label="Zpět na dashboard"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative bg-accent shadow-md border border-muted rounded-full text-muted-foreground hover:text-foreground"
                            >
                                <LayoutDashboard />
                            </Button>
                        </GuardedLink>
                        <ThemeToggleWrapper />
                        <UserNav
                            id={user.id}
                            email={user.email ?? ""}
                            avatar_url={profile.avatar_url ?? ""}
                            couple_id={couple?.id ?? ""}
                            full_name={user.user_metadata?.full_name ?? ""}
                        />
                    </div>
                </div>

                <Separator />
                <UnsavedChangesDialog />

                {/* Záložky */}

                <SettingsTabs defaultValue="profile">
                    <TabsList className="grid grid-cols-4 w-full">
                        <TabsTrigger value="profile">Profil</TabsTrigger>
                        <TabsTrigger
                            value="relationship"
                            disabled={!couple}
                            title={
                                !couple
                                    ? "Nejprve se spáruj s partnerem"
                                    : undefined
                            }
                        >
                            Vztah
                        </TabsTrigger>
                        <TabsTrigger value="appearance">Vzhled</TabsTrigger>
                        <TabsTrigger value="account">Účet</TabsTrigger>
                    </TabsList>

                    {/* Obsah - Profil */}
                    <TabsContent value="profile">
                        <div className="space-y-6 mx-auto mt-6 p-6 border rounded-lg w-full max-w-3xl">
                            <div>
                                <h3 className="font-medium text-lg">
                                    Osobní údaje
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Toto uvidí tvůj partner.
                                </p>
                            </div>
                            <Separator />
                            <ProfileForm profile={profile} />
                        </div>
                    </TabsContent>

                    {/* Obsah - Vztah */}
                    <TabsContent value="relationship">
                        <div className="space-y-6 mx-auto mt-6 p-6 border rounded-lg w-full max-w-3xl">
                            <div>
                                <h3 className="font-medium text-lg">
                                    Nastavení vztahu
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Společná data, která se zobrazují oběma.
                                </p>
                            </div>
                            <Separator />
                            {couple && !pendingCouple && (
                                <div className="space-y-6">
                                    {partnerProfile && (
                                        <div className="space-y-2">
                                            <p className="font-medium text-sm">
                                                Tvůj partner
                                            </p>
                                            <PartnerCard {...partnerProfile} />
                                        </div>
                                    )}
                                    <Separator />
                                    <RelationshipForm
                                        coupleId={couple.id}
                                        initialDate={couple.relationship_start}
                                    />
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Obsah - Vzhled */}
                    <TabsContent
                        value="appearance"
                        className="space-y-6 mt-6 p-6 border rounded-lg"
                    >
                        <div>
                            <h3 className="font-medium text-lg">Vzhled</h3>
                            <p className="text-muted-foreground text-sm">
                                Přizpůsob si vzhled svého dashboardu.
                            </p>
                        </div>
                        <Separator />
                        <AppearanceForm />
                    </TabsContent>

                    {/* Obsah - Účet */}
                    <TabsContent value="account">
                        <div className="space-y-6 mx-auto mt-6 p-6 border rounded-lg w-full max-w-3xl">
                            <div>
                                <h3 className="font-medium text-lg">
                                    Přihlašovací údaje
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Tvůj email pro přihlášení.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Aktuální email</Label>
                                <Input
                                    value={user.email ?? ""}
                                    disabled
                                    className="bg-muted max-w-lg"
                                />
                            </div>
                            <Separator />
                            <ChangeEmailForm />
                            <Separator />

                            <div>
                                <h3 className="font-medium text-lg">
                                    Změna hesla
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Zvol si silné heslo pro ochranu svého účtu.
                                </p>
                            </div>
                            <PasswordForm />

                            <Separator />
                            <NotificationSettings
                                initialPrefs={
                                    profile.notification_preferences ?? {}
                                }
                            />

                            <Separator />
                            <div className="flex justify-between items-center bg-destructive/10 p-6 border border-destructive/50 rounded-lg">
                                <div>
                                    <h3 className="font-medium text-destructive">
                                        Nebezpečná zóna
                                    </h3>
                                    <p className="text-destructive/80 text-sm">
                                        Smazání účtu je nevratné.
                                    </p>
                                </div>
                                <DeleteAccount />
                            </div>
                        </div>
                    </TabsContent>
                </SettingsTabs>
            </div>
        </UnsavedChangesProvider>
    );
}
