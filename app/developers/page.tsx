import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Shell from "@/components/Shell";
import {DEVELOPERS} from "@/data/developers";
import {BRAND} from "@/data/services";
import {SITE, pageMeta, summarize} from "@/lib/site";

const TITLE = "برنامه‌نویسان Webino-Dev | تیم توسعه‌دهندگان";
const DESC = "با برنامه‌نویسان Webino-Dev آشنا شوید؛ مهارت‌ها، سوابق و نمونه‌کارهای افرادی که روی پروژه‌ی شما کار می‌کنند.";

export const metadata = pageMeta({title: TITLE, description: DESC, path: "/developers/", keywords: ["برنامه‌نویس", "توسعه‌دهنده فرانت‌اند", "تیم Webino-Dev"]});

export default function Developers() {
    return (
        <Shell crumbs={[{label: "برنامه‌نویسان"}]}>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@graph": [
                    {"@type": "CollectionPage", "@id": `${SITE}/developers/#page`, url: `${SITE}/developers/`, name: TITLE, inLanguage: "fa", isPartOf: {"@id": `${SITE}/#website`}},
                    {"@type": "BreadcrumbList", itemListElement: [
                        {"@type": "ListItem", position: 1, name: BRAND.name, item: `${SITE}/`},
                        {"@type": "ListItem", position: 2, name: "برنامه‌نویسان", item: `${SITE}/developers/`},
                    ]},
                ],
            }}/>
            <div className="card">
                <h1 className="page-title">برنامه‌نویسان</h1>
                <p className="page-lead">{DESC}</p>
            </div>
            <div className="grid grid--cards">
                {DEVELOPERS.map((d) => (
                    <Link className="dev-card" href={`/developers/${d.slug}/`} key={d.slug}>
                        <div className="dev-top">
                            <Image className="avatar" src={`/${d.photo}`} alt={d.name} width={72} height={72}/>
                            <div><h2 style={{fontSize: 20, fontWeight: 800}}>{d.name}</h2><div className="dev-role">{d.role}</div></div>
                        </div>
                        <p>{summarize(d.bio, 160)}</p>
                        <ul className="tags">{d.skills.map((s) => <li key={s}>{s}</li>)}</ul>
                        <span className="tile-more">مشاهده‌ی پروفایل ←</span>
                    </Link>
                ))}
            </div>
        </Shell>
    );
}
