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
            // We add extra length to the dash array to compensate for the round cap protruding
            gsap.set(path, {
                strokeDasharray: `${length} ${length + 200}`,
                strokeDashoffset: length + 100, // Hides the rounded cap entirely off-path
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

        // Animate ribbons in sequences to simulate extrusion
        // Ribbon 1 (Top Left)
        tl.to('.ribbon-1', { strokeDashoffset: 0, ease: "none", duration: 0.3 }, 0);

        // Ribbon 2 (Top Right)
        tl.to('.ribbon-2-back', { strokeDashoffset: 0, ease: "none", duration: 0.2 }, 0);
        tl.to('.ribbon-2-front', { strokeDashoffset: 0, ease: "none", duration: 0.3 }, 0.2);

        // Ribbon 3 (Middle Left)
        tl.to('.ribbon-3-back1', { strokeDashoffset: 0, ease: "none", duration: 0.2 }, 0);
        tl.to('.ribbon-3-front', { strokeDashoffset: 0, ease: "none", duration: 0.2 }, 0.2);
        tl.to('.ribbon-3-back2', { strokeDashoffset: 0, ease: "none", duration: 0.2 }, 0.4);

        // Ribbon 4 (Bottom Right)
        tl.to('.ribbon-4-back', { strokeDashoffset: 0, ease: "none", duration: 0.2 }, 0);
        tl.to('.ribbon-4-front', { strokeDashoffset: 0, ease: "none", duration: 0.3 }, 0.2);

        // Parallax floating
        const wrappers = gsap.utils.toArray('.ribbon-wrapper');
        wrappers.forEach((wrapper: any, i) => {
            gsap.to(wrapper, {
                y: (i % 2 === 0 ? -120 : 120) * (Math.random() + 0.5),
                x: (i % 2 === 0 ? 50 : -50),
                rotation: (i % 2 === 0 ? 10 : -10),
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
            {/* Ambient background glow to anchor the ribbons */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#ccff00] rounded-full blur-[150px] opacity-[0.05] dark:opacity-[0.1]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#ccff00] rounded-full blur-[200px] opacity-[0.05] dark:opacity-[0.1]"></div>

            <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 1440 900" 
                preserveAspectRatio="xMidYMid slice" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: "translate3d(0,0,0)" }}
            >
                
                {/* Glow Filters and Bright Cores */}
                <defs>
                    <linearGradient id="neonCore" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffff99" />
                        <stop offset="50%" stopColor="#ccff00" />
                        <stop offset="100%" stopColor="#4d6600" stopOpacity="0"/>
                    </linearGradient>

                    <linearGradient id="neonGlowOuter" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ccff00" stopOpacity="0"/>
                        <stop offset="20%" stopColor="#ccff00" />
                        <stop offset="100%" stopColor="#ccff00" stopOpacity="0.2"/>
                    </linearGradient>

                    <linearGradient id="neonReverse" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ccff00" stopOpacity="0"/>
                        <stop offset="40%" stopColor="#ccff00" />
                        <stop offset="100%" stopColor="#eeff99" />
                    </linearGradient>

                    <filter id="ultraGlow" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                        <feGaussianBlur stdDeviation="35" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Ribbon 1: Top Left */}
                <g className="ribbon-wrapper" filter="url(#ultraGlow)" style={{ willChange: "transform" }}>
                    <path 
                        className="ribbon-path ribbon-1"
                        d="M 350 -50 Q 250 100, 150 220" 
                        stroke="url(#neonGlowOuter)" 
                        strokeWidth="120" 
                        strokeLinecap="round" 
                        opacity="0.3"
                    />
                    <path 
                        className="ribbon-path ribbon-1"
                        d="M 350 -50 Q 250 100, 150 220" 
                        stroke="url(#neonCore)" 
                        strokeWidth="40" 
                        strokeLinecap="round" 
                    />
                </g>

                {/* Ribbon 2: Top Right */}
                <g className="ribbon-wrapper" filter="url(#ultraGlow)" style={{ willChange: "transform" }}>
                    <path 
                        className="ribbon-path ribbon-2-back"
                        d="M 950 -50 Q 880 150, 770 280" 
                        stroke="url(#neonReverse)" 
                        strokeWidth="100" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        opacity="0.3"
                    />
                    <path 
                        className="ribbon-path ribbon-2-front"
                        d="M 770 280 Q 950 350, 1180 230" 
                        stroke="url(#neonGlowOuter)" 
                        strokeWidth="100" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        opacity="0.3"
                    />
                    <path 
                        className="ribbon-path ribbon-2-back"
                        d="M 950 -50 Q 880 150, 770 280" 
                        stroke="url(#neonCore)" 
                        strokeWidth="40" 
                        strokeLinecap="round" 
                    />
                    <path 
                        className="ribbon-path ribbon-2-front"
                        d="M 770 280 Q 950 350, 1180 230" 
                        stroke="url(#neonCore)" 
                        strokeWidth="30" 
                        strokeLinecap="round" 
                    />
                </g>

                {/* Ribbon 3: Middle Left */}
                <g className="ribbon-wrapper" filter="url(#ultraGlow)" style={{ willChange: "transform" }}>
                    {/* Glowing Auras */}
                    <path 
                        className="ribbon-path ribbon-3-back2"
                        d="M 450 420 Q 450 550, 380 650" 
                        stroke="url(#neonGlowOuter)" 
                        strokeWidth="120" 
                        strokeLinecap="round" 
                        opacity="0.2"
                    />
                    <path 
                        className="ribbon-path ribbon-3-back1"
                        d="M -20 450 Q 80 550, 180 650" 
                        stroke="url(#neonReverse)" 
                        strokeWidth="120" 
                        strokeLinecap="round" 
                        opacity="0.2"
                    />
                    <path 
                        className="ribbon-path ribbon-3-front"
                        d="M 180 650 Q 300 500, 450 420" 
                        stroke="url(#neonGlowOuter)" 
                        strokeWidth="120" 
                        strokeLinecap="round" 
                        opacity="0.3"
                    />
                    {/* Bright Cores */}
                    <path 
                        className="ribbon-path ribbon-3-back2"
                        d="M 450 420 Q 450 550, 380 650" 
                        stroke="url(#neonCore)" 
                        strokeWidth="40" 
                        strokeLinecap="round" 
                    />
                    <path 
                        className="ribbon-path ribbon-3-back1"
                        d="M -20 450 Q 80 550, 180 650" 
                        stroke="url(#neonCore)" 
                        strokeWidth="40" 
                        strokeLinecap="round" 
                    />
                    <path 
                        className="ribbon-path ribbon-3-front"
                        d="M 180 650 Q 300 500, 450 420" 
                        stroke="url(#neonCore)" 
                        strokeWidth="50" 
                        strokeLinecap="round" 
                    />
                </g>

                {/* Ribbon 4: Bottom Right */}
                <g className="ribbon-wrapper" filter="url(#ultraGlow)" style={{ willChange: "transform" }}>
                    <path 
                        className="ribbon-path ribbon-4-back"
                        d="M 1100 580 Q 980 680, 900 800" 
                        stroke="url(#neonGlowOuter)" 
                        strokeWidth="100" 
                        strokeLinecap="round" 
                        opacity="0.3"
                    />
                    <path 
                        className="ribbon-path ribbon-4-front"
                        d="M 900 800 Q 1100 880, 1300 820" 
                        stroke="url(#neonReverse)" 
                        strokeWidth="100" 
                        strokeLinecap="round" 
                        opacity="0.3"
                    />
                    <path 
                        className="ribbon-path ribbon-4-back"
                        d="M 1100 580 Q 980 680, 900 800" 
                        stroke="url(#neonCore)" 
                        strokeWidth="30" 
                        strokeLinecap="round" 
                    />
                    <path 
                        className="ribbon-path ribbon-4-front"
                        d="M 900 800 Q 1100 880, 1300 820" 
                        stroke="url(#neonCore)" 
                        strokeWidth="40" 
                        strokeLinecap="round" 
                    />
                </g>
            </svg>
        </div>
    );
}
