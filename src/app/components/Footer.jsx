import React from 'react';
import {
    GithubOutlined,
    LinkedinOutlined,
    MailOutlined,
} from '@ant-design/icons';
import {Link} from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            icon: <GithubOutlined/>,
            href: 'https://github.com/hamedAbdollahzade',
            label: 'GitHub',
        },
        {
            icon: <LinkedinOutlined/>,
            href: 'https://www.linkedin.com/in/hamed-abdollahzade/',
            label: 'LinkedIn',
        },
        {
            icon: <MailOutlined/>,
            href: 'mailto:hamedabdollahzade.ab@gmail.com',
            label: 'Email',
        },
    ];

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* ================= About ================= */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Hamed Abdollahzade
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Frontend Developer focused on building modern, scalable and
                            user-friendly web applications using React, Next Js and modern UI
                            frameworks.
                        </p>
                    </div>

                    {/* ================= Quick Links ================= */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/projects"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ================= Social ================= */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Connect
                        </h3>
                        <div className="flex gap-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                    className="text-2xl text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ================= Copyright ================= */}
                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {currentYear} Hamed Abdollahzade. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
