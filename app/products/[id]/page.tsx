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
    pack_wall_base: {
        name: "Wall Base Texture Pack",
        price: "$45.00",
        image: "/textures/wall/7.png",
        colors: ["Light", "Dark", "Cream"],
        sizes: ["2K", "4K", "8K"],
        description: "Plaster, painted walls, and interior surfaces. High-resolution grunge and clean wall textures perfect for architectural visualization and game environments.",
        features: [
            "Seamlessly Tileable",
            "PBR Material Ready",
            "Diffuse, Normal, and Roughness Maps",
            "Multiple Variations Included"
        ]
    },
    pack_brick_masonry: {
        name: "Brick & Masonry Pack",
        price: "$28.00",
        image: "/textures/brick/4.png",
        colors: ["Yellow Brick", "Red Brick"],
        sizes: ["2K", "4K", "8K"],
        description: "Structured masonry and classic brick patterns. Ideal for exterior rendering, urban environments, and industrial scenes.",
        features: [
            "Seamlessly Tileable",
            "PBR Material Ready",
            "Diffuse, Normal, and Displacement Maps",
            "Real-World Scale"
        ]
    },
    pack_stone_mineral: {
        name: "Stone & Marble Pack",
        price: "$85.00",
        image: "/textures/stone/22.png",
        colors: ["White Marble", "Concrete", "Black Stone"],
        sizes: ["2K", "4K", "8K"],
        description: "Hard surfaces and premium architectural materials. Includes high-end marble, rough concrete, and stylized glowing stones.",
        features: [
            "Seamlessly Tileable",
            "PBR Material Ready",
            "High-Detail Micro-Surface",
            "Subsurface Scattering Maps Included"
        ]
    },
    pack_fabric_cloth: {
        name: "Fabric & Cloth Pack",
        price: "$22.00",
        image: "/textures/fabric/10.png",
        colors: ["Green Canvas", "Beige Cloth", "Dark Textile"],
        sizes: ["1K", "2K", "4K"],
        description: "Grain, fiber, and woven fabric textures. Perfect for interior furniture, clothing simulation references, and close-up detail work.",
        features: [
            "Seamlessly Tileable",
            "Micro-fiber Details",
            "Opacity Maps for Weaves",
            "Color Variances"
        ]
    },
    pack_lava_fire: {
        name: "Lava & Fire Pack",
        price: "$18.00",
        image: "/textures/lava/3.png",
        colors: ["Molten", "Bright Veins", "Intense"],
        sizes: ["2K", "4K"],
        description: "Stylized lava, molten, and fire VFX textures. Create dynamic, glowing environments with animated-ready emission maps.",
        features: [
            "Seamlessly Tileable",
            "High-Contrast Emission Maps",
            "Flow Maps Included",
            "Game-Ready Optimization"
        ]
    },
    pack_scifi_energy: {
        name: "Sci-Fi & Energy Pack",
        price: "$25.00",
        image: "/textures/scifi/2.png",
        colors: ["Blue Electric", "Orange Energy"],
        sizes: ["2K", "4K"],
        description: "Cool-toned electric and cyberpunk tech textures. Add futuristic glowing details and cybernetic surfaces to any mesh.",
        features: [
            "Seamlessly Tileable",
            "Emission and Panel Maps",
            "Cyberpunk Aesthetics",
            "Sci-Fi Material Ready"
        ]
    }
};

export default function ProductDetail({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    // Unwrapping params for Next 15 compatibility dynamically
    const unwrappedParams = typeof params === 'object' && 'then' in params ? use(params) : params;
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    const id = unwrappedParams.id;
    
    const [activeColor, setActiveColor] = useState(0);
    const [activeSize, setActiveSize] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Provide a generic fallback if product is missing
    const product = productsData[id] || {
        name: "Weinix Essential Texture",
        price: "$35.00",
        image: "/textures/wall/9.png",
        colors: ["Standard"],
        sizes: ["4K"],
        description: "Standard industrial grade texture rebuilt for maximum fidelity.",
        features: [
            "Seamlessly Tileable",
            "PBR Material Ready",
            "Weinix Certified Quality",
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
                                className="w-[85%] h-[85%] object-contain mix-blend-multiply dark:mix-blend-normal z-10 transition-all duration-500 group-hover:scale-105 drop-shadow-2xl"
                            />


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
                                Variation <div className="h-px bg-black/10 dark:bg-white/10 flex-1 ml-2"></div>
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
                                Resolution <div className="h-px bg-black/10 dark:bg-white/10 flex-1 ml-2"></div>
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
