import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import OpenChat from "@/components/OpenChat";
import Shell from "@/components/Shell";
import {BRAND} from "@/data/services";
import {SITE, pageMeta} from "@/lib/site";

const TITLE = "درباره‌ی Webino-Dev | تیم توسعه وب و نرم‌افزار در مشهد";
const DESC = "با تیم Webino-Dev آشنا شوید؛ تیمی کوچک و چابک در مشهد با تجربه‌ی کار روی پلتفرم CRM/ERP، دستگاه‌های وندینگ و برنامه‌های آفلاین، و مسیر همکاری ما با شما.";

export const metadata = pageMeta({
    title: TITLE,
    description: DESC,
    path: "/about/",
    keywords: ["Webino-Dev", "درباره ما", "تیم توسعه نرم‌افزار مشهد", "حامد عبداله زاده"],
});

export default function About() {
    return (
        <Shell crumbs={[{label: "درباره‌ی ما"}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {"@type": "AboutPage", "@id": `${SITE}/about/#page`, url: `${SITE}/about/`, name: TITLE, inLanguage: "fa", isPartOf: {"@id": `${SITE}/#website`}, about: {"@id": `${SITE}/#org`}},
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: BRAND.name, item: `${SITE}/`},
                        {"@type": "ListItem", position: 2, name: "درباره‌ی ما", item: `${SITE}/about/`},
                    ]},
                ],
            }}/>
            <div className="card">
                <h1 className="page-title">Webino-Dev؛ تیمی که ایده‌ها را به محصول تبدیل می‌کند</h1>
                <p className="page-lead">ما یک تیم کوچک و چابک توسعه وب و نرم‌افزار در مشهد هستیم. هر ایده‌ای که دارید را می‌شنویم، ساده‌ترین مسیر اجرایش را پیشنهاد می‌دهیم و تا تحویل و پشتیبانی کنارتان می‌مانیم.</p>
                <div className="btn-row" style={{marginTop: 18}}>
                    <OpenChat>ثبت درخواست پروژه</OpenChat>
                    <Link className="btn btn--soft" href="/developers/">با برنامه‌نویسان آشنا شوید</Link>
                </div>
            </div>
            <div className="card page-card">
                <h2>محصول‌هایی که در شرایط واقعی کار می‌کنند</h2>
                <p>Webino-Dev برای کسب‌وکارها و ایده‌پردازانی ساخته شده که می‌خواهند ایده‌شان را بدون پیچیدگی غیرضروری و با هزینه‌ی قابل‌پیش‌بینی به یک محصول واقعی تبدیل کنند.</p>
                <h2>تجربه‌ای که روی ایده‌ی شما هم کار می‌کند</h2>
                <p>تجربه‌ی ما از کار روی پلتفرم‌های سازمانی CRM/ERP تا رابط‌های دستگاه‌های وندینگ می‌آید؛ محصولاتی که باید با داده‌های پیچیده و گاهی بدون اینترنت کار کنند.</p>
                <h2>شریک فنی، نه فقط پیمانکار</h2>
                <p>با هر پروژه مثل یک شریک فنی رفتار می‌کنیم: مسئله را درست می‌فهمیم، محدودیت‌ها را شفاف می‌گوییم و راه‌حلی متناسب با نیاز و بودجه‌ی شما می‌سازیم.</p>
            </div>
        </Shell>
    );
}
