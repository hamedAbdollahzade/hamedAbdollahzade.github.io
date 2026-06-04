import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Drawer} from 'antd';
import {MenuOutlined, MoonOutlined, SunOutlined} from '@ant-design/icons';
import {motion} from 'motion/react';
import LanguageSwitcher from '@/components/LanguageSwitcher.jsx';
import {useLanguage} from '@/contexts/LanguageContext.jsx';

const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
};

export default function Navbar({isDarkMode, toggleTheme}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const {isRTL} = useLanguage();

    const navLinks = [
        {path: 'about', label: 'About'},
        {path: 'projects', label: 'Projects'},
        {path: 'experience', label: 'Experience'},
        {path: 'contact', label: 'Contact'},
    ];

    const handleNavClick = (path) => {
        setDrawerOpen(false);
        scrollToSection(path);
    };

    return (
        <motion.nav
            initial={{y: -80, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.5, ease: 'easeOut'}}
            className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/65 backdrop-blur-2xl"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" onClick={() => scrollToSection('home')} className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 shadow-lg shadow-cyan-500/20">
                            <span className="text-lg font-black text-white">HA</span>
                        </div>
                        <span className="hidden text-sm font-semibold uppercase tracking-[0.25em] text-slate-200 sm:block">
                            Portfolio
                        </span>
                    </Link>

                    <div className="hidden items-center gap-2 md:flex">
                        {navLinks.map((link) => (
                            <button
                                type="button"
                                key={link.path}
                                onClick={() => handleNavClick(link.path)}
                                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <Button
                            type="text"
                            aria-label="Toggle theme"
                            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                            onClick={toggleTheme}
                            className="!text-xl !text-slate-200 hover:!bg-white/10"
                        />
                        <Button
                            type="text"
                            aria-label="Open menu"
                            icon={<MenuOutlined />}
                            onClick={() => setDrawerOpen(true)}
                            className="md:hidden !text-xl !text-slate-200 hover:!bg-white/10"
                        />
                    </div>
                </div>
            </div>

            <Drawer
                title="Menu"
                placement={isRTL ? 'left' : 'right'}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                className="portfolio-drawer"
            >
                <div className="flex min-w-48 flex-col gap-3">
                    {navLinks.map((link) => (
                        <button
                            type="button"
                            key={link.path}
                            onClick={() => handleNavClick(link.path)}
                            className="rounded-xl px-4 py-3 text-left text-lg font-semibold text-slate-800 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
            </Drawer>
        </motion.nav>
    );
}
