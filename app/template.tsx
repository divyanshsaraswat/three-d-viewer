"use client";

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';

// Map routes to display titles
function getPageTitle(pathname: string): string {
    if (pathname.startsWith('/editor')) {
        return '3D EXPERIENCE';
    }

    const map: Record<string, string> = {
        '/home': 'HOME',
        '/about-us': 'ABOUT US',
        '/': 'HOME',
    };
    return map[pathname] || pathname.replace('/', '').replace(/-/g, ' ').toUpperCase() || 'HOME';
}

export default function Template({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const pageTitle = getPageTitle(pathname);

    // Page transition animation
    useEffect(() => {
        if (!containerRef.current || !bgRef.current) return;

        const tl = gsap.timeline();

        // Animate the page title letters in
        if (titleRef.current) {
            const chars = titleRef.current.querySelectorAll('.page-title-char');
            tl.fromTo(chars,
                { y: '110%', opacity: 0, rotationZ: 8 },
                { y: '0%', opacity: 1, rotationZ: 0, duration: 0.5, stagger: 0.04, ease: "power4.out" }
            )
            // Hold for a beat
            .to({}, { duration: 0.3 })
            // Fade out title
            .to(chars,
                { y: '-60%', opacity: 0, duration: 0.35, stagger: 0.02, ease: "power3.in" }
            );
        }

        // Black background slides up
        tl.to(bgRef.current, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.2")
          // Yellow container slides up
          .to(containerRef.current, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.65")
          // Hide container
          .set(containerRef.current, { display: "none" });

    }, []);

    return (
        <>
            {/* Loader / Page Transition Overlay */}
            <div
                ref={containerRef}
                className="fixed inset-0 z-[200] bg-[#ccff00] flex flex-col items-center justify-center pointer-events-none"
            >
                <div ref={bgRef} className="absolute inset-0 bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-500" />

                {/* ---- PAGE TRANSITION: Animated Title ---- */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Small WEINIX branding */}
                    <div className="text-black/30 dark:text-white/30 transition-colors duration-500 text-xs font-bold tracking-[0.4em] uppercase flex items-center gap-2 mb-8">
                        <div className="w-2.5 h-2.5 bg-[#ccff00] transform rotate-45 rounded-sm opacity-60" />
                        <span>WEINIX</span>
                    </div>

                    {/* Large animated page title */}
                    <div ref={titleRef} className="overflow-hidden flex items-center justify-center">
                        <h1 className="text-black dark:text-white transition-colors duration-500 text-7xl md:text-[9rem] lg:text-[12rem] font-bold tracking-tighter leading-none text-center flex">
                            {pageTitle.split('').map((char, i) => (
                                <span
                                    key={i}
                                    className="page-title-char inline-block"
                                    style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Actual Page Content */}
            {children}
        </>
    );
}
