import type {Metadata} from "next";
import RootDocument from "@/components/RootDocument";
import NotFoundView from "@/views/NotFoundView";
import "./globals.css";

export const metadata: Metadata = {title: {absolute: "صفحه پیدا نشد (۴۰۴) | Webino-Dev"}, robots: {index: false}};

/** Site-wide 404 (there are two root layouts, so Next needs a document of its own). */
export default function GlobalNotFound() {
    return (
        <RootDocument locale="fa">
            <NotFoundView locale="fa"/>
        </RootDocument>
    );
}
