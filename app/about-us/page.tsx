import React from 'react';
import BlurImage from '@/components/BlurImage';

export default function AboutUsPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-[15vh] pb-32 px-4 md:px-8 overflow-hidden font-geist">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-[20%] w-[60vw] h-[60vh] bg-[#ccff00] rounded-[100%] blur-[150px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* 1. UMBRELLA ORGANIZATION HERO */}
                <section className="mb-32 md:mb-48 text-center max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
                    <span className="inline-block py-2 px-4 rounded-full border border-black/10 dark:border-white/10 text-xs font-bold tracking-widest uppercase mb-8 text-black/60 dark:text-white/60 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                        Our Genesis
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black dark:text-white leading-[1.1] mb-8">
                        Powered by <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ccff00] to-[#88aa00]">
                            Umbrella Org.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-black/70 dark:text-white/70 leading-relaxed font-medium max-w-2xl mx-auto">
                        We are an initiative born from the vision of Umbrella Org, dedicated to proving that premium quality and absolute sustainability are not mutually exclusive. 
                        We reimagine waste into uncompromising luxury.
                    </p>
                </section>

                {/* 2. FOUNDERS SECTION */}
                <section>
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black dark:text-white">
                            The Visionaries
                        </h2>
                        <span className="text-[#ccff00] font-bold tracking-widest uppercase text-sm mt-4 md:mt-0">
                            Leadership Team
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        
                        {/* Founder 1 */}
                        <div className="group flex flex-col items-start w-full">
                            <div className="relative w-full aspect-[4/5] md:aspect-square mb-8 overflow-hidden rounded-[2rem] bg-gray-200 dark:bg-[#1a1a1a]">
                                <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-[2rem] z-20 pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Wrap BlurImage in an animating div so it doesn't fight Tailwind transitions */}
                                <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)]">
                                    <BlurImage 
                                        src="mesh.png" // Placeholder - Update with actual founder image
                                        alt="Founder One"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            
                            <div className="px-2">
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-2">Jane Doe</h3>
                                <p className="text-[#ccff00] font-bold text-sm uppercase tracking-widest mb-6">Co-Founder & CEO</p>
                                <p className="text-black/70 dark:text-white/70 leading-relaxed max-w-md">
                                    With over 15 years in sustainable material sciences, Jane pioneered the weaving techniques that allow us to transform rescued fibers into textiles that rival Egyptian cotton in softness and durability.
                                </p>
                            </div>
                        </div>

                        {/* Founder 2 (Offset structurally for aesthetic cascade) */}
                        <div className="group flex flex-col items-start w-full md:mt-32">
                            <div className="relative w-full aspect-[4/5] md:aspect-square mb-8 overflow-hidden rounded-[2rem] bg-gray-200 dark:bg-[#1a1a1a]">
                                <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-[2rem] z-20 pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)]">
                                    <BlurImage 
                                        src="weaving-1.webp" // Placeholder - Update with actual founder image
                                        alt="Founder Two"
                                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                    />
                                </div>
                            </div>
                            
                            <div className="px-2">
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-2">John Smith</h3>
                                <p className="text-[#ccff00] font-bold text-sm uppercase tracking-widest mb-6">Co-Founder & CCO</p>
                                <p className="text-black/70 dark:text-white/70 leading-relaxed max-w-md">
                                    John's background in Parisian luxury fashion houses drives the meticulous design and branding of Weinix. He ensures every seam, stitch, and pixel reflects uncompromising quality.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </main>
    );
}
