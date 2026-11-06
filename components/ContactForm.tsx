"use client";

import {useState} from "react";
import type {FormEvent} from "react";
import {BRAND} from "@/data/services";
import {waLink} from "@/lib/site";

/** Optional: set NEXT_PUBLIC_FORM_ENDPOINT at build time to also POST requests to your own backend. */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
        const text = `سلام، من ${data.name} هستم.\nشماره‌ی تماس: ${data.phone}\nایده/پروژه: ${data.idea}`;

        if (!ENDPOINT) {
            window.open(waLink(text), "_blank", "noopener");
            return;
        }
        setStatus("sending");
        try {
            const res = await fetch(ENDPOINT, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...data, source: "webino-dev.ir"}),
            });
            if (!res.ok) throw new Error(String(res.status));
            setStatus("sent");
            form.reset();
        } catch {
            setStatus("error");
            window.open(waLink(text), "_blank", "noopener");
        }
    }

    return (
        <form className="contact-form" onSubmit={onSubmit} data-reveal>
            <label>نام شما<input name="name" type="text" autoComplete="name" required/></label>
            <label>شماره‌ی تماس<input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required/></label>
            <label>ایده یا پروژه‌ی شما<textarea name="idea" rows={4} required placeholder="مثلاً: یک پنل برای مدیریت سفارش‌ها می‌خواهم..."/></label>
            <button className="pill" type="submit" disabled={status === "sending"}>
                {ENDPOINT ? (status === "sending" ? "در حال ارسال…" : "ارسال درخواست") : "ارسال درخواست از طریق واتساپ"}
            </button>
            {status === "sent" && <p className="form-note" role="status">درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.</p>}
            {status === "error" && <p className="form-note" role="alert">ارسال انجام نشد؛ پیام را در واتساپ باز کردیم. یا مستقیم تماس بگیرید: {BRAND.phoneDisplay}</p>}
            {!ENDPOINT && <p className="form-note">با زدن دکمه، پیام آماده‌ی شما در واتساپ باز می‌شود. اطلاعاتی روی سایت ذخیره نمی‌شود.</p>}
        </form>
    );
}
