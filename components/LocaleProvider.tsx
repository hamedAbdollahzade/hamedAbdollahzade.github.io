"use client";

import {createContext, useContext} from "react";
import type {ReactNode} from "react";
import {DEFAULT_LOCALE} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {UI} from "@/lib/ui";
import type {UiDict} from "@/lib/ui";

interface LocaleValue {locale: Locale; t: UiDict}

const LocaleContext = createContext<LocaleValue>({locale: DEFAULT_LOCALE, t: UI[DEFAULT_LOCALE]});

/** Gives client components the active locale and its interface strings. */
export function LocaleProvider({locale, children}: {locale: Locale; children: ReactNode}) {
    return <LocaleContext.Provider value={{locale, t: UI[locale]}}>{children}</LocaleContext.Provider>;
}

/** Active locale and interface dictionary. */
export function useLocale(): LocaleValue {
    return useContext(LocaleContext);
}
