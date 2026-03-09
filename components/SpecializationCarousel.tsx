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
        tag: "BRICK",
        title: "Engineering strength from what the world discarded",
        date: "2026 / DIVERTS 1.2KG TEXTILE WASTE PER BRICK",
        image: "/weinix_brick.png",
        colorClass: "dark:bg-[#111111]"
    },
    {
        id: 2,
        tag: "INTERIOR",
        title: "Crafting surfaces that carry a story within",
        date: "THERMAL INSULATION / NOISE REDUCTION / CERTIFIED SAFE",
        image: "/weinix_interior.png",
        colorClass: "dark:bg-[#16120e]"
    },
    {
        id: 3,
        tag: "EXTERIOR",
        title: "Designing facades built to last and built to mean more",
        date: "WEATHER RESISTANT / UV STABLE / ZERO TOXIC EMISSIONS",
        image: "/weinix_exterior.png",
        colorClass: "dark:bg-[#0e1610]"
    },
    {
        id: 4,
        tag: "CONSTRUCTION",
        title: "Building with precision, durability, and art",
        date: "AVERAGE 18 MO",
        image: "/weinix_construction.png",
        colorClass: "dark:bg-[#160e0e]"
    },
    {
        id: 5,
        tag: "DOCUMENTATION",
        title: "Preserving architectural heritage properly",
        date: "ARCHIVE",
        image: "/weinix_documentation.png",
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

        const paddingPx = isMobile ? 16 : 32;

        const cards = gsap.utils.toArray('.spec-card') as HTMLElement[];
        
        // Initial Layout Reset via gsap.set ensures ScrollTrigger correctly calculates the pinned container's
        // actual scrollable footprint size on mount before the inline React CSS fully hydrates
        gsap.set(wrapperRef.current, { paddingLeft: `${paddingPx}px`, gap: `${gapVW}vw` });
        gsap.set(cards, { width: `${narrowVW}vw` });
        if (cards[0]) gsap.set(cards[0], { width: `${wideVW}vw` });

        // Build snapping timeline simply to calculate activeIdx without visually scrubbing DOM directly
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: `+=${window.innerHeight * specs.length * 0.8}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                snap: {
                    snapTo: 1 / (specs.length - 1),
                    duration: { min: 0.2, max: 0.4 },
                    ease: "back.out(1.5)"
                },
                onUpdate: (self) => {
                    const currentProgress = self.progress;
                    const segment = 1 / (specs.length - 1);
                    const exact = currentProgress / segment;
                    
                    let newIdx = Math.round(exact);
                    if (self.direction === 1) {
                        // Scrolling down - trigger when 15% into the next segment
                        newIdx = Math.floor(exact + 0.85); 
                    } else if (self.direction === -1) {
                        // Scrolling up - trigger when 15% backwards into the previous segment
                        newIdx = Math.ceil(exact - 0.85);
                    }

                    const finalIdx = Math.min(Math.max(newIdx, 0), specs.length - 1);
                    setActiveIdx(finalIdx);
                }
            }
        });

        stRef.current = tl.scrollTrigger || null;

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
            <div className="pt-28 md:pt-32 pb-4 px-4 md:px-8 z-20 shrink-0 flex flex-col items-center text-center w-full max-w-[1200px] mx-auto text-black dark:text-white transition-colors duration-1000">
                <div className="mb-0">
                    <h2 className="text-4xl md:text-[3.5rem] font-bold uppercase tracking-tighter mb-2 transition-colors">OUR SPECIALIZATION</h2>
                    <p className="opacity-60 max-w-xl mx-auto text-xs md:text-sm uppercase tracking-widest leading-loose transition-colors mb-2">
                        We translate our client&apos;s vision into highly curated design <br className="hidden md:block" />
                        across diverse typologies
                    </p>
                </div>
            </div>

                {/* The structural middle track */}
            <div className="flex-grow w-full relative flex items-center overflow-hidden" style={{ contain: "layout style" }}>
                <div
                    ref={wrapperRef}
                    className="flex h-[50vh] md:h-[55vh] w-fit items-center cursor-grab select-none pb-8 transition-transform duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    // Prevent default touch drag on mobile so our custom pointer handler can drive scroll directly
                    style={{ 
                        touchAction: 'none',
                        gap: `${typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 2}vw`,
                        paddingLeft: `${typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 32}px`,
                        transform: `translateX(-${activeIdx * (typeof window !== 'undefined' && window.innerWidth < 768 ? 45 + 4 : 24 + 2)}vw)`
                    }}
                >
                    {specs.map((spec, i) => {
                        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                        const narrowVW = isMobile ? 45 : 24;
                        const wideVW = isMobile ? 85 : 55;
                        const isActive = i === activeIdx;
                        
                        return (
                        <div
                            key={spec.id}
                            className="spec-card h-full rounded-[2rem] overflow-hidden relative shrink-0 shadow-lg group pointer-events-none bg-black/50 transition-all duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
                            style={{ 
                                width: `${isActive ? wideVW : narrowVW}vw`,
                                contain: "layout" 
                            }}
                        >
                            <div className="card-inner absolute top-0 left-0 h-full w-full">
                                <img
                                    src={spec.image}
                                    alt={spec.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-auto"
                                    style={{ objectPosition: "center center" }}
                                />

                                {/* Base gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none transition-opacity duration-700" style={{ opacity: isActive ? 1 : 0.6 }}></div>

                                {/* Texts constraint - responsive padding for proper text wrap constraints */}
                                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between pointer-events-none">
                                    <div className="flex justify-between items-start">
                                        <span className="bg-[#ccff00] text-black text-[10px] md:text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded transition-transform duration-700" style={{ transform: isActive ? 'scale(1)' : 'scale(0.9)', transformOrigin: 'top left' }}>
                                            {spec.tag}
                                        </span>
                                    </div>

                                    <div className="mt-auto max-w-lg mb-2">
                                        <h3 className="title-text text-white font-bold leading-[1.1] tracking-tight mb-4 drop-shadow-md pb-2 break-words transition-all duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
                                            style={{ 
                                                fontSize: isActive 
                                                    ? (isMobile ? "1.5rem" : "3.5rem") 
                                                    : (isMobile ? "1rem" : "1.75rem") 
                                            }}>
                                            {spec.title}
                                        </h3>

                                        <div className="hide-on-narrow flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 transition-opacity duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ opacity: isActive ? 1 : 0, transitionDelay: isActive ? "200ms" : "0ms" }}>
                                            <p className="text-[#ccff00] md:text-white/90 text-xs md:text-sm font-bold tracking-widest uppercase">
                                                {spec.date}
                                            </p>
                                            <button className="hidden md:flex items-center gap-2 text-[#ccff00] md:text-white md:group-hover:text-[#ccff00] transition-colors group/btn pointer-events-auto cursor-pointer">
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
                    )})}
                </div>
            </div>

            {/* Carousel Indicators Below the Cards */}
            <div className="flex justify-center items-center gap-3 pb-6 pt-2 z-20 shrink-0">
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
