# LoveSync

> **Plánujte společně, žijte lépe.**
> Aplikace pro páry, která sjednocuje sdílený kalendář, úkoly a společné plány na jedno místo.

[![Deployment Status](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://side-by-side-nu.vercel.app/)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Storage-green?logo=supabase)
![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-blue?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

## Live Demo

Vyzkoušejte aplikaci živě: **[love-sync-pwa.vercel.app](https://love-sync-pwa.vercel.app)**

---

## O projektu

**LoveSync** je moderní webová aplikace navržená pro páry, které chtějí mít pořádek ve společném čase. Řeší klasický problém "kdy máš čas?" a "co musíme zařídit?" tím, že nabízí **sdílený prostor pro plánování**.

Kromě organizace času slouží i jako digitální památník vztahu – od počítání společných dnů až po ukládání vzpomínek. Projekt vznikl jako univerzitní práce se zaměřením na moderní technologie React ekosystému.

## Hlavní funkce

### Sdílený Kalendář

To nejdůležitější na jednom místě.

- **Synchronizované plánování:** Oba partneři vidí stejné události v reálném čase.
- **Kategorie událostí:** Snadné rozlišení mezi rande, povinnostmi nebo cestováním.
- **Přehledný měsíční/týdenní pohled.**

### Společný To-Do List

Už žádné zapomenuté nákupy nebo úkoly do domácnosti.

- **Sdílené úkoly:** Přidávejte úkoly, které vidí oba.
- **Stavy:** Odškrtávání hotových věcí.
- **Prioritizace:** Zvýraznění toho, co hoří.

### Couple Dashboard

- **Vztah v číslech:** Sledování počtu dní a let spolu ("Level" systém).
- **Odpočet výročí:** Progress bar do dalšího milníku.
- **Cover Photo:** Možnost nahrát vlastní společnou fotku na pozadí profilu.
- **Bucket list a Milestones:** Můžete se partnerem/kou si zapisovat co byste nejraději podnikli nebo jaká byla vaše vztahová cesta.

### Love Notes

- Posílání rychlých zamilovaných vzkazů pro partnera.
- Plná podpora **Emoji** ve formulářích i výpisu 🫶.

## Zdraví - Sledování menstruačního cyklu partnerky

- Partnerka si může nastavit cyklus a propíše se jí do kalendáře s podbarvením podle fáze cyklu.
- Partner může sledovat na dashboardu ve vlastním widgetu aktuální fázi cyklu jeho partnerky, počet dnů do další fáze a také tipy jak se má chovat.

## Personalizace

Aplikace se přizpůsobí vašemu stylu.

- **Barevná schémata:** Výběr z 7 motivů (Rose, Blue, Violet, Orange, Green, Yellow, Slate).
- **Dark Mode:** Plná podpora tmavého režimu pro noční plánování.
- **Různé písma:** V aplikaci máte na výběr ze 4 fontů, můžete si vybrat který se vám líbí.
- **3 typy layoutu:** Ve verzi na PC si můžete upravit layout ze 3 předchystaných layoutů.

## Tech Stack

**Frontend:**

- [Next.js 16](https://nextjs.org/) (App Router, Server Actions, React Compiler)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (využití `@theme`, CSS proměnných)
- [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
- [Lucide React](https://lucide.dev/) (Ikony)
- **Validace:** Zod & React Hook Form
- **Kalendář:** Date-fns

**Backend & Data:**

- [Supabase](https://supabase.com/) (Backend-as-a-Service)
- **Databáze:** PostgreSQL
- **Auth:** Supabase Auth (Email/Password, OAuth. Google Auth)
- **Storage:** Supabase Storage (pro ukládání fotek)
- **Security:** Row Level Security (RLS) policies

## Instalace a spuštění lokálně

1. **Klonování repozitáře:**
    ```bash
    git clone https://github.com/Topeez/LoveSync.git
    cd LoveSync
    ```
2. **Instalace závislostí:**
   `npm install`

3. **Nastavení prostředí:**
    ````NEXT_PUBLIC_SUPABASE_URL=https://vas-projekt.supabase.co
       NEXT_PUBLIC_SUPABASE_ANON_KEY=vas-anon-klic```
    ````
