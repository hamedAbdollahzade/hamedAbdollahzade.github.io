import Link from "next/link";
import type {Metadata} from "next";
import Shell from "@/components/Shell";

export const metadata: Metadata = {title: {absolute: "صفحه پیدا نشد (۴۰۴) | Webino-Dev"}, robots: {index: false}};

export default function NotFound() {
    return (
        <Shell>
            <div className="card" style={{textAlign: "center", padding: "56px 20px"}}>
                <h1 className="page-title">۴۰۴ · این صفحه پیدا نشد</h1>
                <p className="page-lead" style={{marginInline: "auto"}}>آدرسی که باز کردید وجود ندارد یا جابه‌جا شده است.</p>
                <div className="btn-row" style={{justifyContent: "center", marginTop: 22}}>
                    <Link className="btn" href="/">بازگشت به خانه</Link>
                    <Link className="btn btn--ghost" href="/blog/">آموزش‌ها</Link>
                </div>
            </div>
        </Shell>
    );
}
