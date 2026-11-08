import type {Metadata, Viewport} from "next";
import type {ReactNode} from "react";
import RootDocument from "@/components/RootDocument";
import {ORG, SITE} from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(SITE),
    applicationName: "Webino-Dev",
    authors: [{name: "Webino-Dev"}],
    manifest: "/manifest.json",
    icons: {icon: [{url: "/assets/icons/favicon.svg", type: "image/svg+xml"}]},
    robots: {index: true, follow: true, "max-image-preview": "large", "max-snippet": -1},
    openGraph: {siteName: ORG, locale: "fa_IR"},
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: [{media: "(prefers-color-scheme: light)", color: "#f4f4f5"}, {media: "(prefers-color-scheme: dark)", color: "#0a0a0b"}],
};

export default function PersianRootLayout({children}: {children: ReactNode}) {
    return <RootDocument locale="fa">{children}</RootDocument>;
}
