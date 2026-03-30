"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedRibbons from './AnimatedRibbons';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const words = [
    { text: "Nothing", type: "word" },
    { text: "is", type: "word" },
    { text: "🗑️", type: "icon" },
    { text: "wasted", type: "highlight", color: "orange" },
    { text: "here.", type: "word" },
    { text: "What", type: "word" },
    { text: "was", type: "word" },
    { text: "👕", type: "icon" },
    { text: "worn", type: "highlight", color: "blue" },
    { text: "becomes", type: "word" },
    { text: "what", type: "word" },
    { text: "is", type: "word" },
    { text: "built.", type: "word" },
    { text: "Weinix sheets", type: "highlight", color: "green" },
    { text: "—", type: "word" },
    { text: "recycled", type: "word" },
    { text: "textile", type: "word" },
    { text: "panels", type: "word" },
    { text: "for", type: "word" },
    { text: "🏢", type: "icon" },
    { text: "walls, facades, and interiors", type: "highlight", color: "purple" },
    { text: "that", type: "word" },
    { text: "stand", type: "word" },
    { text: "for", type: "word" },
    { text: "something", type: "word" },
    { text: "more.", type: "word" },
];

export default function ScrollRevealText() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textWrapperRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const items = gsap.utils.toArray('.reveal-item');
        const iconWrappers = gsap.utils.toArray<HTMLElement>('.icon-wrapper');

        // Initial setup
        iconWrappers.forEach(w => gsap.set(w, { opacity: 0, width: 0 }));
        
        gsap.set(items, {
            opacity: (i, target: any) => target.classList.contains('icon-item') ? 0 : 0.15,
            scale: (i, target: any) => target.classList.contains('icon-item') ? 0 : 1,
            y: 0,
            force3D: true // Force GPU acceleration
        });

        const totalItems = items.length;

        // Use matchMedia to separate mobile (not sticky) vs desktop (sticky)
        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            let { isDesktop } = context.conditions as { isDesktop: boolean, isMobile: boolean };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: isDesktop ? "top top" : "top 60%", // Pin from top on desktop, trigger lower down on mobile
                    end: isDesktop ? "+=150%" : "bottom top", 
                    scrub: isDesktop ? 1.5 : false, // Scrub only on desktop
                    pin: isDesktop, // Pin only on desktop
                    anticipatePin: isDesktop ? 1 : 0,
                    toggleActions: isDesktop ? "play none none none" : "play none none reverse", // Mobile relies on toggleActions
                    fastScrollEnd: true, 
                    onRefresh: () => {
                        if (isDesktop && containerRef.current?.parentElement?.classList.contains('pin-spacer')) {
                            containerRef.current.parentElement.style.pointerEvents = 'none';
                        }
                    }
                }
            });

            // Batch processing the timeline creation significantly reduces JS overhead
            items.forEach((item: any, i) => {
                const isIcon = item.classList.contains('icon-item');
                const isHighlight = item.classList.contains('highlight-item');

                // On desktop, stagger across the total scroll distance (0 to ~1.0 timeline progress)
                // On mobile, play at a fixed quick speed
                const startTime = isDesktop ? (i / totalItems) * 1.0 : i * 0.08; 

                if (isIcon) {
                    const wrapper = item.closest('.icon-wrapper');
                    tl.to(wrapper, { opacity: 1, width: "auto", duration: 0.2, ease: "power2.out", force3D: true }, startTime)
                      .to(item, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)", force3D: true }, startTime);
                } else {
                    tl.to(item, { opacity: 1, duration: 0.1, ease: "none", force3D: true }, startTime);
                }

                if (isHighlight) {
                    tl.to(item, { scale: 1, duration: 0.15, ease: "back.out(1.5)", force3D: true }, startTime);
                    const overlay = item.querySelector('.highlight-overlay');
                    if (overlay) {
                        tl.to(overlay, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(1.5)", force3D: true }, startTime);
                    }
                }
            });
            
            return () => {
                // Cleanup tl if needed. MatchMedia handles most of it automatically.
            };
        });

        // Notify main loading page that text reveal DOM structuring & timeline setup is complete
        if (typeof window !== 'undefined') {
            const evt = new CustomEvent('scrollRevealReady');
            window.dispatchEvent(evt);
        }

    }, { scope: containerRef });

    // Grouping adjacent pure words drastically reduces DOM count
    const groupedElements: React.ReactNode[] = [];
    let currentTextBlock = "";
    
    const typography = "text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight [text-shadow:0_2px_8px_rgba(255,255,255,0.4)] dark:[text-shadow:0_2px_8px_rgba(0,0,0,0.4)]";
    const padding = "px-1 md:px-1.5";
    const baseClasses = `${typography} text-black dark:text-white transition-colors`;
    
    words.forEach((w, i) => {
        if (w.type === 'word') {
            currentTextBlock += (currentTextBlock ? " " : "") + w.text;
            
            // If next word isn't a simple word, or it's the last word, close and push this block
            if (i === words.length - 1 || words[i + 1].type !== 'word') {
                // Split the accumulated text block back into spans only when necessary to maintain sequential reveal,
                // but we avoid deep nesting it.
                currentTextBlock.split(" ").forEach((text, blockIndex) => {
                   groupedElements.push(
                        <span key={`word-${i}-${blockIndex}`} className={`reveal-item ${baseClasses} ${padding} inline-block`} style={{ willChange: "opacity", transform: "translateZ(0)" }}>
                            {text}
                        </span>
                   );
                });
                currentTextBlock = ""; // reset
            }
        } else if (w.type === 'icon') {
            groupedElements.push(
                <span key={`icon-${i}`} className="icon-wrapper inline-flex overflow-hidden mx-0 items-center justify-center transform-gpu" style={{ willChange: "opacity, width" }}>
                    <span className={`reveal-item icon-item ${baseClasses} ${padding} inline-flex items-center justify-center origin-center`} style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}>
                        {w.text}
                    </span>
                </span>
            );
        } else if (w.type === 'highlight') {
            let highlightColors = "";
            if (w.color === 'blue') highlightColors = "border-blue-500/50 bg-blue-500/5 text-blue-500";
            if (w.color === 'green') highlightColors = "border-[#ccff00]/50 bg-[#ccff00]/5 text-[#ccff00]";
            if (w.color === 'orange') highlightColors = "border-orange-500/50 bg-orange-500/5 text-orange-500";
            if (w.color === 'purple') highlightColors = "border-purple-500/50 bg-purple-500/5 text-purple-500";

            groupedElements.push(
                <span key={`highlight-${i}`} className={`reveal-item highlight-item relative inline-flex items-center justify-center origin-center ${padding}`} style={{ willChange: "transform", transform: "translateZ(0)" }}>
                    <span className={`${baseClasses} relative z-10`} style={{ willChange: "opacity", transform: "translateZ(0)" }}>
                        {w.text}
                    </span>
                    <span className={`highlight-overlay absolute -inset-y-1.5 inset-x-0 md:-inset-y-2 flex items-center justify-center border-[2px] border-dotted rounded-[1.5rem] opacity-0 scale-95 z-20 ${highlightColors} drop-shadow-lg pointer-events-none transform-gpu`} style={{ contain: 'strict', willChange: "transform, opacity" }}>
                        <span className={`${typography} px-[1.5px] isolate`}>
                            {w.text}
                        </span>
                    </span>
                </span>
            );
        }
    });

    return (
        <section ref={containerRef} className="relative w-full min-h-[100vh] py-24 flex items-center justify-center overflow-hidden pointer-events-none bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-500" style={{ contain: 'paint' }}>
            {/* Background Ribbons */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <AnimatedRibbons />
            </div>

            <div ref={textWrapperRef} className="relative z-20 w-[95%] max-w-[1000px] px-2 sm:px-4 md:px-8 mx-auto flex flex-wrap justify-center items-center text-center gap-y-2 md:gap-y-4">
                {groupedElements}
            </div>
        </section>
    );
}
