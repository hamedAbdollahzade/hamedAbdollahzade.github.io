import DevelopersView from "@/views/DevelopersView";
import {developersMeta} from "@/views/meta";

export const metadata = developersMeta("en");

export default function Developers() {
    return <DevelopersView locale="en"/>;
}
