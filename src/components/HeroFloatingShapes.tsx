/**
 * Decorative floating SVG shapes for the home hero section.
 *
 * Pure CSS keyframes (defined in styles/theme.css), no JS animation
 * loop, no external library. Honors `prefers-reduced-motion: reduce`.
 *
 * The shapes use brand colors at low opacity so they whisper, not
 * shout. They sit absolutely-positioned inside the hero, behind the
 * content (z-index from parent), and are pointer-events-none.
 */

export default function HeroFloatingShapes() {
    return (
        <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            aria-hidden="true"
        >
            {/* Soccer ball — top-left */}
            <SoccerBall
                className="absolute top-[12%] left-[6%] w-12 h-12 sm:w-14 sm:h-14 hero-shape hero-shape-a opacity-[0.14]"
                color="#5b21b6"
            />

            {/* Star — mid-left */}
            <Star
                className="absolute top-[42%] left-[10%] w-10 h-10 hero-shape hero-shape-b opacity-[0.12]"
                color="#ea580c"
            />

            {/* Cone — bottom-left */}
            <Cone
                className="absolute bottom-[22%] left-[14%] w-9 h-9 hero-shape hero-shape-c opacity-[0.16]"
                color="#ea580c"
            />

            {/* Trophy — top-right */}
            <Trophy
                className="absolute top-[18%] right-[6%] w-12 h-12 hero-shape hero-shape-d opacity-[0.13]"
                color="#7c3aed"
            />

            {/* Whistle — mid-right */}
            <Whistle
                className="absolute top-[58%] right-[10%] w-11 h-11 hero-shape hero-shape-e opacity-[0.12]"
                color="#5b21b6"
            />

            {/* Mini ball — bottom-right */}
            <SoccerBall
                className="absolute bottom-[14%] right-[18%] w-8 h-8 hero-shape hero-shape-a opacity-[0.16]"
                color="#ea580c"
            />

            {/* Hex-pattern dot — top center */}
            <Hexagon
                className="absolute top-[8%] left-[48%] w-7 h-7 hero-shape hero-shape-b opacity-[0.12]"
                color="#7c3aed"
            />
        </div>
    );
}

/**
 * Smaller, denser cluster of the same SVG shapes positioned to orbit
 * the phone mockup in the "Управляйте обучением в один клик" section.
 *
 * Mounted inside the existing `relative` flex container around the
 * phone, so positions are tuned to that column rather than the full
 * viewport.
 */
export function LkFloatingShapes() {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
        >
            {/* Top-left of phone */}
            <SoccerBall
                className="absolute top-[6%] left-[2%] w-10 h-10 sm:w-12 sm:h-12 hero-shape hero-shape-a opacity-30"
                color="#7c3aed"
            />

            {/* Top-right */}
            <Trophy
                className="absolute top-[2%] right-[4%] w-10 h-10 sm:w-12 sm:h-12 hero-shape hero-shape-d opacity-30"
                color="#ea580c"
            />

            {/* Mid-right next to phone */}
            <Star
                className="absolute top-[42%] right-[1%] w-9 h-9 hero-shape hero-shape-b opacity-30"
                color="#f97316"
            />

            {/* Bottom-left */}
            <Cone
                className="absolute bottom-[8%] left-[4%] w-9 h-9 hero-shape hero-shape-c opacity-30"
                color="#ea580c"
            />

            {/* Bottom-right */}
            <Whistle
                className="absolute bottom-[14%] right-[6%] w-10 h-10 hero-shape hero-shape-e opacity-30"
                color="#7c3aed"
            />

            {/* Mid-left small ball */}
            <SoccerBall
                className="absolute top-[55%] left-[0%] w-8 h-8 hero-shape hero-shape-b opacity-30"
                color="#ea580c"
            />

            {/* Top-center hex */}
            <Hexagon
                className="absolute top-[18%] left-[42%] w-7 h-7 hero-shape hero-shape-a opacity-25"
                color="#7c3aed"
            />
        </div>
    );
}

interface ShapeProps {
    className?: string;
    color: string;
}

function SoccerBall({ className, color }: ShapeProps) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke={color} strokeWidth="2.4">
            <circle cx="32" cy="32" r="26" />
            <polygon points="32,20 41,26 38,36 26,36 23,26" fill={color} fillOpacity="0.9" stroke="none" />
            <line x1="32" y1="6" x2="32" y2="20" />
            <line x1="58" y1="32" x2="41" y2="26" />
            <line x1="50" y1="55" x2="38" y2="36" />
            <line x1="14" y1="55" x2="26" y2="36" />
            <line x1="6" y1="32" x2="23" y2="26" />
        </svg>
    );
}

function Star({ className, color }: ShapeProps) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill={color}>
            <polygon points="32,4 40,24 62,26 45,40 50,62 32,50 14,62 19,40 2,26 24,24" />
        </svg>
    );
}

function Cone({ className, color }: ShapeProps) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill={color}>
            <polygon points="32,8 50,52 14,52" />
            <ellipse cx="32" cy="52" rx="22" ry="5" fill={color} fillOpacity="0.6" />
            <rect x="22" y="22" width="20" height="3" fill="white" fillOpacity="0.6" />
            <rect x="20" y="34" width="24" height="3" fill="white" fillOpacity="0.6" />
        </svg>
    );
}

function Trophy({ className, color }: ShapeProps) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill={color}>
            <path d="M22 8 h20 v18 a10 10 0 0 1 -20 0 z" />
            <path d="M16 12 h6 v10 h-6 a4 4 0 0 1 0 -10 z" fill={color} fillOpacity="0.6" />
            <path d="M48 12 h-6 v10 h6 a4 4 0 0 0 0 -10 z" fill={color} fillOpacity="0.6" />
            <rect x="28" y="34" width="8" height="10" />
            <rect x="20" y="44" width="24" height="6" />
        </svg>
    );
}

function Whistle({ className, color }: ShapeProps) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill={color}>
            <rect x="10" y="22" width="34" height="20" rx="6" />
            <circle cx="38" cy="32" r="4" fill="white" fillOpacity="0.7" />
            <path d="M44 26 q14 -6 14 -2 l-2 12 q-12 4 -12 0 z" fill={color} fillOpacity="0.7" />
            <line x1="14" y1="22" x2="14" y2="14" stroke={color} strokeWidth="2" />
        </svg>
    );
}

function Hexagon({ className, color }: ShapeProps) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none" stroke={color} strokeWidth="3">
            <polygon points="32,6 56,20 56,44 32,58 8,44 8,20" />
        </svg>
    );
}
