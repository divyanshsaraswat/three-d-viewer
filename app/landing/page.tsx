"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Search, Menu, ArrowRight, ArrowUpRight, Play, Star, ArrowDown, ShoppingCart } from 'lucide-react';
import HeroImageBlob from '@/components/HeroImageBlob';
import ProductCarousel from '@/components/ProductCarousel';
import FullScreenMenu from '@/components/FullScreenMenu';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeAccordion, setActiveAccordion] = useState<number>(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const specializations = [
        "Architecture",
        "Interior Design",
        "Masterplan",
        "Construction",
        "Documentation"
    ];

    const projects = [
        { title: "Crescent", subtitle: "2024 / COMMERCIAL", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" },
        { title: "Ventureplex", subtitle: "2024 / CORPORATE", image: "https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=800&auto=format&fit=crop", active: true },
        { title: "Horizon", subtitle: "2023 / RESIDENTIAL", image: "https://images.unsplash.com/photo-1545622744-8d4cb237deaf?q=80&w=800&auto=format&fit=crop" },
    ];

    useGSAP(() => {
        // Section reveal animations
        const sections = gsap.utils.toArray('.animate-section') as HTMLElement[];
        sections.forEach((section: HTMLElement) => {
            gsap.fromTo(section,
                { autoAlpha: 0, y: 50 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                    }
                }
            );
        });

        // Spinning badge
        gsap.to('.spinning-badge', {
            rotation: 360,
            duration: 10,
            repeat: -1,
            ease: "linear"
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="bg-[#f5f5f5] text-[#171717] min-h-screen overflow-hidden font-sans">

            {/* ---------- NAVBAR ---------- */}
            <nav className="fixed w-full z-50 px-6 py-5 flex items-center justify-between mix-blend-difference top-0 left-0 bg-transparent">
                <div className="flex items-center gap-3 font-bold text-xl tracking-tighter text-white">
                    <div className="w-4 h-4 bg-[#ccff00] transform rotate-45 rounded-sm" />
                    <span>AXIOM BUILD</span>
                </div>
                <div className="hidden md:flex gap-10 text-xs uppercase tracking-widest font-semibold text-white">
                    <a href="#" className="text-[#ccff00]">Home</a>
                    <a href="#" className="hover:text-[#ccff00] transition-colors">Project</a>
                    <a href="#" className="hover:text-[#ccff00] transition-colors">Service</a>
                    <a href="#" className="hover:text-[#ccff00] transition-colors">Blog</a>
                </div>
                <div className="flex items-center gap-6 text-white">
                    <button className="hover:text-[#ccff00] transition-colors cursor-pointer"><Search size={18} /></button>
                    <button className="hover:text-[#ccff00] transition-colors cursor-pointer"><ShoppingCart size={22} /></button>
                    <button className="hover:text-[#ccff00] transition-colors cursor-pointer" onClick={() => setIsMenuOpen(true)}>
                        <Menu size={22} />
                    </button>
                </div>
            </nav>

            {/* ---------- HERO SECTION ---------- */}
            <section className="relative min-h-[110vh] flex flex-col items-center pt-36 pb-8 px-4 md:px-8 bg-[#171717] rounded-b-[3rem] text-white overflow-hidden">
                {/* Content Overlay */}
                <div className="w-full max-w-[1400px] mx-auto z-10 animate-section flex flex-col items-center justify-center pointer-events-none relative mt-8">
                    <h1 className="text-[10vw] md:text-[9rem] font-bold uppercase leading-[0.85] tracking-tighter text-center">
                        BOLD DESIGNS
                    </h1>

                    {/* Centered Consultation Badge */}
                    <div className="spinning-badge absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-[#e78b1f] rounded-full flex flex-col items-center justify-center text-white font-bold text-[10px] md:text-sm text-center tracking-widest z-40 pointer-events-auto cursor-pointer shadow-xl hover:scale-105 transition-transform border border-white/10 uppercase">
                        <span>Get a</span>
                        <span>Consultation</span>
                        <ArrowDown size={14} className="mt-1" />
                    </div>

                    <h1 className="text-[10vw] md:text-[9rem] font-bold uppercase leading-[0.85] tracking-tighter text-center mt-2">
                        TIMELESS ARCHITECTURE
                    </h1>
                </div>

                {/* 3D Image Blob (Rendered as an overlapping object) */}
                <div className="relative w-full max-w-[1200px] h-[70vh] md:h-[800px] mt-[-4rem] md:mt-[-10rem] z-30 pointer-events-auto">
                    <HeroImageBlob
                        imageOne="build-1.png"
                        imageTwo="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                    />
                </div>
            </section>

            {/* ---------- TRANSFORMATION STORY (BENTO GRID) ---------- */}
            <section className="py-24 px-4 md:px-8 max-w-[1600px] mx-auto bg-[#171717] text-white">
                <div className="text-center mb-20 animate-section">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-[#ccff00]">Transformation Story</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        From Waste to Worth: Follow the journey of how we reclaim discarded textiles and transform them into premium, sustainable luxury.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[repeat(4,_minmax(260px,_auto))] gap-4 h-auto animate-section">

                    {/* Stage 4 (Top Left) */}
                    <div className="md:col-span-1 md:row-span-2 bg-[#222222] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group relative overflow-hidden cursor-pointer">
                        <h3 className="text-xl font-bold mb-8 text-white">Fiber Blending</h3>
                        <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="100.48" className="text-[#ccff00] transition-all duration-1000 group-hover:strokeDashoffset-0" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-bold text-white">60%</span>
                                <span className="text-[10px] uppercase tracking-widest text-[#ccff00]">Recycled</span>
                            </div>
                        </div>
                        <h4 className="text-3xl font-bold text-white mb-2">+ 40%</h4>
                        <p className="text-xs uppercase tracking-widest text-gray-400">Virgin Cotton.<br />Perfect blend of sustainability.</p>
                    </div>

                    {/* Stage 3 pt1 (Top Mid-L) */}
                    <div className="md:col-span-1 md:row-span-1 bg-[#1a1a1a] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-center group cursor-pointer hover:border-white/10 transition-colors">
                        <div className="flex items-end gap-2 mb-2">
                            <h3 className="text-4xl font-bold text-white group-hover:text-[#ccff00] transition-colors">Pure</h3>
                            <span className="text-sm pb-1 text-[#ccff00]">Fibers</span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Mechanical shredding breaks fabrics back to their core. Ready for rebirth.</p>
                    </div>

                    {/* Stage 3 pt2 (Top Mid-R) */}
                    <div className="md:col-span-1 md:row-span-1 bg-[#1a1a1a] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-center items-end text-right group cursor-pointer hover:border-white/10 transition-colors">
                        <p className="text-xs text-gray-400 mb-2">No Chemicals</p>
                        <h3 className="text-5xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-right">0%</h3>
                        <p className="text-[#e78b1f] text-sm font-bold">Dyes used</p>
                    </div>

                    {/* Stage 2 (Top Right) */}
                    <div className="md:col-span-1 md:row-span-2 bg-[#222222] rounded-[2rem] p-8 flex flex-col justify-between group cursor-pointer">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6 leading-snug">Every piece is sorted by hand. Quality matters, even in waste.</h3>
                            <div className="flex -space-x-3 mb-8">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                <img src="https://images.unsplash.com/photo-1589156280159-4cbcdce4b07e?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                <div className="w-10 h-10 rounded-full border-2 border-[#222222] bg-[#ccff00] text-black flex items-center justify-center text-xs font-bold">+</div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Rural Women Employed</p>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-6xl font-bold text-white group-hover:-translate-y-2 transition-transform">50</h2>
                                <span className="text-[#ccff00] text-xl font-bold">+</span>
                            </div>
                        </div>
                    </div>

                    {/* Stage 1 (Center Big) */}
                    <div className="md:col-span-2 md:row-span-2 rounded-[2rem] relative flex items-center justify-center p-0 overflow-hidden group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1532453288672-3a27e9be2efd?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Collection" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/40 to-transparent"></div>

                        <div className="absolute left-6 bottom-1/3 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3 group-hover:-translate-y-2 transition-transform duration-500 delay-100">
                            <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center text-black">
                                <ArrowUpRight size={16} />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">3 kg CO2</p>
                                <div className="w-16 h-1 bg-white/30 rounded-full mt-1"><div className="w-2/3 h-full bg-[#ccff00] rounded-full"></div></div>
                            </div>
                        </div>

                        <div className="absolute right-6 bottom-1/4 bg-[#1a1a1a] border border-white/10 p-5 rounded-2xl text-white group-hover:-translate-y-2 transition-transform duration-500 delay-200">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center absolute top-3 right-3 text-[#ccff00] text-xs">♥</div>
                            <h3 className="text-2xl font-bold mb-1">1 kg</h3>
                            <p className="text-xs text-gray-400 font-semibold mb-2">Collected Textiles</p>
                            <p className="text-[#22c55e] text-xs font-bold flex items-center gap-1">▲ Prevented</p>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 z-10 pointers-events-none">
                            <span className="bg-[#ccff00] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Stage 1: Collection</span>
                            <p className="text-white text-base md:text-lg font-medium leading-snug w-full md:w-3/4">
                                &quot;It starts with you. Old clothes, worn linens, forgotten fabrics—we collect them before they reach the landfill.&quot;
                            </p>
                        </div>
                    </div>

                    {/* Stage 5 (Bottom Left) */}
                    <div className="md:col-span-1 md:row-span-2 bg-[#1a1a1a] border border-white/5 rounded-[2rem] p-6 flex flex-col items-center group cursor-pointer hover:border-white/10 transition-colors">
                        <div className="bg-[#ccff00] text-black text-xl font-bold rounded-2xl p-4 text-center w-full mb-6">
                            Ancient Craft <br /> + Sustainability
                        </div>
                        <div className="relative w-full h-40 mb-6 flex justify-center items-center">
                            <img src="https://images.unsplash.com/photo-1445583934335-ce065b75a40a?q=80&w=400&auto=format&fit=crop" className="w-24 h-32 rounded-[1rem] object-cover absolute -rotate-12 group-hover:rotate-0 transition-transform duration-500" alt="Weaving 1" />
                            <img src="https://images.unsplash.com/photo-1605280263929-1c42c62ef169?q=80&w=400&auto=format&fit=crop" className="w-24 h-32 rounded-[1rem] object-cover absolute rotate-12 mt-8 ml-8 group-hover:rotate-0 transition-transform duration-500 delay-100 border-2 border-[#1a1a1a]" alt="Weaving 2" />
                        </div>
                        <p className="text-white text-center text-sm font-medium leading-relaxed mt-4">
                            Traditional looms weave rescued fibers into premium sheets. Each takes 4 hours, touching 12 pairs of skilled hands.
                        </p>
                    </div>

                    {/* Stage 6 pt1 (Middle Right - CUBO equivalent) */}
                    <div className="md:col-span-1 md:row-span-1 bg-[#222222] rounded-[2rem] flex flex-col items-center justify-center p-6 group cursor-pointer overflow-hidden relative">
                        <div className="w-16 h-16 border-4 border-white/20 rounded-full flex items-center justify-center relative mb-4 group-hover:scale-110 transition-transform duration-300">
                            <div className="w-6 h-6 border-4 border-[#ccff00] rounded-full absolute -top-2"></div>
                            <div className="w-6 h-6 border-4 border-white rounded-full absolute -bottom-1 -left-1"></div>
                            <div className="w-6 h-6 border-4 border-[#e78b1f] rounded-full absolute -bottom-1 -right-1"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-widest">OEKO-TEX®</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Certified</p>
                    </div>

                    {/* Stage 6 pt2 (Bottom Mid-L - Color Swatches equivalent) */}
                    <div className="md:col-span-1 md:row-span-1 bg-[#1a1a1a] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between group cursor-pointer hover:border-white/10 transition-colors">
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">300 TC</h3>
                            <p className="text-gray-400 text-xs uppercase tracking-widest">Quality Note</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <div className="w-10 h-10 rounded-xl bg-[#222222] group-hover:bg-white transition-colors duration-300 delay-0"></div>
                            <div className="w-10 h-10 rounded-xl bg-[#333333] group-hover:bg-[#ccff00] transition-colors duration-300 delay-75"></div>
                            <div className="w-10 h-10 rounded-xl bg-[#444444] group-hover:bg-[#e78b1f] transition-colors duration-300 delay-150"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 font-medium">Softer than conventional cotton.</p>
                    </div>

                    {/* Stage 6 pt3 (Bottom Right - We Build Future equivalent) */}
                    <div className="md:col-span-2 md:row-span-1 bg-[#ccff00] rounded-[2rem] p-8 flex items-center justify-between group cursor-pointer overflow-hidden relative">
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
            </section>

            {/* ---------- OUR SPECIALIZATION ---------- */}
            <section className="py-32 px-4 md:px-8 bg-[#121212] text-white">
                <div className="max-w-[1400px] mx-auto animate-section">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6">OUR SPECIALIZATION</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-sm uppercase tracking-widest leading-loose">
                            we translate our client&apos;s vision into highly curated design <br />
                            across diverse typologies
                        </p>
                    </div>

                    <div className="border-t border-white/20 max-w-4xl mx-auto">
                        {specializations.map((spec, idx) => (
                            <div
                                key={idx}
                                className={`border-b border-white/20 py-8 px-4 flex items-center justify-between cursor-pointer group transition-all ${activeAccordion === idx ? 'text-[#ccff00]' : 'text-white hover:text-gray-300'}`}
                                onMouseEnter={() => setActiveAccordion(idx)}
                            >
                                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">{spec}</h3>
                                <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <ArrowUpRight size={24} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- PRODUCT SHOWCASE (3D CAROUSEL) ---------- */}
            <ProductCarousel />

            {/* ---------- SELECTED WORKS (VIDEO BLOCK) ---------- */}
            <section className="py-32 px-4 md:px-8 bg-[#0a0a0a] text-white">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-16 animate-section">
                    <div className="md:w-1/3">
                        <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter mb-6">SELECTED<br />WORKS</h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            We translate our client&apos;s vision into highly curated design. We are dedicated to providing the best possible service for all our architectural endeavours.
                        </p>
                        <button className="bg-[#ccff00] text-[#171717] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
                            Explore
                        </button>
                    </div>

                    <div className="md:w-2/3 w-full flex gap-6">
                        <div className="w-[60%] h-[400px] rounded-3xl overflow-hidden relative cursor-pointer group">
                            <img src="https://images.unsplash.com/photo-1574519659052-780c7a523aee?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Building Video" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-[#ccff00] group-hover:text-black transition-colors pl-1">
                                    <Play size={24} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <div className="w-[40%] h-[400px] rounded-3xl overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Building Detail" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- GENERAL PURPOSE BUILDINGS ---------- */}
            <section className="py-32 px-4 md:px-8 max-w-[1400px] mx-auto relative animate-section">
                <div className="flex flex-col md:flex-row h-[600px] gap-8 relative z-0">
                    <div className="w-full md:w-1/2 h-full rounded-3xl overflow-hidden bg-[#007090]">
                        <img src="https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-overlay opacity-80" alt="White Architecture" />
                    </div>
                    <div className="w-full md:w-1/2 h-full pt-32">
                        <div className="w-full h-[80%] rounded-3xl overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Steel Architecture" />
                        </div>
                    </div>
                </div>
                {/* Floating overlapping white card */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[600px] bg-white p-12 rounded-3xl shadow-2xl z-10 border border-gray-100">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4 leading-tight">GENERAL<br />PURPOSE<br />BUILDINGS</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                        We translate our client&apos;s vision into highly curated design. We are dedicated to providing the best architecture, transforming skylines globally.
                    </p>
                    <button className="bg-[#171717] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#ccff00] hover:text-[#171717] transition-colors">
                        Discover <ArrowUpRight size={16} />
                    </button>
                </div>
            </section>

            {/* ---------- HONEST COMPARISON ---------- */}
            <section className="py-32 px-4 md:px-8 bg-[#121212] text-white">
                <div className="max-w-[1200px] mx-auto animate-section">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 text-white">Honest Comparison</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-sm uppercase tracking-widest leading-loose">
                            Weinix Recycled Sheets — Your Best Choice for Sustainability & Luxury
                        </p>
                    </div>

                    <div className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 border-b border-white/10 relative">
                            <div className="p-8 flex items-center">
                                <span className="font-bold text-xl uppercase tracking-widest text-gray-400">Features</span>
                            </div>
                            <div className="p-8 flex flex-col items-center justify-center text-center border-l border-white/5">
                                <span className="font-bold text-xl tracking-tighter">Conventional Cotton</span>
                            </div>
                            <div className="p-8 flex flex-col items-center justify-center text-center bg-[#ccff00]/5 border-l border-[#ccff00]/20 relative overflow-hidden group">
                                <div className="absolute top-0 w-full h-1 bg-[#ccff00]"></div>
                                <div className="w-12 h-12 rounded-full bg-[#ccff00]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Star size={24} className="text-[#ccff00]" />
                                </div>
                                <span className="font-bold text-xl tracking-tighter text-[#ccff00]">Weinix Recycled Sheets</span>
                            </div>
                        </div>

                        {/* Table Rows */}
                        {[
                            {
                                feature: "Water Usage",
                                conventional: "2,700L per sheet",
                                weinix: "200L per sheet (93% less)"
                            },
                            {
                                feature: "CO2 Emissions",
                                conventional: "5.5 kg",
                                weinix: "0.3 kg (95% less)"
                            },
                            {
                                feature: "Pesticides",
                                conventional: "150g toxic chemicals",
                                weinix: "0g (100% less)"
                            },
                            {
                                feature: "Thread Count",
                                conventional: "300",
                                weinix: "300 (same luxury)"
                            },
                            {
                                feature: "Softness",
                                conventional: "Standard",
                                weinix: "Softer (pre-washed fibers)"
                            },
                            {
                                feature: "Durability",
                                conventional: "2-3 years",
                                weinix: "3-5 years"
                            },
                            {
                                feature: "Price",
                                conventional: "₹₹₹",
                                weinix: "₹₹₹ (competitive)"
                            }
                        ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                                <div className="p-6 md:p-8 flex items-center">
                                    <span className="font-medium text-gray-300">{row.feature}</span>
                                </div>
                                <div className="p-6 md:p-8 flex items-center justify-center text-center border-l border-white/5 text-gray-400">
                                    <span>{row.conventional}</span>
                                </div>
                                <div className="p-6 md:p-8 flex items-center justify-center text-center bg-[#ccff00]/5 border-l border-[#ccff00]/20 text-white font-bold group-hover:bg-[#ccff00]/10 transition-colors">
                                    <span>{row.weinix}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- TESTIMONIALS ---------- */}
            <section className="py-32 px-4 md:px-8 max-w-[1400px] mx-auto text-center bg-[#f5f5f5]">
                <div className="animate-section mb-16">
                    <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6">WHAT ARE THEY<br />SAYING?</h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm uppercase tracking-widest leading-loose">
                        we translate our client&apos;s vision into highly curated design <br />
                        and deliver top-tier architectural results.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-section text-left">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Avatar" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Client Name {i + 1}</h4>
                                    <p className="text-xs text-gray-500 uppercase">Architecture Pro</p>
                                </div>
                            </div>
                            <h5 className="font-bold text-lg mb-4">Great Work</h5>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                &quot;They translate our client&apos;s vision into highly curated design. We are dedicated to providing the best possible service and they delivered beyond expectations. Truly remarkable.&quot;
                            </p>
                            <div className="flex text-[#ccff00]">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 animate-section">
                    <button className="bg-[#171717] text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#ccff00] hover:text-[#171717] transition-colors">
                        View All
                    </button>
                </div>
            </section>

            {/* ---------- FOOTER ---------- */}
            <footer className="bg-[#0a0a0a] text-white pt-24 pb-8 px-4 md:px-8">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 animate-section">

                    <div>
                        <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter text-white mb-6">
                            <div className="w-5 h-5 bg-[#ccff00] transform rotate-45 rounded-sm" />
                            <span>AXIOM BUILD</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-8">
                            Building difference through innovative design and unparalleled expertise in modern architecture.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-2xl font-bold uppercase tracking-tighter mb-8">Contact Us</h4>
                        <form className="space-y-6">
                            <div className="flex gap-6">
                                <input type="text" placeholder="First Name" className="w-full bg-transparent border-b border-white/20 pb-4 text-sm focus:outline-none focus:border-[#ccff00] transition-colors" />
                                <input type="text" placeholder="Last Name" className="w-full bg-transparent border-b border-white/20 pb-4 text-sm focus:outline-none focus:border-[#ccff00] transition-colors" />
                            </div>
                            <div className="flex items-end gap-6">
                                <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-white/20 pb-4 text-sm focus:outline-none focus:border-[#ccff00] transition-colors" />
                                <button type="button" className="bg-[#ccff00] text-[#171717] p-4 rounded-xl hover:bg-white transition-colors">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-widest">
                    <p>© 2024 Axiom Build. All Rights Reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </footer>

            <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>
    );
}
