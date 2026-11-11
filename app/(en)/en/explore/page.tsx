import ExploreView from "@/views/ExploreView";
import {exploreMeta} from "@/views/meta";

export const metadata = exploreMeta("en");

export default function ExplorePage() {
    return <ExploreView locale="en"/>;
}
