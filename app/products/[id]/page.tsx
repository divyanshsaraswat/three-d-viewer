"use client";

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import BlurImage from '@/components/BlurImage';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
// @ts-ignore
import { use } from 'react';

const productsData: Record<string, any> = {
    tshirt: {
        name: "Weinix Circles T-Shirt",
        price: "$20.00",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200",
        colors: ["Black", "White"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        description: "Part of our core collection, this t-shirt is made entirely from secondary commodities recovered from post-consumer waste. Its classic profile features a crew neckline and a relaxed fit. Additional details include a ribbed collar, sustainable stitching, and a bold circular design.",
        features: [
            "100% Recovered Fiber Construction",
            "Relaxed Core Fit",
            "Ribbed Crew Neckline",
            "Sustainable Stitching",
            "Zero Virgin Materials Used",
            "Machine Wash Cold"
        ]
    },
    cup: {
        name: "Weinix Stainless Cup",
        price: "$15.00",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
        colors: ["Steel", "Matte Black"],
        sizes: ["12oz", "16oz"],
        description: "Engineered from recycled industrial steel, this cup is virtually indestructible. Double-walled vacuum insulation keeps your drinks hot or cold for hours. The ultimate zero-waste companion for construction sites or the office.",
        features: [
            "Recycled Industrial Steel",
            "Double-Wall Vacuum Insulation",
            "Matte Powder Coat Finish",
            "Sweat-Free Exterior",
            "BPA-Free Lid Included"
        ]
    },
    mug: {
        name: "Weinix Industrial Mug",
        price: "$15.00",
        image: "https://images.unsplash.com/photo-1574226516831-2f54b73241ae?auto=format&fit=crop&q=80&w=800",
        colors: ["Black/Cork", "Gray/Wood"],
        sizes: ["10oz", "14oz"],
        description: "A ceramic-coated industrial mug featuring a natural cork base to protect surfaces and provide insulation. Designed for the toughest environments but styled for executive desks.",
        features: [
            "Ceramic Coating",
            "Natural Cork Base",
            "Ergonomic Handle",
            "Heat-Resistant Retainer"
        ]
    },
    bag: {
        name: "Weinix Drawstring Bag",
        price: "$12.00",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
        colors: ["Canvas Black"],
        sizes: ["Standard"],
        description: "A rugged drawstring bag spun from entirely recycled fabrics. Perfect for gym equipment, rapid travel, or carrying secondary commodities. Contains interior compartments for organization.",
        features: [
            "Recycled Woven Canvas",
            "Heavy Duty Drawstrings",
            "Reinforced Corner Anchors",
            "Water Resistant Interior"
        ]
    },
    hoodie: {
        name: "Weinix Heavy Hoodie",
        price: "$50.00",
        image: "https://images.unsplash.com/photo-1556821840-0062c3fdb1e2?auto=format&fit=crop&q=80&w=800",
        colors: ["Charcoal", "Onyx Black"],
        sizes: ["M", "L", "XL", "XXL"],
        description: "A heavyweight zip-up hoodie designed for absolute comfort and warmth. Woven using our proprietary recovered polyester threads, this hoodie feels incredibly dense. Features a full metal zipper and reinforced kangaroo pockets.",
        features: [
            "400GSM Heavyweight Fleece",
            "Recovered Polyester Core",
            "Industrial Metal Zipper",
            "Reinforced Kangaroo Pockets",
            "Drawstring Lock Eyelets"
        ]
    },
    onesie: {
        name: "Weinix Baby Onesie",
        price: "$10.00",
        image: "https://images.unsplash.com/photo-1522771930-78848d528717?auto=format&fit=crop&q=80&w=800",
        colors: ["Sand", "Olive"],
        sizes: ["0-3M", "3-6M", "6-12M"],
        description: "Incredibly soft, chemical-free organic apparel engineered for the next generation. We purify our recovered cotton fibers repeatedly to ensure an entirely hypoallergenic experience.",
        features: [
            "Hypoallergenic Restored Cotton",
            "Chemical-Free Processing",
            "Easy Snap Closures",
            "Ultra-Soft Breathability"
        ]
    }
};

export default function ProductDetail({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    // Unwrapping params for Next 15 compatibility dynamically
    const unwrappedParams = typeof params === 'object' && 'then' in params ? use(params) : params;
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const id = unwrappedParams.id;
    
    const [activeColor, setActiveColor] = useState(0);
    const [activeSize, setActiveSize] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Provide a generic fallback if product is missing
    const product = productsData[id] || {
        name: "Weinix Essential Gear",
        price: "$35.00",
        image: "https://images.unsplash.com/photo-1556821840-0062c3fdb1e2?auto=format&fit=crop&q=80&w=800",
        colors: ["Black", "Charcoal"],
        sizes: ["One Size"],
        description: "Standard industrial grade gear rebuilt from secondary commodities. Designed for absolute utility and zero compromise. Engineered to last multiple lifetimes.",
        features: [
            "Zero Landfill Impact",
            "Industrial Grade Assembly",
            "Weinix Certified Recovery",
            "100% Tracking Available"
        ]
    };

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo('.anim-image-box', { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" })
          .fromTo('.anim-text', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power2.out" }, "-=0.8");
    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="relative min-h-[100dvh] pt-[15vh] pb-32 overflow-hidden font-sans transition-colors duration-500 text-black dark:text-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                
                {/* Back Link */}
                <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/50 dark:text-white/50 hover:text-black dark:hover:text-[#ccff00] transition-colors mb-10 anim-text group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Store
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* LEFT COLUMN: Image Gallery */}
                    <div className="lg:col-span-7 anim-image-box">
                        <div className="bg-gray-100 dark:bg-[#0f0f0f] border border-black/5 dark:border-white/5 rounded-[2rem] p-8 md:p-16 relative aspect-square md:aspect-[4/3] flex items-center justify-center group overflow-hidden shadow-sm">
                            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-[2rem]"></div>
                            
                            <BlurImage 
                                src={product.image}
                                alt={product.name}
                                className="w-[85%] h-[85%] object-contain mix-blend-multiply dark:mix-blend-normal z-10 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03] drop-shadow-2xl"
                            />

                            {/* Image Controls Overlay */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-white/80 dark:bg-[#222]/80 backdrop-blur-md rounded-full px-6 py-3 border border-black/10 dark:border-white/10 shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors active:scale-95"><ArrowLeft size={18} /></button>
                                <div className="w-px h-6 bg-black/10 dark:bg-white/10 mx-2"></div>
                                <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors active:scale-95"><ArrowRight size={18} /></button>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 mt-6 overflow-x-auto hide-scrollbar snap-x pb-4">
                            {[1, 2, 3, 4, 5].map((_, idx) => (
                                <div key={idx} className={`w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl bg-gray-50 dark:bg-[#111] border ${idx === 0 ? 'border-[#ccff00] ring-1 ring-[#ccff00]/50' : 'border-black/5 dark:border-white/5'} p-2 cursor-pointer transition-colors snap-start hover:border-black/20 dark:hover:border-white/20 shadow-sm`}>
                                     <BlurImage 
                                        src={product.image}
                                        alt="Thumbnail"
                                        className="w-full h-full object-cover rounded-xl grayscale-[0.5] hover:grayscale-0 transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Config */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter mb-4 anim-text text-balance">
                            {product.name}
                        </h1>
                        
                        <div className="anim-text mb-10">
                            <div className="inline-flex bg-[#ccff00] text-black text-[10px] sm:text-xs font-bold px-4 py-2.5 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.15)] border border-[#ccff00]/50 tracking-wide">
                                {product.price}
                                <span className="ml-1 opacity-50 text-[9px]">USD</span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-black/10 dark:bg-white/5 mb-10 anim-text shadow-[0_1px_0_rgba(255,255,255,0.02)]"></div>

                        {/* Colors */}
                        <div className="mb-10 anim-text">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/50 mb-4 flex items-center gap-2">
                                Color <div className="h-px bg-black/10 dark:bg-white/10 flex-1 ml-2"></div>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color: string, i: number) => (
                                    <button 
                                        key={color} 
                                        onClick={() => setActiveColor(i)}
                                        className={`px-6 py-2 rounded-full text-[11px] font-semibold tracking-wide border transition-all duration-300 ${activeColor === i ? 'bg-[#111] text-[#ccff00] border-[#111] dark:bg-white dark:text-black dark:border-white shadow-md' : 'bg-transparent text-black dark:text-white/80 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'}`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="mb-10 anim-text">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/50 mb-4 flex items-center gap-2">
                                Size <div className="h-px bg-black/10 dark:bg-white/10 flex-1 ml-2"></div>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size: string, i: number) => (
                                    <button 
                                        key={size}
                                        onClick={() => setActiveSize(i)}
                                        className={`px-5 py-2.5 rounded-full text-[11px] font-semibold tracking-wider border transition-all duration-300 min-w-[3rem] text-center ${activeSize === i ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-md' : 'bg-transparent text-black dark:text-white/80 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="anim-text pt-6 border-t border-black/10 dark:border-white/5">
                            <p className="text-xs leading-relaxed text-black/70 dark:text-white/60 mb-8 font-medium max-w-lg">
                                {product.description}
                            </p>
                            
                            <ul className="space-y-3">
                                {product.features.map((feature: string, i: number) => (
                                    <li key={i} className="flex items-center text-[11px] text-black/70 dark:text-white/60 font-medium tracking-wide">
                                        <div className="w-1 h-1 bg-[#ccff00] rounded-full mr-3 shrink-0 shadow-[0_0_8px_rgba(204,255,0,0.8)]"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                    
                </div>
            </div>
        </main>
    );
}
