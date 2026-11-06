import Link from "next/link";
import {PROJECTS} from "@/data/projects";
import {BRAND, SERVICES} from "@/data/services";
import {waLink} from "@/lib/site";
import {Logo} from "./Icons";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-cols">
                <div className="footer-brand">
                    <Link className="brand" href="/" style={{padding: 0}}><span className="brand-mark"><Logo/></span><span>{BRAND.name}</span></Link>
                    <p>تیم توسعه وب و نرم‌افزار در {BRAND.city}. ایده‌ی شما را به محصولی واقعی تبدیل می‌کنیم.</p>
                </div>
                <div><h2>خدمات</h2><ul>
                    {SERVICES.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}/`}>{s.title}</Link></li>)}
                </ul></div>
                <div><h2>نمونه‌کارها</h2><ul>
                    {PROJECTS.map((p) => <li key={p.slug}><Link href={`/projects/${p.slug}/`}>{p.title}</Link></li>)}
                </ul></div>
                <div><h2>{BRAND.name}</h2><ul>
                    <li><Link href="/about/">درباره‌ی ما</Link></li>
                    <li><Link href="/developers/">برنامه‌نویسان</Link></li>
                    <li><Link href="/blog/">آموزش‌ها و مقالات</Link></li>
                    <li><a href="/resume.html">رزومه‌ی حامد عبداله زاده</a></li>
                    <li><Link href="/#faq">سؤالات متداول</Link></li>
                </ul></div>
                <div><h2>تماس</h2><ul>
                    <li><a href={`tel:${BRAND.phone}`} dir="ltr">{BRAND.phoneDisplay}</a></li>
                    <li><a href={waLink()} target="_blank" rel="noopener noreferrer">واتساپ</a></li>
                    <li><a href={`mailto:${BRAND.email}`} dir="ltr">{BRAND.email}</a></li>
                    <li><a href="https://github.com/hamedAbdollahzade" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                    <li><a href="https://www.linkedin.com/in/hamed-abdollahzade" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                </ul></div>
            </div>
            <p className="footer-copy">© {new Date().getFullYear()} {BRAND.name}. تمام حقوق محفوظ است.</p>
        </footer>
    );
}
