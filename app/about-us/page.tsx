"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import BlurImage from '@/components/BlurImage';
import { Factory, Recycle, Activity, Droplets, LineChart, Leaf, ArrowRight, ArrowDown } from 'lucide-react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}



export default function AboutUsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Hero entry animation
        const heroTl = gsap.timeline({ delay: 0.2 });
        heroTl.fromTo('.hero-badge',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        )
        .fromTo('.hero-title',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power4.out" },
            "-=0.6"
        )
        .fromTo('.hero-subtitle',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
        );

        // Section reveal animations
        const sections = gsap.utils.toArray('.animate-section') as HTMLElement[];
        sections.forEach((section: HTMLElement) => {
            gsap.set(section, { opacity: 0, y: 50 });
            gsap.to(section, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                }
            });
        });



    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="relative min-h-screen bg-[#e0e1e5]/10 dark:bg-[#0a0a0a] pt-[20vh] pb-32 overflow-hidden font-sans text-black dark:text-white transition-colors duration-500">
            


            {/* HERO SECTION */}
            <section className="relative w-full max-w-[1000px] mx-auto flex flex-col items-center justify-center text-center px-4 md:px-8 mb-32 z-10">
                {/* Animated Subtle Gradient Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] sm:w-full min-w-[500px] max-w-[800px] aspect-square -z-10 pointer-events-none opacity-60 md:opacity-40 dark:opacity-40 md:dark:opacity-20 blur-[60px] md:blur-[120px] saturate-200 transition-opacity duration-1000 overflow-hidden">
                    <div className="absolute top-[10%] left-[10%] md:left-[20%] w-[60%] md:w-[50%] h-[60%] md:h-[50%] bg-[#ccff00] rounded-full mix-blend-multiply dark:mix-blend-screen filter animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
                    <div className="absolute bottom-[10%] right-[10%] md:right-[20%] w-[60%] md:w-[50%] h-[60%] md:h-[50%] bg-[#88aa00] rounded-full mix-blend-multiply dark:mix-blend-screen filter animate-[pulse_5s_cubic-bezier(0.4,0,0.6,1)_infinite]" style={{ animationDelay: '1s' }}></div>
                </div>

                <span className="hero-badge bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/20 font-semibold tracking-widest text-[10px] sm:text-xs px-6 py-2 rounded-full uppercase mb-8">
                    About Us
                </span>
                
                <h1 className="hero-title text-5xl sm:text-6xl md:text-[5rem] lg:text-[7rem] font-black leading-[0.9] tracking-tighter text-center uppercase mb-6 flex flex-col">
                    <span>WEINIX</span>
                    <span className="font-serif italic font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black/60 dark:text-white/60 tracking-normal capitalize mt-2 md:mt-4">
                        Where Waste Becomes Resource
                    </span>
                </h1>

                <p className="hero-subtitle text-sm md:text-base font-medium tracking-wide text-black/70 dark:text-white/70 max-w-2xl mx-auto leading-relaxed mt-4 mb-10">
                    Weinix is the recycling and material recovery engine powering the circular fashion economy. While Re-verse collects post-consumer clothing waste, Weinix transforms it.
                </p>

                <div className="hero-badge mt-4">
                    <button className="bg-[#ccff00] text-black font-bold tracking-widest text-xs md:text-sm px-8 py-4 rounded-full shadow-[0_8px_30px_rgba(204,255,0,0.2)] hover:scale-[1.03] transition-transform duration-300 uppercase">
                        We are infrastructure, not a charity
                    </button>
                </div>
            </section>

            {/* BENTO GRID 1: THE PROBLEM & SOLUTION */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto animate-section mb-32 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* The Problem (Large Card) */}
                    <div className="md:col-span-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between group cursor-pointer hover:border-black/10 transition-colors duration-700">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-6 leading-[1.1]">The Problem We Solve.</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-xl transition-colors font-medium">
                                Millions of tonnes of clothing are discarded annually—shoved into landfills, burned, or left to leach microplastics. Standard industry practice treats garments as disposable, ignoring the locked-in value of their raw materials.
                            </p>
                        </div>
                        <div className="mt-12 bg-gray-50 dark:bg-[#222] p-6 rounded-2xl border border-gray-100 dark:border-white/5 group-hover:bg-[#ccff00]/5 transition-colors duration-500">
                            <p className="text-black dark:text-white font-semibold text-sm md:text-base leading-relaxed border-l-4 border-[#ccff00] pl-4">
                                Weinix exists to unlock that value. We recover cotton fibers, polyester threads, and blended textiles, executing industrial-scale material recovery to ensure absolutely nothing ends up in a dumping yard.
                            </p>
                        </div>
                    </div>

                    {/* Stat Card */}
                    <div className="md:col-span-1 bg-[#ccff00] border border-transparent rounded-[2rem] p-8 flex flex-col items-center justify-center text-center text-black group overflow-hidden relative cursor-pointer active:scale-[0.98] transition-all duration-700">
                        <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-12 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 pointer-events-none">
                            <Leaf size={250} />
                        </div>
                        <h3 className="text-7xl font-black tracking-tighter mb-1 z-10 w-full flex justify-center items-end">
                            100<span className="text-3xl pb-2">%</span>
                        </h3>
                        <p className="font-bold uppercase tracking-widest text-xs z-10 mb-2">Zero Landfill</p>
                        <p className="text-black/70 text-xs font-semibold max-w-[200px] z-10">Absolute diversion of post-consumer waste from environmental degradation.</p>
                    </div>

                </div>
            </section>

            {/* PIPELINE (HOW IT WORKS) - HORIZONTAL BENTO */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto animate-section mb-32 relative z-10">
                <div className="mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-2">The Process</h2>
                    <p className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs font-bold">Structured Recovery Pipeline</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        { step: "01", title: "Sorting / Grading", desc: "Categorized by material composition, condition, and fiber type for optimal recovery." },
                        { step: "02", title: "Shredding", desc: "Garments are mechanically shredded into reusable raw fiber feedstock. No chemicals." },
                        { step: "03", title: "Blending", desc: "Fibers blended in precise ratios to engineer highly consistent material properties." },
                        { step: "04", title: "Thermal Press", desc: "Processed under extreme heat and pressure to cast secondary solid commodities." },
                        { step: "05", title: "Distribution", desc: "Deployed to manufacturing and construction sectors as sustainable input material." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-between transition-colors duration-700 group cursor-pointer active:scale-[0.98]">
                            <div>
                                <div className="text-[#ccff00] font-bold text-xl mb-4 group-hover:scale-110 transition-transform origin-left">{item.step}</div>
                                <h3 className="text-lg font-bold mb-3 tracking-tight leading-snug">{item.title}</h3>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* BENTO GRID 2: CREATION & IMPACT */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto animate-section mb-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
                    
                    {/* What We Create */}
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden relative group cursor-pointer transition-colors duration-700 active:scale-[0.98]">
                        <div className="relative z-10 w-full mb-8">
                            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-4 text-black dark:text-white">What We Build</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium max-w-sm">
                                We engineer high-performance secondary commodities, deploying recovered materials back into active industrial life cycles.
                            </p>
                        </div>
                        
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            {[
                                { text: "Fiber insulation for construction.", icon: Recycle },
                                { text: "Fabrics for industrial packaging.", icon: Recycle },
                                { text: "Composite padding for logistics.", icon: Recycle },
                                { text: "Boards replacing virgin wood.", icon: Recycle }
                            ].map((item, i) => (
                                <div key={i} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group/mini">
                                    <item.icon className="text-[#ccff00] mb-3 group-hover/mini:scale-110 transition-transform origin-bottom-left" size={20} />
                                    <p className="text-[11px] leading-relaxed font-semibold text-black/60 dark:text-white/50">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Impact Measured */}
                    <div className="bg-[#111] text-white border border-transparent rounded-[2rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden relative group cursor-pointer active:scale-[0.98] transition-all duration-700">
                         {/* Subtle grid bg */}
                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-4 text-[#ccff00]">Impact Metrics.</h2>
                            <p className="text-white/60 text-sm md:text-base font-medium mb-8 max-w-sm">Every kilogram processed translates to quantifiable impact. We do not just claim sustainability — we measure it.</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#ccff00]/50 transition-colors group/mini">
                                    <Leaf className="text-[#ccff00] mb-3 group-hover/mini:scale-110 transition-transform origin-bottom-left" size={20} />
                                    <h4 className="font-bold text-xs uppercase tracking-widest mb-1">Carbon</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed">Displacing virgin material production entirely.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors group/mini">
                                    <Droplets className="text-white mb-3 group-hover/mini:scale-110 transition-transform origin-bottom-left" size={20} />
                                    <h4 className="font-bold text-xs uppercase tracking-widest mb-1">Water</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed">Eliminates the massive need for crop cultivation.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors group/mini">
                                    <Activity className="text-white mb-3 group-hover/mini:scale-110 transition-transform origin-bottom-left" size={20} />
                                    <h4 className="font-bold text-xs uppercase tracking-widest mb-1">Volume</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed">Exact mass diverted tracked per cycle.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#ccff00]/50 transition-colors group/mini">
                                    <LineChart className="text-[#ccff00] mb-3 group-hover/mini:scale-110 transition-transform origin-bottom-left" size={20} />
                                    <h4 className="font-bold text-xs uppercase tracking-widest mb-1">Market</h4>
                                    <p className="text-[11px] text-white/50 leading-relaxed">Creating secondary commodity liquidity.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* CIRCULAR LOOP - MASSIVE BENTO CARD */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto animate-section mb-32 relative z-10">
                 <div className="bg-white dark:bg-[#222] border border-gray-100 dark:border-transparent rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all duration-700">
                     {/* Background overlay image clipping */}
                    <div className="absolute inset-0 z-0 bg-gray-100 dark:bg-[#111]">
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 dark:from-[#0a0a0a] dark:via-[#111111]/40 to-transparent transition-colors duration-500 z-10"></div>
                        <div className="absolute inset-x-0 bottom-0 z-0 flex items-end justify-center pointer-events-none opacity-40 mix-blend-overlay">
                            <BlurImage src="mesh.png" className="w-[120%] h-[120%] object-cover group-hover:scale-105 transition-transform duration-[2000ms] origin-bottom" alt="Mesh Background" />
                        </div>
                    </div>

                    <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
                        <div className="bg-black text-[#ccff00] text-[10px] sm:text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-8 inline-block shadow-xl">
                            The Complete Model
                        </div>

                        <h3 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-black dark:text-white text-balance drop-shadow-sm">
                            Where Waste <br className="hidden md:block" /> Never Truly Dies.
                        </h3>
                        
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs md:text-sm font-bold uppercase tracking-widest text-[#88aa00] dark:text-[#ccff00] mb-8 drop-shadow-md bg-white/80 dark:bg-black/50 backdrop-blur-md px-8 py-4 rounded-[1.5rem] border border-black/5 dark:border-white/10">
                            <span>Re-verse Collects</span>
                            <ArrowRight size={14} className="hidden md:block opacity-50 text-black dark:text-white" />
                            <ArrowDown size={14} className="md:hidden opacity-50 text-black dark:text-white" />
                            <span className="text-black dark:text-white">Weinix Recovers</span>
                            <ArrowRight size={14} className="hidden md:block opacity-50 text-black dark:text-white" />
                            <ArrowDown size={14} className="md:hidden opacity-50 text-black dark:text-white" />
                            <span>Industry Reuses</span>
                            <ArrowRight size={14} className="hidden md:block opacity-50 text-black dark:text-white" />
                            <ArrowDown size={14} className="md:hidden opacity-50 text-black dark:text-white" />
                            <span className="text-black dark:text-white">Re-verse Reintroduces</span>
                        </div>

                        <p className="font-serif italic text-2xl md:text-3xl text-black/60 dark:text-white/60">
                            It transforms.
                        </p>
                    </div>
                </div>
            </section>

            {/* LEADERSHIP */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto animate-section mb-32 relative z-10">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-2">Leadership</h2>
                    <p className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs font-bold">The Visionaries behind the infrastructure</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Laksh */}
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start group transition-colors duration-700 cursor-pointer active:scale-[0.98]">
                        <div className="w-32 h-32 md:w-32 md:h-32 shrink-0 rounded-[1.5rem] overflow-hidden border-2 border-white dark:border-[#222] shadow-sm relative">
                            <div className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1000ms] ease-[cubic-bezier(0.87,0,0.13,1)]">
                                <BlurImage src="laksh sharma.webp" alt="Laksh Sharma" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h3 className="text-2xl font-bold mb-1 tracking-tight">Laksh Sharma</h3>
                            <p className="text-[#ccff00] text-[10px] uppercase tracking-widest font-bold mb-4 drop-shadow-sm">CEO & Co-Founder</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed font-medium transition-colors">
                                With deep roots in apparel manufacturing, Laksh brings firsthand knowledge of material production cycles. His mission is to make end-of-life material recovery as economically compelling as first-use manufacturing.
                            </p>
                        </div>
                    </div>

                    {/* Deep */}
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start group transition-colors duration-700 cursor-pointer active:scale-[0.98]">
                        <div className="w-32 h-32 md:w-32 md:h-32 shrink-0 rounded-[1.5rem] overflow-hidden border-2 border-white dark:border-[#222] shadow-sm relative">
                            <div className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1000ms] ease-[cubic-bezier(0.87,0,0.13,1)]">
                                <BlurImage src="deeppatel.webp" alt="Deep Patel" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h3 className="text-2xl font-bold mb-1 tracking-tight">Deep Patel</h3>
                            <p className="text-[#ccff00] text-[10px] uppercase tracking-widest font-bold mb-4 drop-shadow-sm">COO</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed font-medium transition-colors">
                                With a mechanical engineering background, Deep architects the processing workflows and systems that make high-volume waste recovery operationally viable. He ensures Weinix scales without compromising output.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VISION STATEMENT */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto animate-section relative z-10">
                <div className="bg-[#ccff00] text-black border border-black/10 rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all duration-700">
                    {/* Interactive background blobbiness simulation on hover */}
                    <div className="absolute top-0 left-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise-lines.png")'}}></div>
                    
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h2 className="text-xs uppercase tracking-[0.3em] font-black mb-8 opacity-60">Our Vision</h2>
                        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1] mb-8 drop-shadow-sm">
                            A future where no garment ends its life in a landfill.
                        </p>
                        <p className="font-semibold text-black/80 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed border-t border-black/10 pt-8 mt-8">
                            Where waste is not a disposal problem but a sourcing opportunity. <br className="hidden md:block" /> Weinix is building the industrial backbone that makes that future possible — <span className="underline decoration-2 underline-offset-4 decoration-black/30">one tonne of recovered fiber at a time.</span>
                        </p>
                    </div>
                </div>
            </section>

        </main>
    );
}
