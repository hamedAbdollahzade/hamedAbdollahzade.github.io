import Link from "next/link";
import Shell from "@/components/Shell";
import {localePath} from "@/lib/locale";
import type {Locale} from "@/lib/locale";
import {UI} from "@/lib/ui";

/** The 404 content in the given language. */
export default function NotFoundView({locale}: {locale: Locale}) {
    const t = UI[locale].notFound;
    return (
        <Shell>
            <div className="card" style={{textAlign: "center", padding: "56px 20px"}}>
                <h1 className="page-title">{t.title}</h1>
                <p className="page-lead" style={{marginInline: "auto"}}>{t.text}</p>
                <div className="btn-row" style={{justifyContent: "center", marginTop: 22}}>
                    <Link className="btn" href={localePath(locale, "/")}>{t.home}</Link>
                    <Link className="btn btn--ghost" href={localePath(locale, "/blog/")}>{t.learn}</Link>
                </div>
            </div>
        </Shell>
    );
}
