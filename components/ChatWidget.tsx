"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import type {FormEvent} from "react";
import {getBrand} from "@/data/localized";
import {waLink} from "@/lib/site";
import {ChatIcon, SendIcon, WhatsAppIcon} from "./Icons";
import {useLocale} from "./LocaleProvider";

/** Optional: set NEXT_PUBLIC_FORM_ENDPOINT at build time to also POST each request to your own backend. */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

type Step = "topic" | "idea" | "name" | "phone" | "ready";
interface Msg { from: "bot" | "user"; text: string }

const toLatinDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

export default function ChatWidget() {
    const {locale, t} = useLocale();
    const brand = getBrand(locale);
    const c = t.chat;
    const greeting: Msg[] = [{from: "bot", text: c.greeting1}, {from: "bot", text: c.greeting2}];

    const [open, setOpen] = useState(false);
    const [tip, setTip] = useState(false);
    const [toast, setToast] = useState(false);
    const [step, setStep] = useState<Step>("topic");
    const [msgs, setMsgs] = useState<Msg[]>(greeting);
    const [answers, setAnswers] = useState({topic: "", idea: "", name: "", phone: ""});
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const bodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const pickTopic = useCallback((topic: string) => {
        setAnswers((a) => ({...a, topic}));
        setMsgs((m) => [...m, {from: "user", text: topic}, {from: "bot", text: c.askIdea}]);
        setStep("idea");
    }, [c.askIdea]);

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
        const timer = setTimeout(() => setTip(true), 5000);
        return () => clearTimeout(timer);
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
        const timer = setTimeout(() => setToast(false), 5000);
        return () => clearTimeout(timer);
    }, [toast]);

    function dismissTip() {
        setTip(false);
        try { sessionStorage.setItem("webino-chat-tip", "1"); } catch { /* ignore */ }
    }

    function onSubmit(e: {preventDefault: () => void}) {
        e.preventDefault();
        const text = value.trim();
        if (step === "idea") {
            if (text.length < 5) return setError(c.shortIdea);
            setAnswers((a) => ({...a, idea: text}));
            setMsgs((m) => [...m, {from: "user", text}, {from: "bot", text: c.askName}]);
            setStep("name");
        } else if (step === "name") {
            if (text.length < 2) return setError(c.shortName);
            setAnswers((a) => ({...a, name: text}));
            setMsgs((m) => [...m, {from: "user", text}, {from: "bot", text: c.askPhone(text)}]);
            setStep("phone");
        } else if (step === "phone") {
            const digits = toLatinDigits(text).replace(/[\s\-()+]/g, "");
            if (!/^\d{10,13}$/.test(digits)) return setError(c.badPhone);
            setAnswers((a) => ({...a, phone: digits}));
            setMsgs((m) => [...m, {from: "user", text: digits}, {from: "bot", text: c.ready}]);
            setStep("ready");
        }
        setValue("");
        setError("");
    }

    function sendToWhatsApp() {
        const message = `${c.waHello(answers.name)}\n${c.waTopic}: ${answers.topic}\n${c.waDetails}: ${answers.idea}\n${c.waPhone}: ${answers.phone}`;
        // Must run inside the click handler so the browser doesn't block the new tab.
        window.open(waLink(message), "_blank", "noopener");
        if (ENDPOINT) {
            fetch(ENDPOINT, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...answers, locale, source: "webino-dev.ir"}),
                keepalive: true,
            }).catch(() => { /* WhatsApp already has the message */ });
        }
        setOpen(false);
        setToast(true);
        setTimeout(() => {
            setStep("topic");
            setMsgs(greeting);
            setAnswers({topic: "", idea: "", name: "", phone: ""});
            setValue("");
            setError("");
        }, 400);
    }

    const placeholder = step === "idea" ? c.ideaPlaceholder : step === "name" ? c.namePlaceholder : c.phonePlaceholder;

    return (
        <>
            {tip && !open && (
                <div className="chat-tip" role="status" onClick={() => { setOpen(true); dismissTip(); }}>
                    <button type="button" aria-label={c.closeTip} onClick={(e) => { e.stopPropagation(); dismissTip(); }}>×</button>
                    <div><strong>{c.tipTitle}</strong><span>{c.tipText}</span></div>
                </div>
            )}
            <section className={`chat-panel${open ? " is-open" : ""}`} role="dialog" aria-label={c.title} aria-hidden={!open}>
                <header className="chat-head">
                    <span className="chat-avatar"><ChatIcon/></span>
                    <div><h2>{brand.name}</h2><p>{c.status}</p></div>
                    <button className="chat-close" type="button" aria-label={c.close} onClick={() => setOpen(false)}>×</button>
                </header>
                <div className="chat-body" ref={bodyRef} aria-live="polite">
                    {msgs.map((m, i) => <div key={i} className={`msg msg--${m.from}`}>{m.text}</div>)}
                    {step === "topic" && (
                        <div className="chat-chips">
                            {c.topics.map((topic) => <button key={topic} type="button" className="chat-chip" onClick={() => pickTopic(topic)}>{topic}</button>)}
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
                            <button className="chat-send" type="submit" aria-label={c.send} disabled={!value.trim()}><SendIcon/></button>
                        </form>
                    )}
                    {error && <p className="chat-error" role="alert">{error}</p>}
                    {step === "ready" && (
                        <button type="button" className="btn btn--wa btn--lg chat-wa" onClick={sendToWhatsApp}><WhatsAppIcon/>{c.sendWhatsApp}</button>
                    )}
                    {step === "topic" && <p className="chat-note">{c.orCall} <a href={`tel:${brand.phone}`}>{c.callLink}</a></p>}
                    {step === "ready" && <p className="chat-note">{c.noStorage}</p>}
                </div>
            </section>
            {toast && <div className="chat-toast" role="status">{c.toast}</div>}
            <button className="chat-fab" type="button" aria-label={open ? c.close : c.open} onClick={() => { setOpen(!open); dismissTip(); }}><ChatIcon/></button>
        </>
    );
}
