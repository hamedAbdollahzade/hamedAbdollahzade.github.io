/** Locale helpers: Persian is the default (served at /), English lives under /en/. */

export type Locale = "fa" | "en";

export const LOCALES: Locale[] = ["fa", "en"];
export const DEFAULT_LOCALE: Locale = "fa";

export const DIR: Record<Locale, "rtl" | "ltr"> = {fa: "rtl", en: "ltr"};
export const OG_LOCALE: Record<Locale, string> = {fa: "fa_IR", en: "en_US"};

/** Prefixes an internal path with the locale ("/about/" -> "/en/about/" for English). */
export function localePath(locale: Locale, path: string): string {
    if (locale === DEFAULT_LOCALE) return path;
    if (path === "/") return "/en/";
    if (path.startsWith("/#")) return `/en/${path.slice(1)}`;
    return `/en${path}`;
}

/** Splits a pathname into its locale and the locale-free path ("/en/about/" -> en, "/about/"). */
export function parsePath(pathname: string): {locale: Locale; path: string} {
    if (pathname === "/en" || pathname.startsWith("/en/")) {
        const rest = pathname.slice(3) || "/";
        return {locale: "en", path: rest.startsWith("/") ? rest : `/${rest}`};
    }
    return {locale: "fa", path: pathname || "/"};
}

/** Paths that exist in both languages (articles exist only in Persian). */
const TRANSLATED = [/^\/$/, /^\/about\/$/, /^\/developers\/$/, /^\/developers\/[^/]+\/$/, /^\/services\/[^/]+\/$/, /^\/projects\/[^/]+\/$/, /^\/blog\/$/, /^\/explore\/$/, /^\/explore\/[^/]+\/$/];

/** The equivalent page in the other language; articles fall back to the tutorials index, other pages to the home page. */
export function switchLocalePath(pathname: string, target: Locale): string {
    const {path} = parsePath(pathname);
    const exists = TRANSLATED.some((re) => re.test(path));
    const fallback = path.startsWith("/blog/") ? "/blog/" : "/";
    return localePath(target, exists ? path : fallback);
}
