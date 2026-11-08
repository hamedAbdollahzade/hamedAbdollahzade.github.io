"use client";

import Link from "next/link";
import {getBrand, getProjects, getServices} from "@/data/localized";
import {localePath} from "@/lib/locale";
import {waLink} from "@/lib/site";
import {Logo} from "./Icons";
import {useLocale} from "./LocaleProvider";

export default function Footer() {
    const {locale, t} = useLocale();
    const brand = getBrand(locale);
    const to = (path: string) => localePath(locale, path);

    return (
        <footer className="site-footer">
            <div className="footer-cols">
                <div className="footer-brand">
                    <Link className="brand" href={to("/")} style={{padding: 0}}><span className="brand-mark"><Logo/></span><span>{brand.name}</span></Link>
                    <p>{t.footer.about(brand.city)}</p>
                </div>
                <div><h2>{t.footer.services}</h2><ul>
                    {getServices(locale).map((s) => <li key={s.slug}><Link href={to(`/services/${s.slug}/`)}>{s.title}</Link></li>)}
                </ul></div>
                <div><h2>{t.footer.projects}</h2><ul>
                    {getProjects(locale).map((p) => <li key={p.slug}><Link href={to(`/projects/${p.slug}/`)}>{p.title}</Link></li>)}
                </ul></div>
                <div><h2>{t.footer.company}</h2><ul>
                    <li><Link href={to("/about/")}>{t.footer.aboutUs}</Link></li>
                    <li><Link href={to("/developers/")}>{t.footer.developers}</Link></li>
                    <li><Link href={to("/blog/")}>{t.footer.learn}</Link></li>
                    <li><a href="/resume.html">{t.footer.resume}</a></li>
                    <li><Link href={to("/#faq")}>{t.footer.faq}</Link></li>
                </ul></div>
                <div><h2>{t.footer.contact}</h2><ul>
                    <li><a href={`tel:${brand.phone}`} dir="ltr">{brand.phoneDisplay}</a></li>
                    <li><a href={waLink(t.chat.defaultWa)} target="_blank" rel="noopener noreferrer">{t.footer.whatsapp}</a></li>
                    <li><a href={`mailto:${brand.email}`} dir="ltr">{brand.email}</a></li>
                    <li><a href="https://github.com/hamedAbdollahzade" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                    <li><a href="https://www.linkedin.com/in/hamed-abdollahzade" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                </ul></div>
            </div>
            <p className="footer-copy">© {new Date().getFullYear()} {brand.name}. {t.footer.rights}</p>
        </footer>
    );
}
