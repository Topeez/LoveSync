"use client";

import * as React from "react";

export type ThemeColor =
    | "default"
    | "rose"
    | "blue"
    | "violet"
    | "orange"
    | "green"
    | "yellow"
    | "slate"
    | "sage";
interface ThemeColorContextType {
    themeColor: ThemeColor;
    setThemeColor: (theme: ThemeColor) => void;
}

const ThemeColorContext = React.createContext<ThemeColorContextType>({
    themeColor: "default",
    setThemeColor: () => {},
});

export function useThemeColor() {
    return React.useContext(ThemeColorContext);
}

interface ThemeColorProviderProps {
    children: React.ReactNode;
    initialTheme?: string | null;
}

export function ThemeColorProvider({
    children,
    initialTheme,
}: ThemeColorProviderProps) {
    // Inicializujeme stav HNED z propu
    const [themeColor, setThemeColorState] = React.useState<ThemeColor>(
        (initialTheme as ThemeColor) || "default",
    );

    const setThemeColor = (color: ThemeColor) => {
        setThemeColorState(color);
    };

    // Tento efekt zajistí, že se atribut nastaví okamžitě po hydrataci
    // a také při jakékoliv změně v budoucnu
    React.useEffect(() => {
        const body = document.body;

        // Pro jistotu vyčistíme starý atribut
        body.removeAttribute("data-theme");

        if (themeColor !== "default") {
            body.setAttribute("data-theme", themeColor);
        }
    }, [themeColor]);

    return (
        <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeColorContext.Provider>
    );
}
