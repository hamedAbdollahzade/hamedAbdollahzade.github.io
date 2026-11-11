import type {ReactNode} from "react";

const base = {viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true} as const;
const make = (d: ReactNode) => function Icon() { return <svg {...base}>{d}</svg>; };

export const Logo = make(<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>);
export const PhoneIcon = make(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.99.36 1.96.68 2.9a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.18-1.18a2 2 0 0 1 2.11-.45c.94.32 1.91.55 2.9.68A2 2 0 0 1 22 16.92z"/>);
export const ChatIcon = make(<><path d="M21 12a8.5 8.5 0 0 1-12.4 7.5L3 21l1.6-5.1A8.5 8.5 0 1 1 21 12Z"/><path d="M8.5 11h7M8.5 14h4"/></>);
export const SendIcon = make(<path d="m21 3-9.5 18-2.2-7.8L2 11 21 3Zm-11.7 10.2L21 3"/>);
export const MenuIcon = make(<path d="M4 7h16M4 12h16M4 17h16"/>);
export const SearchIcon = make(<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>);
export const ChevronIcon = make(<path d="m9 6 6 6-6 6"/>);
export const HomeIcon = make(<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z"/>);
export const LayersIcon = make(<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>);
export const FolderIcon = make(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>);
export const BookIcon = make(<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm0 14a2 2 0 0 1 2-2h13M9 7h6"/>);
export const UsersIcon = make(<><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5A6.5 6.5 0 0 1 21.5 20"/></>);
export const CompassIcon = make(<><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></>);
export const InfoIcon = make(<><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>);
export const MailIcon = make(<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>);
export const GlobeIcon = make(<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>);
export const DashboardIcon = make(<><rect x="3" y="3" width="8" height="10" rx="2"/><rect x="13" y="3" width="8" height="6" rx="2"/><rect x="13" y="11" width="8" height="10" rx="2"/><rect x="3" y="15" width="8" height="6" rx="2"/></>);
export const MobileIcon = make(<><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></>);
export const ChipIcon = make(<><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></>);
export const SparkIcon = make(<><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>);
export const SunIcon = make(<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>);
export const MoonIcon = make(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>);
export const CodeIcon = make(<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>);

export function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.25-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.28.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.02-.38.1-.5.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03 0 1.2.87 2.35 1 2.51.12.17 1.7 2.6 4.12 3.64 2.43 1.04 2.43.7 2.87.65.44-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z"/></svg>
    );
}

const SERVICE_ICONS: Record<string, () => ReactNode> = {
    "ai-solutions": SparkIcon,
    "website-design": GlobeIcon,
    "admin-panel-crm": DashboardIcon,
    "web-app-pwa": MobileIcon,
    "device-interface": ChipIcon,
};
export function ServiceIcon({slug}: {slug: string}) {
    const Icon = SERVICE_ICONS[slug] ?? CodeIcon;
    return <Icon/>;
}
