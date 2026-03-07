"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const words = [
    { text: "We", type: "word" },
    { text: "know", type: "word" },
    { text: "that", type: "word" },
    { text: "making", type: "word" },
    { text: "one", type: "word" },
    { text: "conventional", type: "word" },
    { text: "cotton", type: "word" },
    { text: "sheet", type: "word" },
    { text: "wastes", type: "word" },
    { text: "💧", type: "icon" },
    { text: "2,700 liters", type: "highlight", color: "blue" },
    { text: "of", type: "word" },
    { text: "water", type: "word" },
    { text: "—", type: "word" },
    { text: "and", type: "word" },
    { text: "that's", type: "word" },
    { text: "exactly", type: "word" },
    { text: "why", type: "word" },
    { text: "we", type: "word" },
    { text: "do", type: "word" },
    { text: "things", type: "word" },
    { text: "differently.", type: "word" },
    { text: "Every", type: "word" },
    { text: "🌊", type: "icon" },
    { text: "Weinix sheet", type: "highlight", color: "green" },
    { text: "keeps", type: "word" },
    { text: "6", type: "word" },
    { text: "plastic bottles", type: "highlight", color: "orange" },
    { text: "out", type: "word" },
    { text: "of", type: "word" },
    { text: "our", type: "word" },
    { text: "oceans,", type: "word" },
    { text: "because", type: "word" },
    { text: "it's", type: "word" },
    { text: "woven", type: "word" },
    { text: "from", type: "word" },
    { text: "your", type: "word" },
    { text: "old", type: "word" },
    { text: "👕", type: "icon" },
    { text: "jeans, t-shirts & linens", type: "highlight", color: "purple" },
    { text: "—", type: "word" },
    { text: "not", type: "word" },
    { text: "virgin", type: "word" },
    { text: "cotton.", type: "word" },
    { text: "Sleep", type: "word" },
    { text: "better", type: "word" },
    { text: "knowing", type: "word" },
    { text: "your", type: "word" },
    { text: "bed", type: "word" },
    { text: "is", type: "word" },
    { text: "part", type: "word" },
    { text: "of", type: "word" },
    { text: "the", type: "word" },
    { text: "solution.", type: "word" },
];

export default function ScrollRevealText() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textWrapperRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const items = gsap.utils.toArray('.reveal-item');
        const iconWrappers = gsap.utils.toArray<HTMLElement>('.icon-wrapper');

        // Measure natural widths for sliding effect
        iconWrappers.forEach(w => {
            w.dataset.targetWidth = `${w.offsetWidth}px`;
            gsap.set(w, { width: 0, opacity: 0 });
        });

        gsap.set(items, {
            opacity: (i, target: any) => target.classList.contains('icon-item') ? 1 : 0.15,
            scale: (i, target: any) => target.classList.contains('icon-item') ? 0 : 1,
            y: 0 // Normal baseline state for all items
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=150%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onRefresh: () => {
                    if (containerRef.current?.parentElement?.classList.contains('pin-spacer')) {
                        containerRef.current.parentElement.style.pointerEvents = 'none';
                    }
                }
            }
        });

        const totalItems = items.length;

        items.forEach((item: any, i) => {
            const isIcon = item.classList.contains('icon-item');
            const isHighlight = item.classList.contains('highlight-item');

            const startTime = (i / totalItems) * 0.8;

            if (isIcon) {
                const wrapper = item.closest('.icon-wrapper');
                
                // Animate wrapper expanding to slide text
                tl.to(wrapper, {
                    width: wrapper.dataset.targetWidth,
                    opacity: 1,
                    duration: 0.2,
                    ease: "power2.out"
                }, startTime);

                // Animate icon popping up
                tl.to(item, {
                    scale: 1,
                    duration: 0.2,
                    ease: "back.out(2)"
                }, startTime);
            } else {
                tl.to(item, {
                    opacity: 1,
                    duration: 0.05,
                    ease: "none"
                }, startTime);
            }

            if (isHighlight) {
                // The item itself just scales up naturally (without y-shift translation)
                tl.to(item, {
                    scale: 1,
                    duration: 0.15,
                    ease: "back.out(1.5)"
                }, startTime);

                // We find the overlay inside this specific highlight item and pop it in
                const overlay = item.querySelector('.highlight-overlay');
                if (overlay) {
                    tl.to(overlay, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.2,
                        ease: "back.out(1.5)"
                    }, startTime);
                }
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-32 pointer-events-none">
            <div ref={textWrapperRef} className="max-w-[1000px] px-4 md:px-8 mx-auto flex flex-wrap justify-center items-center text-center gap-y-3 md:gap-y-4">
                {words.map((w, i) => {
                    const isIcon = w.type === 'icon';
                    const isHighlight = w.type === 'highlight';

                    const typography = "text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight";
                    const padding = "px-1 md:px-1.5";

                    if (!isHighlight) {
                        if (isIcon) {
                            return (
                                <span key={i} className="icon-wrapper inline-flex overflow-hidden mx-0 items-center justify-center">
                                    <span className={`reveal-item icon-item ${typography} ${padding} text-black dark:text-white transition-colors inline-flex items-center justify-center transform origin-center`}>
                                        {w.text}
                                    </span>
                                </span>
                            );
                        }
                        return (
                            <span
                                key={i}
                                className={`reveal-item ${typography} ${padding} text-black dark:text-white transition-colors`}
                            >
                                {w.text}
                            </span>
                        );
                    }

                    // For highlight elements, they start as pure text to not break sentence flow.
                    let highlightColors = "";
                    if (w.color === 'blue') highlightColors = "border-blue-500/50 bg-blue-500/5 text-blue-500";
                    if (w.color === 'green') highlightColors = "border-[#ccff00]/50 bg-[#ccff00]/5 text-[#ccff00]";
                    if (w.color === 'orange') highlightColors = "border-orange-500/50 bg-orange-500/5 text-orange-500";
                    if (w.color === 'purple') highlightColors = "border-purple-500/50 bg-purple-500/5 text-purple-500";

                    return (
                        <span key={i} className={`reveal-item highlight-item relative inline-flex items-center justify-center transform ${padding}`}>
                            {/* Inactive state text (looks identically spaced and placed like normal words) */}
                            <span className={`${typography} text-black dark:text-white transition-colors relative z-10`}>
                                {w.text}
                            </span>

                            {/* Animated Active State overlay (colored box + colored text) */}
                            <span className={`highlight-overlay absolute -inset-y-1.5 inset-x-0 md:-inset-y-2 flex items-center justify-center border-[3px] border-dotted rounded-[2rem] opacity-0 scale-95 z-20 ${highlightColors} drop-shadow-sm pointer-events-none`}>
                                <span className={`${typography}`}>
                                    {w.text}
                                </span>
                            </span>
                        </span>
                    );
                })}
            </div>
        </section>
    );
}
