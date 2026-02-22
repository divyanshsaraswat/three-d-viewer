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

        gsap.set(items, {
            opacity: 0.15,
            scale: (i, target: any) => {
                if (target.classList.contains('icon-item')) return 0.3;
                if (target.classList.contains('highlight-item')) return 0.85;
                return 1;
            },
            y: (i, target: any) => target.classList.contains('highlight-item') ? 15 : 0
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

            tl.to(item, {
                opacity: 1,
                duration: 0.05,
                ease: "none"
            }, startTime);

            if (isIcon) {
                tl.to(item, {
                    scale: 1,
                    duration: 0.1,
                    ease: "back.out(2)"
                }, startTime);
            }

            if (isHighlight) {
                tl.to(item, {
                    scale: 1,
                    y: 0,
                    duration: 0.15,
                    ease: "back.out(1.5)"
                }, startTime);
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full flex items-center justify-center overflow-hidden py-32 pointer-events-none">
            <div ref={textWrapperRef} className="max-w-[1000px] px-4 md:px-8 mx-auto flex flex-wrap justify-center items-center text-center gap-x-2 gap-y-3 md:gap-x-3 md:gap-y-4">
                {words.map((w, i) => {
                    const isIcon = w.type === 'icon';
                    const isHighlight = w.type === 'highlight';
                    let colorClass = "text-black dark:text-white";

                    if (isHighlight) {
                        if (w.color === 'blue') colorClass = "text-blue-500 border-blue-500/50 dark:border-blue-500 bg-blue-500/5 drop-shadow-md";
                        if (w.color === 'green') colorClass = "text-[#7ea600] border-[#7ea600]/50 dark:text-[#ccff00] dark:border-[#ccff00] bg-[#ccff00]/5 drop-shadow-md";
                        if (w.color === 'orange') colorClass = "text-orange-500 dark:text-orange-400 border-orange-500/50 dark:border-orange-400 bg-orange-500/5 drop-shadow-md";
                        if (w.color === 'purple') colorClass = "text-purple-500 dark:text-purple-400 border-purple-500/50 dark:border-purple-400 bg-purple-500/5 drop-shadow-md";
                    }

                    return (
                        <span
                            key={i}
                            className={`reveal-item text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight transition-colors ${colorClass} ${isIcon ? 'icon-item inline-flex items-center justify-center transform origin-bottom translate-y-1 md:translate-y-2' : ''
                                } ${isHighlight ? 'highlight-item inline-flex items-center justify-center border-[3px] border-dotted px-4 py-1.5 md:py-2 rounded-[2rem] mx-1 md:mx-2 transform transition-all duration-300' : ''
                                }`}
                        >
                            {w.text}
                        </span>
                    );
                })}
            </div>
        </section>
    );
}
