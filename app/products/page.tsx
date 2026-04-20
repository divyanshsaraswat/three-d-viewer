'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import BlurImage from '@/components/BlurImage';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PromotionalHero from '@/components/PromotionalHero';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface TexturePack {
    id: string;
    title: string;
    description: string;
    textures: { id: string, title: string, thumb: string, full: string }[];
}

export default function ProductsPage() {
    const [packs, setPacks] = useState<TexturePack[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/textures/packs1.json')
            .then(res => res.json())
            .then(data => setPacks(data));
    }, []);

    useGSAP(() => {
        if (packs.length === 0) return;

        // Header reveal
        gsap.fromTo('.header-reveal',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.15, delay: 0.1 }
        );

        // Section reveals
        const sections = gsap.utils.toArray('.pack-section') as HTMLElement[];
        sections.forEach((section) => {
            gsap.fromTo(section, 
                { opacity: 0, y: 40 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1.2, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 90%",
                    }
                }
            );

            const cards = section.querySelectorAll('.texture-card');
            gsap.fromTo(cards,
                { opacity: 0, scale: 0.9, x: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                    }
                }
            );
        });
        
    }, { dependencies: [packs], scope: containerRef });

    return (
        <main ref={containerRef} className="relative min-h-screen pt-[15vh] md:pt-[20vh] pb-32 overflow-hidden font-sans transition-colors duration-500 text-black dark:text-white bg-white dark:bg-[#0a0a0a]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                
                {/* HEADER */}
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6 header-reveal px-2">
                    <div>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-black dark:text-[#ccff00]">Store.</h1>
                        <p className="text-black/60 dark:text-white/60 font-medium text-sm md:text-lg max-w-xl leading-relaxed">
                            Zero-compromise surfaces engineered for the circular economy. Rebuilt from high-fidelity commodities into premium essentials.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-6 py-4 rounded-full shadow-lg">
                        <span className="text-black/80 dark:text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Monolith / V1 / 32 Variants</span>
                        <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse shadow-[0_0_12px_rgba(204,255,0,0.8)]"></div>
                    </div>
                </div>

                {/* PROMOTIONAL HERO */}
                <div className="w-full relative mb-12 header-reveal px-2">
                    <PromotionalHero />
                </div>

                {/* BRAND TICKER */}
                <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-white py-6 mb-32 border-y border-black/5 overflow-hidden header-reveal">
                    <div className="flex whitespace-nowrap animate-ticker">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex items-center gap-8 px-4">
                                <span className="text-sm md:text-base font-black text-black uppercase tracking-[0.2em]">Premium Materials</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></div>
                                <span className="text-sm md:text-base font-black text-black/20 uppercase tracking-[0.2em]">Certified Quality</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-black/10"></div>
                                <span className="text-sm md:text-base font-black text-black uppercase tracking-[0.2em]">Engineered for Reality</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></div>
                                <span className="text-sm md:text-base font-black text-black/20 uppercase tracking-[0.2em]">Circular Economy</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-black/10"></div>
                            </div>
                        ))}
                    </div>
                    
                    <style jsx>{`
                        @keyframes ticker {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-ticker {
                            animation: ticker 30s linear infinite;
                        }
                    `}</style>
                </div>

                {/* PACK SECTIONS */}
                <div className="space-y-32">
                    {packs.map((pack) => (
                        <section key={pack.id} className="pack-section">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 px-2">
                                <div className="max-w-2xl">
                                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black dark:text-white mb-2">
                                        {pack.title}
                                    </h2>
                                    <p className="text-black/50 dark:text-white/50 text-sm md:text-base font-medium">
                                        {pack.description}
                                    </p>
                                </div>
                            <div className="relative w-full overflow-hidden">
                                <div className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory pb-8 pt-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {pack.textures.map((texture) => (
                                        <Link 
                                            key={texture.id} 
                                            href={`/products/${pack.id}?texture=${texture.id}`}
                                            className="texture-card shrink-0 w-[280px] md:w-[420px] aspect-[4/3] md:aspect-square rounded-[2rem] overflow-hidden relative group cursor-pointer snap-start bg-gray-100 dark:bg-[#111] border border-black/5 dark:border-white/5 hover:scale-[1.02] transition-all duration-500 ease-out shadow-sm hover:shadow-2xl"
                                        >
                                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                            
                                            <BlurImage 
                                                src={texture.thumb} 
                                                alt={texture.title}
                                                className="w-full h-full object-cover origin-center group-hover:scale-105 transition-all duration-700 grayscale-[0.3] group-hover:grayscale-0"
                                            />

                                            <div className="absolute bottom-0 left-0 w-full p-8 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                <p className="text-[10px] font-bold text-[#ccff00] uppercase tracking-[0.2em] mb-2">Texture ID / {texture.id.split('_').pop()}</p>
                                                <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{texture.title}</h4>
                                            </div>
                                        </Link>
                                    ))}
                                    <div className="shrink-0 w-8 md:w-16"></div>
                                </div>
                            </div>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}
