"use client";

import Link from "next/link";
import {useState} from "react";

export interface PostItem {
    slug: string;
    title: string;
    description: string;
    dateFa: string;
    category: string;
    readingMinutes: number;
}

/** Post cards with category filter chips. All cards are in the HTML, so crawlers still see every link. */
export default function PostFilter({posts}: {posts: PostItem[]}) {
    const categories = ["همه", ...Array.from(new Set(posts.map((p) => p.category)))];
    const [active, setActive] = useState("همه");
    const shown = active === "همه" ? posts : posts.filter((p) => p.category === active);

    return (
        <>
            {categories.length > 2 && (
                <div className="filters" role="group" aria-label="دسته‌بندی">
                    {categories.map((c) => (
                        <button key={c} type="button" className={`filter${c === active ? " is-active" : ""}`} onClick={() => setActive(c)} aria-pressed={c === active}>{c}</button>
                    ))}
                </div>
            )}
            <div className="grid grid--cards">
                {shown.map((p) => (
                    <Link className="post-card" href={`/blog/${p.slug}/`} key={p.slug}>
                        <div className="post-meta"><span className="chip chip--green">{p.category}</span><span>{p.dateFa}</span><span>· {p.readingMinutes.toLocaleString("fa-IR")} دقیقه مطالعه</span></div>
                        <h2>{p.title}</h2>
                        <p>{p.description}</p>
                        <span className="tile-more">خواندن مقاله ←</span>
                    </Link>
                ))}
            </div>
            {shown.length === 0 && <p className="empty">هنوز مقاله‌ای در این دسته نیست.</p>}
        </>
    );
}
