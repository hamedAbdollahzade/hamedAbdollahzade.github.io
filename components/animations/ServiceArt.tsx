/** Animated line art for each service (pure SVG + CSS, so it stays tiny and follows the theme colours). */

const common = {viewBox: "0 0 240 160", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true} as const;

/** Neural-network style graph with pulsing nodes and flowing links (AI). */
function AiArt() {
    const layers = [[30, 55, 105, 130], [70, 100], [45, 80, 115]];
    const xs = [40, 120, 200];
    return (
        <svg {...common} className="art art--ai">
            {layers[0].map((y1, i) => layers[1].map((y2, j) => <line key={`a${i}${j}`} className="art-flow" x1={xs[0]} y1={y1} x2={xs[1]} y2={y2} style={{animationDelay: `${(i + j) * 0.25}s`}}/>))}
            {layers[1].map((y1, i) => layers[2].map((y2, j) => <line key={`b${i}${j}`} className="art-flow" x1={xs[1]} y1={y1} x2={xs[2]} y2={y2} style={{animationDelay: `${(i + j) * 0.3 + 0.4}s`}}/>))}
            {layers.map((ys, li) => ys.map((y, i) => <circle key={`n${li}${i}`} className="art-pulse" cx={xs[li]} cy={y} r="7" style={{animationDelay: `${(li * 3 + i) * 0.2}s`}}/>))}
        </svg>
    );
}

/** Browser wireframe whose blocks build up one after another (website). */
function WebArt() {
    return (
        <svg {...common} className="art art--web">
            <rect x="20" y="16" width="200" height="128" rx="10"/>
            <line x1="20" y1="38" x2="220" y2="38"/>
            <circle cx="34" cy="27" r="3"/><circle cx="46" cy="27" r="3"/><circle cx="58" cy="27" r="3"/>
            <rect className="art-build" x="34" y="50" width="172" height="30" rx="6" style={{animationDelay: "0s"}}/>
            <rect className="art-build" x="34" y="92" width="52" height="38" rx="6" style={{animationDelay: ".5s"}}/>
            <rect className="art-build" x="94" y="92" width="52" height="38" rx="6" style={{animationDelay: "1s"}}/>
            <rect className="art-build" x="154" y="92" width="52" height="38" rx="6" style={{animationDelay: "1.5s"}}/>
        </svg>
    );
}

/** Dashboard with growing bars and a line that draws itself (admin panel / CRM). */
function PanelArt() {
    const bars = [34, 58, 44, 76, 62, 90];
    return (
        <svg {...common} className="art art--panel">
            <rect x="16" y="14" width="208" height="132" rx="10"/>
            <line x1="16" y1="36" x2="224" y2="36"/>
            {bars.map((h, i) => <rect key={i} className="art-bar" x={34 + i * 24} y={132 - h} width="14" height={h} rx="3" style={{animationDelay: `${i * 0.18}s`}}/>)}
            <polyline className="art-line" points="34,110 58,86 82,96 106,64 130,76 154,46 178,58" />
        </svg>
    );
}

/** Phone that alternates between online and offline while data keeps syncing (PWA). */
function PwaArt() {
    return (
        <svg {...common} className="art art--pwa">
            <rect x="82" y="10" width="76" height="140" rx="14"/>
            <line x1="108" y1="22" x2="132" y2="22"/>
            <rect className="art-build" x="94" y="40" width="52" height="22" rx="5" style={{animationDelay: "0s"}}/>
            <rect className="art-build" x="94" y="72" width="52" height="22" rx="5" style={{animationDelay: ".6s"}}/>
            <rect className="art-build" x="94" y="104" width="52" height="22" rx="5" style={{animationDelay: "1.2s"}}/>
            <g className="art-sync"><path d="M190 60a22 22 0 1 0 6 16"/><path d="M190 46v14h-14"/></g>
            <g className="art-wifi"><path d="M36 74a30 30 0 0 1 42 0"/><path d="M45 86a17 17 0 0 1 24 0"/><circle cx="57" cy="97" r="2"/></g>
        </svg>
    );
}

/** Chip whose pins pulse while data packets travel along the traces (hardware). */
function DeviceArt() {
    const pins = [60, 90, 120, 150, 180];
    return (
        <svg {...common} className="art art--device">
            <rect x="82" y="42" width="76" height="76" rx="10"/>
            <rect x="102" y="62" width="36" height="36" rx="6"/>
            {pins.slice(0, 3).map((x, i) => <line key={`t${i}`} x1={x + 24} y1="42" x2={x + 24} y2="20" className="art-pin" style={{animationDelay: `${i * 0.2}s`}}/>)}
            {pins.slice(0, 3).map((x, i) => <line key={`b${i}`} x1={x + 24} y1="118" x2={x + 24} y2="140" className="art-pin" style={{animationDelay: `${i * 0.2 + 0.3}s`}}/>)}
            <path d="M82 80H30"/><path d="M158 80h52"/>
            <circle className="art-packet" cx="30" cy="80" r="4"/><circle className="art-packet art-packet--r" cx="210" cy="80" r="4"/>
        </svg>
    );
}

const ARTS: Record<string, () => React.JSX.Element> = {
    "ai-solutions": AiArt,
    "website-design": WebArt,
    "admin-panel-crm": PanelArt,
    "web-app-pwa": PwaArt,
    "device-interface": DeviceArt,
};

/** The animated illustration for a service slug. */
export default function ServiceArt({slug}: {slug: string}) {
    const Art = ARTS[slug] ?? AiArt;
    return <div className="service-art"><Art/></div>;
}
