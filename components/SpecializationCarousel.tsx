"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const specs = [
    {
        id: 1,
        tag: "ARCHITECTURE",
        title: "Translating vision into highly curated design",
        date: "2024 / OVER 50 PROJECTS",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
        colorClass: "dark:bg-[#111111]"
    },
    {
        id: 2,
        tag: "INTERIOR",
        title: "Crafting spaces that breathe life and elegance",
        date: "2024 / 30+ PROJECTS",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200",
        colorClass: "dark:bg-[#16120e]"
    },
    {
        id: 3,
        tag: "MASTERPLAN",
        title: "Designing sustainable cities for future generations",
        date: "ONGOING",
        image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1200",
        colorClass: "dark:bg-[#0e1610]"
    },
    {
        id: 4,
        tag: "CONSTRUCTION",
        title: "Building with precision, durability, and art",
        date: "AVERAGE 18 MO",
        image: "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=1200",
        colorClass: "dark:bg-[#160e0e]"
    },
    {
        id: 5,
        tag: "DOCUMENTATION",
        title: "Preserving architectural heritage properly",
        date: "ARCHIVE",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=1200",
        colorClass: "dark:bg-[#0f0e16]"
    }
];

export default function SpecializationCarousel() {
    const rootRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const stRef = useRef<ScrollTrigger | null>(null);
    const [activeIdx, setActiveIdx] = useState(0);

    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, scroll: 0 });

    useGSAP(() => {
        if (!wrapperRef.current) return;

        const isMobile = window.innerWidth < 768;
        const narrowVW = isMobile ? 45 : 24;
        const wideVW = isMobile ? 85 : 55;
        const gapVW = isMobile ? 4 : 2;

        // Ensure active card is aligned to padding.
        // px-8 on desktop = 32px ~ 2.2vw. Let's strictly use window measurements to push left accurately.
        const paddingPx = isMobile ? 16 : 32;

        const getXForIndex = (i: number) => {
            return `calc(${paddingPx}px - ${i * (narrowVW + gapVW)}vw)`;
        };

        const cards = gsap.utils.toArray('.spec-card') as HTMLElement[];
        const titles = gsap.utils.toArray('.title-text') as HTMLElement[];

        // Initial Layout Reset
        gsap.set(wrapperRef.current, { x: getXForIndex(0), gap: `${gapVW}vw` });
        gsap.set(cards, { width: `${narrowVW}vw` });
        gsap.set(cards[0], { width: `${wideVW}vw` });

        // Initial Font Scaling to prevent truncation
        gsap.set(titles, { fontSize: isMobile ? "1.25rem" : "1.75rem" });
        gsap.set(titles[0], { fontSize: isMobile ? "2.25rem" : "3.5rem" });

        // Build scrubbing timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: `+=${window.innerHeight * specs.length * 0.8}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const newIdx = Math.min(Math.floor(progress * specs.length), specs.length - 1);
                    if (newIdx !== activeIdx) {
                        setActiveIdx(newIdx);
                    }
                }
            }
        });

        stRef.current = tl.scrollTrigger || null;

        // Sequence animations for each card transition
        for (let i = 0; i < specs.length - 1; i++) {
            const currentCard = cards[i];
            const nextCard = cards[i + 1];

            // Width transition (takes 80% of the step)
            tl.to(currentCard, { width: `${narrowVW}vw`, ease: "power2.inOut", duration: 0.8 }, i)
                .to(nextCard, { width: `${wideVW}vw`, ease: "power2.inOut", duration: 0.8 }, i)
                .to(wrapperRef.current, { x: getXForIndex(i + 1), ease: "power2.inOut", duration: 0.8 }, i)
                // Fade out and shrink current card's text early so it isn't squeezed
                .to(titles[i], { fontSize: isMobile ? "1.25rem" : "1.75rem", ease: "power2.inOut", duration: 0.5 }, i)
                .to(currentCard.querySelectorAll('.hide-on-narrow'), { opacity: 0, duration: 0.5, ease: "power2.out" }, i)
                // Animate next card's text to pop in ONLY AFTER width transition is done (last 20% of the step)
                .to(titles[i + 1], { fontSize: isMobile ? "2.25rem" : "3.5rem", ease: "power2.inOut", duration: 0.2 }, i + 0.8)
                .to(nextCard.querySelectorAll('.hide-on-narrow'), { opacity: 1, duration: 0.2, ease: "power2.in" }, i + 0.8);
        }

        return () => {
            if (stRef.current) stRef.current.kill();
            tl.kill();
        };

    }, { scope: rootRef, dependencies: [] });

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, scroll: window.scrollY };
        e.currentTarget.setPointerCapture(e.pointerId);
        e.currentTarget.style.cursor = 'grabbing';
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current || !stRef.current) return;
        const deltaX = e.clientX - dragStart.current.x;
        // Drag horizontally -> Scroll vertically
        const multiplier = 2.5;
        window.scrollTo(0, dragStart.current.scroll - deltaX * multiplier);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        isDragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
        e.currentTarget.style.cursor = 'grab';
    };

    const scrollToIdx = (idx: number) => {
        if (!stRef.current) return;
        const st = stRef.current;
        const progress = Math.min(idx / (specs.length - 1), 1);
        const maxScroll = st.end - st.start;
        const targetScroll = st.start + (maxScroll * progress);

        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    const next = () => scrollToIdx(Math.min(activeIdx + 1, specs.length - 1));
    const prev = () => scrollToIdx(Math.max(activeIdx - 1, 0));

    return (
        <section
            ref={rootRef}
            className={`min-h-[100vh] w-full relative transition-colors duration-1000 ease-in-out bg-gray-100 ${specs[activeIdx].colorClass} overflow-hidden flex flex-col`}
        >
            {/* Header Content & Navigation locked to top */}
            <div className="pt-22 pb-8 px-4 md:px-8 z-20 shrink-0 flex flex-col items-center text-center w-full max-w-[1200px] mx-auto text-black dark:text-white transition-colors duration-1000">
                <div className="mb-0">
                    <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 transition-colors">OUR SPECIALIZATION</h2>
                    <p className="opacity-60 max-w-xl mx-auto text-sm uppercase tracking-widest leading-loose transition-colors mb-8">
                        We translate our client&apos;s vision into highly curated design <br className="hidden md:block" />
                        across diverse typologies
                    </p>
                </div>
            </div>

            {/* The structural middle track */}
            <div className="flex-grow w-full relative flex items-center overflow-hidden">
                <div
                    ref={wrapperRef}
                    className="flex h-[60vh] md:h-[65vh] w-fit items-center cursor-grab select-none will-change-transform pb-12"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    // Prevent default touch drag on mobile so our custom pointer handler can drive scroll directly
                    style={{ touchAction: 'none' }}
                >
                    {specs.map((spec, i) => (
                        <div
                            key={spec.id}
                            className="spec-card h-full rounded-[2rem] overflow-hidden relative shrink-0 shadow-lg group pointer-events-none will-change-transform bg-black/50"
                        >
                            <div className="card-inner absolute top-0 left-0 h-full w-full">
                                <img
                                    src={spec.image}
                                    alt={spec.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-auto"
                                    style={{ objectPosition: "center center" }}
                                />

                                {/* Base gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none"></div>

                                {/* Texts constraint - responsive padding for proper text wrap constraints */}
                                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between pointer-events-none">
                                    <div className="flex justify-between items-start">
                                        <span className="bg-[#ccff00] text-black text-[10px] md:text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded">
                                            {spec.tag}
                                        </span>
                                    </div>

                                    <div className="mt-auto max-w-lg mb-2">
                                        <h3 className="title-text text-white font-bold leading-[1.1] tracking-tight mb-4 drop-shadow-md pb-2 break-words">
                                            {spec.title}
                                        </h3>

                                        <div className="hide-on-narrow flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 opacity-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                                            <p className="text-[#ccff00] md:text-white/90 text-xs md:text-sm font-bold tracking-widest uppercase">
                                                {spec.date}
                                            </p>
                                            <button className="flex items-center gap-2 text-[#ccff00] md:text-white md:group-hover:text-[#ccff00] transition-colors group/btn pointer-events-auto cursor-pointer">
                                                <span className="text-sm font-bold uppercase tracking-widest hidden md:inline-block">Learn More</span>
                                                <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center md:group-hover/btn:-rotate-45 transition-transform duration-300">
                                                    <ArrowUpRight size={18} />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Carousel Indicators Below the Cards */}
            <div className="flex justify-center items-center gap-3 pb-8 pt-4 z-20 shrink-0">
                {specs.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollToIdx(i)}
                        className={`transition-all duration-300 rounded-full ${i === activeIdx
                            ? "w-10 h-2 bg-black dark:bg-[#ccff00]"
                            : "w-2 h-2 bg-black/20 hover:bg-black/40 dark:bg-white/30 dark:hover:bg-white/60"
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
