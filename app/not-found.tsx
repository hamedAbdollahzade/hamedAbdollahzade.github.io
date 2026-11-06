import Link from "next/link";
import type {Metadata} from "next";

export const metadata: Metadata = {title: {absolute: "صفحه پیدا نشد (۴۰۴) | Webino-Dev"}, robots: {index: false}};

export default function NotFound() {
    return (
        <main id="main-content">
            <section className="hero" style={{minHeight: "100svh"}}>
                <div className="hero-content">
                    <h1>۴۰۴<small>این صفحه پیدا نشد</small></h1>
                    <p>آدرسی که باز کردید وجود ندارد یا جابه‌جا شده است.</p>
                    <div className="hero-actions">
                        <Link className="pill" href="/">بازگشت به خانه</Link>
                        <Link className="pill pill--ghost" href="/blog/">بلاگ</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
