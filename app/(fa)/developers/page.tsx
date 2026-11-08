import DevelopersView from "@/views/DevelopersView";
import {developersMeta} from "@/views/meta";

export const metadata = developersMeta("fa");

export default function Developers() {
    return <DevelopersView locale="fa"/>;
}
