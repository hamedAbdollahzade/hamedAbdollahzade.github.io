import HomeView from "@/views/HomeView";
import {homeMeta} from "@/views/meta";

export const metadata = homeMeta("fa");

export default function Home() {
    return <HomeView locale="fa"/>;
}
