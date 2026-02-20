"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Star } from 'lucide-react';

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
    { text: "2,700", type: "word" },
    { text: "liters", type: "word" },
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
    { text: "Weinix", type: "word" },
    { text: "sheet", type: "word" },
    { text: "keeps", type: "word" },
    { text: "6", type: "word" },
    { text: "plastic", type: "word" },
    { text: "bottles", type: "word" },
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
    { text: "jeans,", type: "word" },
    { text: "t-shirts", type: "word" },
    { text: "&", type: "word" },
    { text: "linens", type: "word" },
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
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const items = gsap.utils.toArray('.reveal-item');

        gsap.set(items, {
            opacity: 0.15,
            scale: (i, target: any) => target.classList.contains('icon-item') ? 0.3 : 1
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=200%",
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        const totalItems = items.length;

        items.forEach((item: any, i) => {
            const isIcon = item.classList.contains('icon-item');

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
        });

        const gridItem = gridRef.current;
        gsap.set(gridItem, { opacity: 0, y: 50, scale: 0.95 });

        // Add a smooth fade out of the text block right before the end
        tl.to(textWrapperRef.current, {
            opacity: 0,
            y: -50,
            duration: 0.1, // fade out over the final 10%
            ease: "power2.inOut"
        }, 0.85);

        tl.to(gridItem, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.15, // fade in Grid at the end
            ease: "power3.out"
        }, 0.9);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full min-h-screen z-20 flex items-center justify-center overflow-hidden">
            <div ref={textWrapperRef} className="max-w-[1000px] px-4 md:px-8 mx-auto flex flex-wrap justify-center text-center gap-x-2 gap-y-2 md:gap-x-3 md:gap-y-4">
                {words.map((w, i) => {
                    const isIcon = w.type === 'icon';
                    let colorClass = "text-black dark:text-white";

                    if (w.text === "2,700" || w.text === "liters" || w.text === "water") colorClass = "text-blue-500 drop-shadow-sm";
                    if (w.text === "Weinix" || w.text === "sheet") colorClass = "text-[#8cb800] dark:text-[#ccff00]";
                    if (w.text === "plastic" || w.text === "bottles") colorClass = "text-orange-500 dark:text-orange-400";
                    if (w.text === "jeans," || w.text === "t-shirts" || w.text === "&" || w.text === "linens") colorClass = "text-purple-500 dark:text-purple-400";

                    return (
                        <span
                            key={i}
                            className={`reveal-item text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight transition-colors ${colorClass} ${isIcon ? 'icon-item inline-flex items-center justify-center transform origin-bottom translate-y-1 md:translate-y-2' : ''}`}
                        >
                            {w.text}
                        </span>
                    );
                })}
            </div>

            <div ref={gridRef} className="absolute inset-0 px-4 md:px-8 max-w-[1200px] mx-auto flex items-center justify-center z-30 pointer-events-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[repeat(4,_minmax(180px,_auto))] md:grid-rows-[repeat(4,_minmax(200px,_auto))] gap-4 h-auto w-full">

                    {/* Stage 4 (Top Left) */}
                    <div className="md:col-span-1 md:row-span-2 bg-white dark:bg-[#222222] border border-gray-100 dark:border-transparent transition-colors duration-500 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group relative overflow-hidden cursor-pointer shadow-sm">
                        <h3 className="text-xl font-bold mb-8 text-black dark:text-white transition-colors">Fiber Blending</h3>
                        <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/10 dark:text-white/10 transition-colors" />
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="100.48" className="text-[#ccff00] transition-all duration-1000 group-hover:strokeDashoffset-0" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-bold text-black dark:text-white transition-colors">60%</span>
                                <span className="text-[10px] uppercase tracking-widest text-[#ccff00]">Recycled</span>
                            </div>
                        </div>
                        <h4 className="text-3xl font-bold text-black dark:text-white mb-2 transition-colors">+ 40%</h4>
                        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors">Virgin Cotton.<br />Perfect blend of sustainability.</p>
                    </div>

                    {/* Stage 3 pt1 (Top Mid-L) */}
                    <div className="md:col-span-1 md:row-span-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-center group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-colors duration-500">
                        <div className="flex items-end gap-2 mb-2">
                            <h3 className="text-4xl font-bold text-black dark:text-white group-hover:text-[#ccff00] transition-colors">Pure</h3>
                            <span className="text-sm pb-1 text-[#ccff00]">Fibers</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">Mechanical shredding breaks fabrics back to their core. Ready for rebirth.</p>
                    </div>

                    {/* Stage 3 pt2 (Top Mid-R) */}
                    <div className="md:col-span-1 md:row-span-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-center items-end text-right group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-colors duration-500">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors">No Chemicals</p>
                        <h3 className="text-5xl font-bold text-black dark:text-white mb-1 group-hover:scale-105 transition-transform origin-right">0%</h3>
                        <p className="text-[#e78b1f] text-sm font-bold">Dyes used</p>
                    </div>

                    {/* Stage 2 (Top Right) */}
                    <div className="md:col-span-1 md:row-span-2 bg-white dark:bg-[#222222] border border-gray-100 dark:border-transparent transition-colors duration-500 rounded-[2rem] p-8 flex flex-col justify-between group cursor-pointer shadow-sm">
                        <div>
                            <h3 className="text-lg font-bold text-black dark:text-white mb-6 leading-snug transition-colors">Every piece is sorted by hand. Quality matters, even in waste.</h3>
                            <div className="flex -space-x-3 mb-8">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                <img src="https://images.unsplash.com/photo-1589156280159-4cbcdce4b07e?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] bg-[#ccff00] text-black flex items-center justify-center text-xs font-bold transition-colors">+</div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors">Rural Women Employed</p>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-6xl font-bold text-black dark:text-white group-hover:-translate-y-2 transition-transform transition-colors">50</h2>
                                <span className="text-[#ccff00] text-xl font-bold">+</span>
                            </div>
                        </div>
                    </div>

                    {/* Stage 1 (Center Big) */}
                    <div className="md:col-span-2 md:row-span-2 rounded-[2rem] relative flex items-center justify-center p-0 overflow-hidden group cursor-pointer shadow-sm">
                        <img src="https://images.unsplash.com/photo-1532453288672-3a27e9be2efd?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Collection" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 dark:from-[#171717] dark:via-[#171717]/40 to-transparent transition-colors duration-500"></div>

                        <div className="absolute left-6 bottom-1/3 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 p-3 rounded-2xl flex items-center gap-3 group-hover:-translate-y-2 transition-all duration-500 delay-100">
                            <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center text-black">
                                <ArrowUpRight size={16} />
                            </div>
                            <div>
                                <p className="text-black dark:text-white font-bold text-sm transition-colors">3 kg CO2</p>
                                <div className="w-16 h-1 bg-black/20 dark:bg-white/30 rounded-full mt-1"><div className="w-2/3 h-full bg-[#ccff00] rounded-full"></div></div>
                            </div>
                        </div>

                        <div className="absolute right-6 bottom-1/4 bg-white/80 dark:bg-[#1a1a1a] backdrop-blur-md border border-black/10 dark:border-white/10 p-5 rounded-2xl text-black dark:text-white group-hover:-translate-y-2 transition-all duration-500 delay-200">
                            <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center absolute top-3 right-3 text-[#ccff00] text-xs transition-colors">♥</div>
                            <h3 className="text-2xl font-bold mb-1">1 kg</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 transition-colors">Collected Textiles</p>
                            <p className="text-[#22c55e] text-xs font-bold flex items-center gap-1">▲ Prevented</p>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 z-10 pointers-events-none">
                            <span className="bg-[#ccff00] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Stage 1: Collection</span>
                            <p className="text-black dark:text-white text-base md:text-lg font-medium leading-snug w-full md:w-3/4 transition-colors">
                                &quot;It starts with you. Old clothes, worn linens, forgotten fabrics—we collect them before they reach the landfill.&quot;
                            </p>
                        </div>
                    </div>

                    {/* Stage 5 (Bottom Left) */}
                    <div className="md:col-span-1 md:row-span-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col items-center group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-colors duration-500 shadow-sm">
                        <div className="bg-[#ccff00] text-black text-xl font-bold rounded-2xl p-4 text-center w-full mb-6">
                            Ancient Craft <br /> + Sustainability
                        </div>
                        <div className="relative w-full h-32 mb-6 flex justify-center items-center">
                            <img src="https://images.unsplash.com/photo-1445583934335-ce065b75a40a?q=80&w=400&auto=format&fit=crop" className="w-20 h-28 rounded-[1rem] object-cover absolute -rotate-12 group-hover:rotate-0 transition-transform duration-500" alt="Weaving 1" />
                            <img src="https://images.unsplash.com/photo-1605280263929-1c42c62ef169?q=80&w=400&auto=format&fit=crop" className="w-20 h-28 rounded-[1rem] object-cover absolute rotate-12 mt-8 ml-8 group-hover:rotate-0 transition-transform duration-500 delay-100 border-2 border-white dark:border-[#1a1a1a] transition-colors" alt="Weaving 2" />
                        </div>
                        <p className="text-black dark:text-white text-center text-sm font-medium leading-relaxed mt-4 transition-colors">
                            Traditional looms weave rescued fibers into premium sheets. Each takes 4 hours, touching 12 pairs of skilled hands.
                        </p>
                    </div>

                    {/* Stage 6 pt1 (Middle Right - CUBO equivalent) */}
                    <div className="md:col-span-1 md:row-span-1 bg-white dark:bg-[#222222] border border-gray-100 dark:border-transparent transition-colors duration-500 rounded-[2rem] flex flex-col items-center justify-center p-6 group cursor-pointer overflow-hidden relative shadow-sm">
                        <div className="w-16 h-16 border-4 border-black/10 dark:border-white/20 rounded-full flex items-center justify-center relative mb-4 group-hover:scale-110 transition-transform duration-300">
                            <div className="w-6 h-6 border-4 border-[#ccff00] rounded-full absolute -top-2"></div>
                            <div className="w-6 h-6 border-4 border-black dark:border-white rounded-full absolute -bottom-1 -left-1 transition-colors"></div>
                            <div className="w-6 h-6 border-4 border-[#e78b1f] rounded-full absolute -bottom-1 -right-1"></div>
                        </div>
                        <h3 className="text-xl font-bold text-black dark:text-white tracking-widest transition-colors">OEKO-TEX®</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Certified</p>
                    </div>

                    {/* Stage 6 pt2 (Bottom Mid-L - Color Swatches equivalent) */}
                    <div className="md:col-span-1 md:row-span-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-between group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-colors duration-500 shadow-sm">
                        <div>
                            <h3 className="text-3xl font-bold text-black dark:text-white mb-1 transition-colors">300 TC</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest transition-colors">Quality Note</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-[#222222] group-hover:bg-white transition-colors duration-300 delay-0"></div>
                            <div className="w-10 h-10 rounded-xl bg-gray-300 dark:bg-[#333333] group-hover:bg-[#ccff00] transition-colors duration-300 delay-75"></div>
                            <div className="w-10 h-10 rounded-xl bg-gray-400 dark:bg-[#444444] group-hover:bg-[#e78b1f] transition-colors duration-300 delay-150"></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 font-medium transition-colors">Softer than conventional cotton.</p>
                    </div>

                    {/* Stage 6 pt3 (Bottom Right - We Build Future equivalent) */}
                    <div className="md:col-span-2 md:row-span-1 bg-[#ccff00] rounded-[2rem] p-8 flex items-center justify-between group cursor-pointer overflow-hidden relative shadow-sm">
                        <div className="z-10 relative">
                            <p className="text-black/50 text-[10px] font-bold uppercase tracking-widest mb-2">Stage 6: Finishing & Quality</p>
                            <h2 className="text-3xl md:text-5xl font-bold text-black mb-2 leading-none tracking-tighter">Waste,<br />Reimagined.</h2>
                            <p className="text-black/80 text-sm font-semibold max-w-[200px] mt-4">Every sheet passes 7 quality checks before reaching you.</p>
                        </div>
                        <div className="absolute -right-10 -top-10 text-black/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                            <Star size={240} fill="currentColor" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
