"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import type {FormEvent} from "react";
import {BRAND} from "@/data/services";
import {waLink} from "@/lib/site";
import {ChatIcon, SendIcon, WhatsAppIcon} from "./Icons";

/** Optional: set NEXT_PUBLIC_FORM_ENDPOINT at build time to also POST each request to your own backend. */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

const TOPICS = ["طراحی سایت", "پنل مدیریتی / CRM", "اپلیکیشن وب / PWA", "رابط دستگاه و سخت‌افزار", "چیز دیگری"];

type Step = "topic" | "idea" | "name" | "phone" | "ready";
interface Msg { from: "bot" | "user"; text: string }

const GREETING: Msg[] = [
    {from: "bot", text: "سلام 👋 به Webino-Dev خوش آمدید."},
    {from: "bot", text: "چه کمکی از ما برمی‌آید؟ موضوع را انتخاب کنید تا سریع‌تر پیش برویم."},
];

const toLatinDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [tip, setTip] = useState(false);
    const [toast, setToast] = useState(false);
    const [step, setStep] = useState<Step>("topic");
    const [msgs, setMsgs] = useState<Msg[]>(GREETING);
    const [answers, setAnswers] = useState({topic: "", idea: "", name: "", phone: ""});
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const bodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const say = useCallback((from: Msg["from"], text: string) => setMsgs((m) => [...m, {from, text}]), []);

    const pickTopic = useCallback((topic: string) => {
        setAnswers((a) => ({...a, topic}));
        setMsgs((m) => [...m, {from: "user", text: topic}, {from: "bot", text: "عالیه! ایده یا نیازت را کوتاه برایمان بنویس (چند جمله کافیه)."}]);
        setStep("idea");
    }, []);

    // Open from any <OpenChat> button.
    useEffect(() => {
        const onOpen = (e: Event) => {
            setOpen(true);
            setTip(false);
            const topic = (e as CustomEvent<{topic?: string}>).detail?.topic;
            if (topic && step === "topic") pickTopic(topic);
        };
        window.addEventListener("webino:open-chat", onOpen);
        return () => window.removeEventListener("webino:open-chat", onOpen);
    }, [pickTopic, step]);

    // Friendly nudge after a few seconds (once per session).
    useEffect(() => {
        let seen = false;
        try { seen = sessionStorage.getItem("webino-chat-tip") === "1"; } catch { /* storage may be blocked */ }
        if (seen) return;
        const t = setTimeout(() => setTip(true), 5000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        bodyRef.current?.scrollTo({top: bodyRef.current.scrollHeight, behavior: "smooth"});
    }, [msgs, step]);

    useEffect(() => {
        if (open && (step === "idea" || step === "name" || step === "phone")) inputRef.current?.focus();
    }, [open, step]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(false), 5000);
        return () => clearTimeout(t);
    }, [toast]);

    function dismissTip() {
        setTip(false);
        try { sessionStorage.setItem("webino-chat-tip", "1"); } catch { /* ignore */ }
    }

    function onSubmit(e: {preventDefault: () => void}) {
        e.preventDefault();
        const text = value.trim();
        if (step === "idea") {
            if (text.length < 5) return setError("لطفاً کمی بیشتر توضیح بدهید.");
            setAnswers((a) => ({...a, idea: text}));
            setMsgs((m) => [...m, {from: "user", text}, {from: "bot", text: "ممنون! اسمت چیه؟"}]);
            setStep("name");
        } else if (step === "name") {
            if (text.length < 2) return setError("نام را وارد کنید.");
            setAnswers((a) => ({...a, name: text}));
            setMsgs((m) => [...m, {from: "user", text}, {from: "bot", text: `خوشحالیم ${text} 🙌 شماره‌ی تماست را بنویس تا با شما هماهنگ کنیم.`}]);
            setStep("phone");
        } else if (step === "phone") {
            const digits = toLatinDigits(text).replace(/[\s\-()+]/g, "");
            if (!/^\d{10,13}$/.test(digits)) return setError("شماره‌ی معتبر وارد کنید (مثلاً 09123456789).");
            setAnswers((a) => ({...a, phone: digits}));
            setMsgs((m) => [...m, {from: "user", text: digits}, {from: "bot", text: "همه چیز آماده است. با دکمه‌ی زیر درخواستت در واتساپ برای ما ارسال می‌شود."}]);
            setStep("ready");
        }
        setValue("");
        setError("");
    }

    function sendToWhatsApp() {
        const message = `سلام، من ${answers.name} هستم.\nموضوع: ${answers.topic}\nتوضیحات: ${answers.idea}\nشماره‌ی تماس: ${answers.phone}`;
        // Must run inside the click handler so the browser doesn't block the new tab.
        window.open(waLink(message), "_blank", "noopener");
        if (ENDPOINT) {
            fetch(ENDPOINT, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...answers, source: "webino-dev.ir"}),
                keepalive: true,
            }).catch(() => { /* WhatsApp already has the message */ });
        }
        setOpen(false);
        setToast(true);
        setTimeout(() => {
            setStep("topic");
            setMsgs(GREETING);
            setAnswers({topic: "", idea: "", name: "", phone: ""});
            setValue("");
            setError("");
        }, 400);
    }

    const placeholder = step === "idea" ? "ایده یا نیازت را بنویس…" : step === "name" ? "نام و نام خانوادگی" : "شماره‌ی تماس";

    return (
        <>
            {tip && !open && (
                <div className="chat-tip" role="status" onClick={() => { setOpen(true); dismissTip(); }}>
                    <button type="button" aria-label="بستن" onClick={(e) => { e.stopPropagation(); dismissTip(); }}>×</button>
                    <div><strong>هر سؤالی دارید بپرسید.</strong><span>پاسخگوی شما هستیم.</span></div>
                </div>
            )}
            <section className={`chat-panel${open ? " is-open" : ""}`} role="dialog" aria-label="گفتگو با Webino-Dev" aria-hidden={!open}>
                <header className="chat-head">
                    <span className="chat-avatar"><ChatIcon/></span>
                    <div><h2>{BRAND.name}</h2><p>معمولاً در چند دقیقه پاسخ می‌دهیم</p></div>
                    <button className="chat-close" type="button" aria-label="بستن گفتگو" onClick={() => setOpen(false)}>×</button>
                </header>
                <div className="chat-body" ref={bodyRef} aria-live="polite">
                    {msgs.map((m, i) => <div key={i} className={`msg msg--${m.from}`}>{m.text}</div>)}
                    {step === "topic" && (
                        <div className="chat-chips">
                            {TOPICS.map((t) => <button key={t} type="button" className="chat-chip" onClick={() => pickTopic(t)}>{t}</button>)}
                        </div>
                    )}
                </div>
                <div className="chat-foot">
                    {(step === "idea" || step === "name" || step === "phone") && (
                        <form className="chat-form" onSubmit={(e: FormEvent) => onSubmit(e)}>
                            <textarea
                                ref={inputRef}
                                className="chat-input"
                                rows={step === "idea" ? 3 : 1}
                                value={value}
                                placeholder={placeholder}
                                dir={step === "phone" ? "ltr" : "auto"}
                                inputMode={step === "phone" ? "tel" : "text"}
                                aria-label={placeholder}
                                onChange={(e) => setValue(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(e); } }}
                            />
                            <button className="chat-send" type="submit" aria-label="ارسال" disabled={!value.trim()}><SendIcon/></button>
                        </form>
                    )}
                    {error && <p className="chat-error" role="alert">{error}</p>}
                    {step === "ready" && (
                        <button type="button" className="btn btn--green btn--lg chat-wa" onClick={sendToWhatsApp}><WhatsAppIcon/>ارسال درخواست در واتساپ</button>
                    )}
                    {step === "topic" && <p className="chat-note">یا مستقیم تماس بگیرید: <a href={`tel:${BRAND.phone}`} dir="ltr">{BRAND.phoneDisplay}</a></p>}
                    {step === "ready" && <p className="chat-note">اطلاعات روی سایت ذخیره نمی‌شود؛ پیام شما در واتساپ باز می‌شود.</p>}
                </div>
            </section>
            {toast && <div className="chat-toast" role="status">درخواست شما در واتساپ باز شد. پیام را ارسال کنید 👍</div>}
            <button className="chat-fab" type="button" aria-label={open ? "بستن گفتگو" : "باز کردن گفتگو"} onClick={() => { setOpen(!open); dismissTip(); }}><ChatIcon/></button>
        </>
    );
}
