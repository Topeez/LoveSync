import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import InviteButton from "@/components/dashboard/invite-button";
import { LoveNoteCard } from "@/components/dashboard/love-note-card";
import { TodoList } from "@/components/dashboard/todo/todo-list";
import { CalendarWidget } from "@/components/dashboard/calendar/calendar-widget";
import { ClosestEvent } from "@/components/dashboard/closest-event";
import { CoupleProfileWidget } from "@/components/dashboard/couple-profile-widget";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Link from "next/link";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import { EmailChangeNotice } from "@/components/dashboard/email-change-notice";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-full cs-container">
                <p className="text-muted">Nepodařilo se načíst uživatele.</p>
                <Link href="/" className="ml-2 text-primary hover:underline">
                    Zpět na hlavní stránku
                </Link>
            </div>
        );
    }

    // 1. Načteme Pár
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

    const isUser1 = couple?.user1_id === user.id;
    let noteToDisplay = couple?.love_note || "";

    if (couple?.love_note_updated_at) {
        const lastUpdate = new Date(couple.love_note_updated_at);
        const now = new Date();
        const diffInHours =
            (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

        // Pokud je starší než 24 hodin, vymažeme ji (jen pro zobrazení)
        if (diffInHours > 24) {
            noteToDisplay = "";
            // Volitelně: Můžeš sem poslat i informaci, že "Včerejší vzkaz vypršel"
        }
    } else {
        noteToDisplay = "";
    }

    // 2. Načteme Profily
    let userProfile = null;
    let partnerProfile = null;

    // Můj profil
    const { data: myProfileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
    userProfile = myProfileData;

    // Partnerův profil (pokud existuje pár)
    if (couple && !pendingCouple && partnerProfile === null) {
        const partnerId =
            couple.user1_id === user.id ? couple.user2_id : couple.user1_id;

        // Pro jistotu přidáme kontrolu, že partnerId není null
        // (kdyby náhodou byla v databázi anomálie)
        if (partnerId) {
            const { data: pData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", partnerId)
                .single();
            partnerProfile = pData;
        }
    }

    // 3. Načteme Úkoly
    let todos = [];
    if (couple) {
        const { data } = await supabase
            .from("todos")
            .select("*")
            .eq("couple_id", couple.id)
            .order("created_at", { ascending: false });
        todos = data || [];
    }

    // 4. Načteme Události
    let events = [];
    let nextEvent = null;
    if (couple) {
        const now = new Date().toISOString();
        // Nejbližší akce
        const { data: nextEventData } = await supabase
            .from("events")
            .select("*")
            .eq("couple_id", couple.id)
            .gte("start_time", now)
            .order("start_time", { ascending: true })
            .limit(1)
            .maybeSingle();
        nextEvent = nextEventData;

        // Všechny akce pro kalendář
        const { data: allEventsData } = await supabase
            .from("events")
            .select("*")
            .eq("couple_id", couple.id);
        events = allEventsData || [];
    }

    const eventContent =
        couple && !pendingCouple ? (
            <ClosestEvent
                nextEvent={nextEvent}
                hasCouple={!!couple}
                coupleId={couple?.id}
            />
        ) : (
            <Card className="inset-shadow-primary inset-shadow-xs col-span-12 md:col-span-8 bg-primary/15 border-none h-full">
                <CardContent>
                    <div className="mb-2 font-bold text-foreground text-2xl">
                        Naplánujte si něco hezkého se svou polovičkou.
                    </div>
                    <p className="mb-6 text-muted-foreground">
                        Ale nejprv si ji/ho musíš přidat!
                    </p>
                    <div className="flex items-center gap-2 scale-90 origin-left">
                        <InviteButton
                            userId={user.id}
                            className="bg-primary hover:bg-primary-foreground"
                        />
                        <span className="text-muted-foreground">
                            Pozvi svou polovičku
                        </span>
                    </div>
                </CardContent>
            </Card>
        );

    const noteContent =
        couple && !pendingCouple ? (
            <LoveNoteCard
                initialNote={noteToDisplay}
                coupleId={couple.id}
                authorId={couple.love_note_author_id}
                currentUserId={user.id}
            />
        ) : (
            <Card className="inset-shadow-secondary inset-shadow-xs col-span-12 md:col-span-3 lg:col-span-4 bg-secondary/15 border-none">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-medium text-secondary text-sm">
                        <Heart className="fill-secondary size-4" />
                        Love Note
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center h-24">
                    <p className="mb-3 text-muted-foreground text-xs">
                        Tady si budete psát vzkazy.
                    </p>
                    <div className="flex items-center gap-2 scale-90 origin-left">
                        <InviteButton userId={user.id} />
                        <span className="text-muted-foreground">
                            Pozvi svou polovičku
                        </span>
                    </div>
                </CardContent>
            </Card>
        );

    const todoContent =
        couple && !pendingCouple ? (
            <TodoList todos={todos} coupleId={couple.id} />
        ) : (
            <Card className="inset-shadow-muted inset-shadow-xs col-span-12 md:col-span-4 border-none h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <ShoppingBag className="size-4" /> Úkoly
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-48 text-muted-foreground">
                    Zatím jsi na to sám/sama.
                </CardContent>
            </Card>
        );
    const calendarContent = couple ? (
        <CalendarWidget
            events={events}
            coupleId={couple.id}
            userProfile={userProfile}
            relationshipStart={couple?.relationship_start}
            partnerProfile={partnerProfile}
        />
    ) : (
        <Card className="inset-shadow-muted inset-shadow-xs bg-card border-none h-full">
            <CardHeader>
                <CardTitle>Kalendář</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-48 text-muted-foreground">
                (Kalendář se aktivuje po spárování)
            </CardContent>
        </Card>
    );

    const profileContent =
        couple && !pendingCouple ? (
            <CoupleProfileWidget
                userProfile={userProfile}
                partnerProfile={partnerProfile}
                relationshipStart={couple?.relationship_start}
            />
        ) : (
            <div className="flex justify-center items-center opacity-50 border border-dashed rounded-lg h-full text-muted-foreground text-xs">
                Místo pro profil páru
            </div>
        );

    return (
        <div className="mx-auto p-4 md:p-8" suppressHydrationWarning>
            {/* --- HEADER --- */}
            <DashboardHeader />

            {userProfile && (
                <div className="mb-6">
                    <OnboardingChecklist
                        userProfile={{ ...userProfile, couple_id: null }}
                        hasActiveCouple={!!couple}
                        eventsCount={events.length}
                        hasLoveNote={
                            !!(
                                couple &&
                                (isUser1
                                    ? couple.user1_wrote_note
                                    : couple.user2_wrote_note)
                            )
                        }
                    />
                </div>
            )}

            <EmailChangeNotice />

            <DashboardGrid
                eventSlot={eventContent}
                noteSlot={noteContent}
                todoSlot={todoContent}
                calendarSlot={calendarContent}
                profileSlot={profileContent}
            />
        </div>
    );
}
