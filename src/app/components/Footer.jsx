import React from 'react';
import {GithubOutlined, LinkedinOutlined, MailOutlined} from '@ant-design/icons';

const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'auto', block: 'start'});
};

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const socialLinks = [
        {icon: <GithubOutlined />, href: 'https://github.com/hamedAbdollahzade', label: 'GitHub'},
        {icon: <LinkedinOutlined />, href: 'https://www.linkedin.com/in/hamed-abdollahzade/', label: 'LinkedIn'},
        {icon: <MailOutlined />, href: 'mailto:hamedabdollahzade.ab@gmail.com', label: 'Email'},
    ];

    return (
        <footer className="border-t border-white/10 bg-slate-950 px-4 py-10 text-slate-300 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="mb-2 text-xl font-black text-white">Hamed Abdollahzade</h3>
                    <p className="max-w-xl text-sm leading-6 text-slate-400">
                        Frontend developer crafting React dashboards, product interfaces, and modern portfolio experiences.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {['about', 'projects', 'experience', 'contact'].map((item) => (
                        <button
                            type="button"
                            key={item}
                            onClick={() => scrollToSection(item)}
                            className="rounded-full px-3 py-2 text-sm font-semibold capitalize text-slate-400 transition hover:bg-white/10 hover:text-white"
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <div className="flex gap-3">
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.label}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-slate-300 transition hover:border-cyan-300/60 hover:text-cyan-200"
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
            </div>
            <p className="mx-auto mt-8 max-w-7xl text-sm text-slate-500">© {currentYear} Hamed Abdollahzade. All rights reserved.</p>
        </footer>
    );
}
