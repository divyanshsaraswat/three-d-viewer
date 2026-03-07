import React from 'react';
import BlurImage from '@/components/BlurImage';
import { ShoppingBag, Smartphone, RefreshCcw, Truck } from 'lucide-react';

export default function AboutUsPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-[15vh] pb-32 px-4 md:px-8 overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-[20%] w-[60vw] h-[60vh] bg-[#2E8B57] rounded-[100%] blur-[150px] opacity-[0.05] dark:opacity-[0.08] pointer-events-none" />
            
            <div className="max-w-5xl mx-auto relative z-10 text-black dark:text-white transition-colors duration-500">
                
                {/* 1. HERO & INTRO */}
                <section className="mb-24 text-center flex flex-col items-center justify-center">
                    <span className="inline-block py-2 px-4 rounded-full border border-black/10 dark:border-white/10 text-xs font-bold tracking-widest uppercase mb-8 text-black/60 dark:text-white/60 bg-gray-50 dark:bg-black/50 backdrop-blur-sm">
                        About Us
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
                        Re-verse: <span className="text-[#2E8B57] font-serif italic font-normal">The Operating System for Circular Fashion</span>
                    </h1>
                    <p className="text-lg md:text-xl text-black/70 dark:text-white/70 max-w-3xl mx-auto leading-relaxed">
                        A circular economy driven sustainable fashion marketplace tracking apparel from production to end-of-life—creating transparency, accountability, and real residual value.
                    </p>
                </section>

                {/* 2. CORE PILLARS GRID */}
                <section className="mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Pillar 1 */}
                        <div className="bg-gray-50 dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-10 transition-colors">
                            <div className="w-12 h-12 bg-[#2E8B57] rounded-full flex items-center justify-center mb-6 text-[#2E8B57]">
                                <ShoppingBag strokeWidth={2} color='white' />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Traceable Marketplace</h3>
                            <p className="text-black/70 dark:text-white/70 leading-relaxed text-balance">
                                Every product sold is traceable. Its material origin, production journey, and ownership history are recorded from day one. Apparel is treated as a managed asset, not a disposable good.
                            </p>
                        </div>

                        {/* Pillar 2 */}
                        <div className="bg-gray-50 dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-10 transition-colors">
                            <div className="w-12 h-12 bg-[#2E8B57] rounded-full flex items-center justify-center mb-6 text-[#2E8B57]">
                                <Smartphone strokeWidth={2} color='white' />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Digital Wardrobe</h3>
                            <p className="text-black/70 dark:text-white/70 leading-relaxed text-balance">
                                A personal management system to catalog and verify your apparel. Proprietary valuation algorithms assign a base value, presenting a real-time assessment of your entire wardrobe's economic value.
                            </p>
                        </div>

                        {/* Pillar 3 */}
                        <div className="bg-gray-50 dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-10 transition-colors">
                            <div className="w-12 h-12 bg-[#2E8B57] rounded-full flex items-center justify-center mb-6 text-[#2E8B57]">
                                <RefreshCcw strokeWidth={2} color='white' />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Decentralized Trade Layer</h3>
                            <p className="text-black/70 dark:text-white/70 leading-relaxed text-balance">
                                Items become anonymously discoverable. Buyers place offers and transactions settle seamlessly via our integrated FinTech wallet, ensuring provenance, ownership integrity, and liquidity.
                            </p>
                        </div>

                        {/* Pillar 4 */}
                        <div className="bg-gray-50 dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-10 transition-colors bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#111] dark:to-[#1a1a1a]">
                            <div className="w-12 h-12 bg-[#2E8B57] rounded-full flex items-center justify-center mb-6 text-white shadow-lg">
                                <Truck strokeWidth={2} color='white' />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Waste Procurement</h3>
                            <p className="text-black/70 dark:text-white/70 leading-relaxed text-balance">
                                A gig-based logistics network absorbs large volumes of post-consumer clothing. We route collected waste to hubs where it is repurposed into secondary commodities, ensuring minimal landfill dependency.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 text-center max-w-4xl mx-auto">
                        <p className="text-xl md:text-3xl font-serif text-black dark:text-white leading-relaxed">
                            "Re-verse is not positioned as a fashion marketplace alone, but as an <span className="text-[#2E8B57] italic">infrastructure layer</span> for sustainable ownership, value preservation, and circular trade."
                        </p>
                    </div>
                </section>

                {/* 3. FOUNDERS SECTION */}
                <section className="max-w-4xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black dark:text-white font-serif">
                            Leadership
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-16">
                        
                        {/* Founder 1: Laksh Sharma */}
                        <div className="flex flex-col md:flex-row gap-8 items-center group">
                            <div className="w-full sm:w-2/3 md:w-1/3 shrink-0 mx-auto">
                                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[1rem] bg-gray-100 dark:bg-[#1a1a1a] shadow-xl">
                                    <div className="w-full h-full transform-gpu group-hover:scale-[1.05] transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform">
                                        <BlurImage 
                                            src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop" 
                                            alt="Laksh Sharma"
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-700 ease-in-out"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 text-center md:text-left pt-4">
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-2">Laksh Sharma</h3>
                                <p className="text-[#2E8B57] font-bold text-sm uppercase tracking-widest mb-6">Co-Founder & CEO</p>
                                <p className="text-black/70 dark:text-white/70 leading-relaxed text-lg max-w-xl mx-auto md:mx-0">
                                    With deep roots in the clothing industry, Laksh brings hands-on exposure to manufacturing processes rather than surface-level retail. His long-term vision is to drive manufacturing toward a net-zero future by redesigning how apparel is produced and reused—making sustainability economically viable.
                                </p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-black/10 dark:bg-white/10 my-4 hidden md:block" />

                        {/* Founder 2: Deep Patel */}
                        <div className="flex flex-col-reverse md:flex-row gap-8 items-center group">
                            <div className="flex-1 text-center md:text-right pt-4">
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-2">Deep Patel</h3>
                                <p className="text-[#2E8B57] font-bold text-sm uppercase tracking-widest mb-6">Co-Founder & COO</p>
                                <p className="text-black/70 dark:text-white/70 leading-relaxed text-lg max-w-xl mx-auto md:ml-auto md:mr-0">
                                    With a background in mechanical engineering, Deep brings a strong systems-oriented mindset. He leads day-to-day operations, translating the Re-verse vision into structured, highly optimized workflows. He enables the complex gig-based logistical models to scale with ruthless efficiency.
                                </p>
                            </div>

                            <div className="w-full sm:w-2/3 md:w-1/3 shrink-0 mx-auto">
                                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[1rem] bg-gray-100 dark:bg-[#1a1a1a] shadow-xl">
                                    <div className="w-full h-full transform-gpu group-hover:scale-[1.05] transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform">
                                        <BlurImage 
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" 
                                            alt="Deep Patel"
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-700 ease-in-out"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </main>
    );
}
