"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedRibbons() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Ensure all paths start hidden for drawing
        const paths = gsap.utils.toArray('.ribbon-path');
        paths.forEach((path: any) => {
            const length = path.getTotalLength();
            gsap.set(path, {
                strokeDasharray: `${length} ${length + 200}`,
                strokeDashoffset: length + 100,
                opacity: 1
            });
        });

        // Create master timeline pinned to the scroll area
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current?.parentElement,
                start: "top top",
                end: "+=150%",
                scrub: 1.5,
            }
        });

        // Animate ribbons in staggered sequences to simulate flowing extrusion
        // Ribbon 1 — sweeping diagonal from upper-left
        tl.to('.ribbon-1', { strokeDashoffset: 0, ease: "none", duration: 0.35 }, 0);

        // Ribbon 2 — cascading from upper-right  
        tl.to('.ribbon-2-back', { strokeDashoffset: 0, ease: "none", duration: 0.25 }, 0);
        tl.to('.ribbon-2-front', { strokeDashoffset: 0, ease: "none", duration: 0.3 }, 0.15);

        // Ribbon 3 — organic S-curve from center-left
        tl.to('.ribbon-3-back', { strokeDashoffset: 0, ease: "none", duration: 0.25 }, 0.05);
        tl.to('.ribbon-3-front', { strokeDashoffset: 0, ease: "none", duration: 0.25 }, 0.2);

        // Ribbon 4 — elegant swoop from lower-right
        tl.to('.ribbon-4-back', { strokeDashoffset: 0, ease: "none", duration: 0.2 }, 0.05);
        tl.to('.ribbon-4-front', { strokeDashoffset: 0, ease: "none", duration: 0.3 }, 0.2);

        // Parallax floating — gentle drift
        const wrappers = gsap.utils.toArray('.ribbon-wrapper');
        wrappers.forEach((wrapper: any, i) => {
            gsap.to(wrapper, {
                y: (i % 2 === 0 ? -80 : 80) * (Math.random() + 0.5),
                x: (i % 2 === 0 ? 30 : -30),
                rotation: (i % 2 === 0 ? 6 : -6),
                scrollTrigger: {
                    trigger: containerRef.current?.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2,
                },
                ease: "sine.inOut"
            });
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} 
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen bg-transparent opacity-80"
            style={{ transform: "translate3d(0,0,0)" }}
        >
            {/* Ambient background glow anchors */}
            <div className="absolute top-[20%] left-[15%] w-[450px] h-[450px] bg-[#ccff00] rounded-full blur-[180px] opacity-[0.04] dark:opacity-[0.08]"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[#ccff00] rounded-full blur-[200px] opacity-[0.04] dark:opacity-[0.08]"></div>

            <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 1440 900" 
                preserveAspectRatio="xMidYMid slice" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: "translate3d(0,0,0)" }}
            >
                <defs>
                    {/* Warm gradient — bright core fading to edges */}
                    <linearGradient id="neonCore" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#eeffaa" stopOpacity="0.1" />
                        <stop offset="30%" stopColor="#eeff66" />
                        <stop offset="60%" stopColor="#ccff00" />
                        <stop offset="100%" stopColor="#88cc00" stopOpacity="0.1" />
                    </linearGradient>

                    {/* Outer glow gradient — softer and wider */}
                    <linearGradient id="neonGlowOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ccff00" stopOpacity="0" />
                        <stop offset="25%" stopColor="#ccff00" stopOpacity="0.5" />
                        <stop offset="75%" stopColor="#bbee00" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
                    </linearGradient>

                    {/* Reverse direction gradient */}
                    <linearGradient id="neonReverse" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ccff00" stopOpacity="0" />
                        <stop offset="30%" stopColor="#ccff00" stopOpacity="0.5" />
                        <stop offset="70%" stopColor="#ddff44" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
                    </linearGradient>

                    {/* Glow filter — refined and less harsh */}
                    <filter id="ribbonGlow" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                        <feGaussianBlur stdDeviation="25" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* ═══════════════════════════════════════════════════════
                    Ribbon 1: Grand sweeping S-curve — upper-left to mid-center
                    The hero ribbon that frames the top of the text
                ═══════════════════════════════════════════════════════ */}
                <g className="ribbon-wrapper" filter="url(#ribbonGlow)" style={{ willChange: "transform" }}>
                    {/* Soft wide aura */}
                    <path 
                        className="ribbon-path ribbon-1"
                        d="M -60 -30 C 120 50, 200 220, 320 200 S 520 80, 600 160 S 700 320, 640 380" 
                        stroke="url(#neonGlowOuter)" 
                        strokeWidth="90" 
                        strokeLinecap="round" 
                        opacity="0.25"
                    />
                    {/* Bright center stroke */}
                    <path 
                        className="ribbon-path ribbon-1"
                        d="M -60 -30 C 120 50, 200 220, 320 200 S 520 80, 600 160 S 700 320, 640 380" 
                        stroke="url(#neonCore)" 
                        strokeWidth="28" 
                        strokeLinecap="round" 
                    />
                </g>

                {/* ═══════════════════════════════════════════════════════
                    Ribbon 2: Cascading from upper-right — crosses over itself
                    Creates depth with a back-front layering
                ═══════════════════════════════════════════════════════ */}
                <g className="ribbon-wrapper" filter="url(#ribbonGlow)" style={{ willChange: "transform" }}>
                    {/* Back segment — enters from right edge */}
                    <path 
                        className="ribbon-path ribbon-2-back"
                        d="M 1500 -40 C 1300 100, 1150 60, 1020 200" 
                        stroke="url(#neonReverse)" 
                        strokeWidth="80" 
                        strokeLinecap="round" 
                        opacity="0.2"
                    />
                    <path 
                        className="ribbon-path ribbon-2-back"
                        d="M 1500 -40 C 1300 100, 1150 60, 1020 200" 
                        stroke="url(#neonCore)" 
                        strokeWidth="24" 
                        strokeLinecap="round" 
                    />
                    {/* Front segment — continues its arc */}
                    <path 
                        className="ribbon-path ribbon-2-front"
                        d="M 1020 200 C 1100 300, 1250 280, 1350 200" 
                        stroke="url(#neonGlowOuter)" 
                        strokeWidth="75" 
                        strokeLinecap="round" 
                        opacity="0.2"
                    />
                    <path 
                        className="ribbon-path ribbon-2-front"
                        d="M 1020 200 C 1100 300, 1250 280, 1350 200" 
                        stroke="url(#neonCore)" 
                        strokeWidth="22" 
                        strokeLinecap="round" 
                    />
                </g>

                {/* ═══════════════════════════════════════════════════════
                    Ribbon 3: Organic wave from left edge across bottom-center
                    Sweeps under the text and loops back elegantly
                ═══════════════════════════════════════════════════════ */}
                <g className="ribbon-wrapper" filter="url(#ribbonGlow)" style={{ willChange: "transform" }}>
                    {/* Back segment — enters from bottom-left */}
                    <path 
                        className="ribbon-path ribbon-3-back"
                        d="M -40 580 C 100 500, 220 620, 340 540" 
                        stroke="url(#neonReverse)" 
                        strokeWidth="85" 
                        strokeLinecap="round" 
                        opacity="0.2"
                    />
                    <path 
                        className="ribbon-path ribbon-3-back"
                        d="M -40 580 C 100 500, 220 620, 340 540" 
                        stroke="url(#neonCore)" 
                        strokeWidth="26" 
                        strokeLinecap="round" 
                    />
                    {/* Front segment — arcs upward through center */}
                    <path 
                        className="ribbon-path ribbon-3-front"
                        d="M 340 540 C 480 440, 580 520, 660 440 S 800 350, 780 430" 
                        stroke="url(#neonGlowOuter)" 
                        strokeWidth="80" 
                        strokeLinecap="round" 
                        opacity="0.2"
                    />
                    <path 
                        className="ribbon-path ribbon-3-front"
                        d="M 340 540 C 480 440, 580 520, 660 440 S 800 350, 780 430" 
                        stroke="url(#neonCore)" 
                        strokeWidth="30" 
                        strokeLinecap="round" 
                    />
                </g>

                {/* ═══════════════════════════════════════════════════════
                    Ribbon 4: Elegant swoop from lower-right corner
                    Frames the bottom of the viewport
                ═══════════════════════════════════════════════════════ */}
                <g className="ribbon-wrapper" filter="url(#ribbonGlow)" style={{ willChange: "transform" }}>
                    {/* Back segment — enters from bottom-right */}
                    <path 
                        className="ribbon-path ribbon-4-back"
                        d="M 1480 750 C 1300 680, 1150 780, 1050 700" 
                        stroke="url(#neonGlowOuter)" 
                        strokeWidth="75" 
                        strokeLinecap="round" 
                        opacity="0.2"
                    />
                    <path 
                        className="ribbon-path ribbon-4-back"
                        d="M 1480 750 C 1300 680, 1150 780, 1050 700" 
                        stroke="url(#neonCore)" 
                        strokeWidth="22" 
                        strokeLinecap="round" 
                    />
                    {/* Front segment — curves back toward center */}
                    <path 
                        className="ribbon-path ribbon-4-front"
                        d="M 1050 700 C 950 620, 1020 540, 1120 500 S 1280 480, 1350 540" 
                        stroke="url(#neonReverse)" 
                        strokeWidth="70" 
                        strokeLinecap="round" 
                        opacity="0.2"
                    />
                    <path 
                        className="ribbon-path ribbon-4-front"
                        d="M 1050 700 C 950 620, 1020 540, 1120 500 S 1280 480, 1350 540" 
                        stroke="url(#neonCore)" 
                        strokeWidth="26" 
                        strokeLinecap="round" 
                    />
                </g>
            </svg>
        </div>
    );
}
