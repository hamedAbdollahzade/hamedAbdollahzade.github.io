"use client";

import {useEffect, useState} from "react";
import {getBrand, getDevelopers, getServices} from "@/data/localized";
import {useLocale} from "./LocaleProvider";
import {useReducedMotion} from "./animations/useReducedMotion";

interface Step {cmd: string; out: string[]}

/** Splits a bio into its first two sentences (the full text lives on the developer page). */
const shortBio = (bio: string) => bio.split(/(?<=[.؟!])\s+/).slice(0, 2).join(" ");

/** An Ubuntu-style terminal that types a few commands: who we are, what we offer, how to reach us. Lines starting with "*" are highlighted (ads). */
export default function UbuntuTerminal({lessons}: {lessons: string}) {
    const {locale} = useLocale();
    const reduced = useReducedMotion();
    const brand = getBrand(locale);
    const hamed = getDevelopers(locale)[0];
    const fa = locale === "fa";
    const steps: Step[] = [
        {cmd: "whoami", out: [`${hamed.name} — ${hamed.role}`]},
        {cmd: "cat about.txt", out: [shortBio(hamed.bio), `skills: ${hamed.skills.slice(0, 6).join(", ")}`]},
        {cmd: "ls ~/services", out: [getServices(locale).map((s) => s.slug).join("  ")]},
        {
            cmd: "cat offer.txt",
            out: fa
                ? ["* مشاوره و بررسی اولیه‌ی ایده: رایگان", "* چت‌بات و دستیار هوشمند، طراحی سایت، پنل CRM/ERP و PWA", `* ${lessons} درس آموزشی رایگان در همین سایت`]
                : ["* Free initial consultation and idea review", "* Chatbots and AI assistants, websites, CRM/ERP panels and PWAs", `* ${lessons} free lessons on this site`],
        },
        {cmd: "./contact.sh", out: [`phone:  ${brand.phone}`, `email:  ${brand.email}`, fa ? "✓ منتظر پیام شما هستیم" : "✓ We are waiting for your message"]},
    ];
    const total = steps.length;
    const [step, setStep] = useState(0);
    const [chars, setChars] = useState(0);
    const [shown, setShown] = useState(0); // output lines printed for the current step

    useEffect(() => {
        if (reduced) { setStep(total); return; }
        const cur = steps[step];
        let timer: ReturnType<typeof setTimeout>;
        if (step >= total) timer = setTimeout(() => { setStep(0); setChars(0); setShown(0); }, 5000);
        else if (chars < cur.cmd.length) timer = setTimeout(() => setChars(chars + 1), 70);
        else if (shown < cur.out.length) timer = setTimeout(() => setShown(shown + 1), shown === 0 ? 350 : 650);
        else timer = setTimeout(() => { setStep(step + 1); setChars(0); setShown(0); }, 1400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, chars, shown, reduced, locale]);

    const prompt = <span className="ut-prompt"><b>hamed@webino</b>:<i>~</i>$ </span>;
    const done = step >= total;
    return (
        <figure className="ubuntu" role="img" aria-label={fa ? "ترمینال اوبونتو که معرفی و پیشنهادهای ما را تایپ می‌کند" : "An Ubuntu terminal typing our introduction and offers"}>
            <div className="ut-bar"><span className="ut-title">hamed@webino: ~</span><span className="ut-btns" aria-hidden="true"><i/><i/><i/></span></div>
            <div className="ut-body" dir="ltr" aria-hidden="true">
                {steps.slice(0, Math.min(step + 1, total)).map((s, i) => {
                    const current = i === step;
                    const lines = current ? s.out.slice(0, shown) : s.out;
                    return (
                        <div key={s.cmd}>
                            <div>{prompt}{current ? s.cmd.slice(0, chars) : s.cmd}{current && chars < s.cmd.length && <span className="ut-caret"/>}</div>
                            {lines.map((l, j) => <div key={j} className={`ut-out${l.startsWith("*") ? " ut-ad" : ""}`} dir="auto">{l.startsWith("*") ? `★${l.slice(1)}` : l}</div>)}
                        </div>
                    );
                })}
                {done && <div>{prompt}<span className="ut-caret"/></div>}
            </div>
            <ul className="sr-only">
                {steps.flatMap((s) => s.out).map((l, i) => <li key={i}>{l.replace(/^\*\s*/, "")}</li>)}
            </ul>
        </figure>
    );
}
