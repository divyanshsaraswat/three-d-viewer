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
    pack_hov_bricks: {
        name: "Bricks Pack",
        price: "$45.00",
        image: "/textures/hov/packs/HOV02161_white.webp",
        colors: ["Standard", "Vintage", "Industrial"],
        sizes: ["2K", "4K", "8K"],
        description: "Structured masonry and classic brick patterns optimized for high fidelity. High-resolution textures perfect for architectural visualization and premium construction environments.",
        features: [
            "Seamlessly Tileable",
            "PBR Material Ready",
            "Optimized Fidelity",
            "Multiple Variations Included"
        ]
    },
    pack_hov_surfaces: {
        name: "Surfaces Pack",
        price: "$85.00",
        image: "/textures/hov/packs/HOV02168_white.webp",
        colors: ["Natural Stone", "Rough Plaster", "Organic"],
        sizes: ["2K", "4K", "8K"],
        description: "Organic stone, plaster, and rough architectural surfaces. Premium materials designed to redefine high-end spatial aesthetics.",
        features: [
            "Seamlessly Tileable",
            "PBR Material Ready",
            "High-Detail Micro-Surface",
            "Material Standard"
        ]
    },
    pack_hov_energy: {
        name: "Energy & Glow Pack",
        price: "$25.00",
        image: "/textures/hov/packs/HOV02265_texture.webp",
        colors: ["Blue Energy", "Orange Glow", "Red Embers"],
        sizes: ["2K", "4K"],
        description: "Specialized textures with emissive glows and energy patterns. Create dynamic, futuristic environments with certified glowing details.",
        features: [
            "Seamlessly Tileable",
            "High-Contrast Emission Maps",
            "Cybernetic Aesthetics",
            "Sci-Fi Ready"
        ]
    }
};

import { useSearchParams } from 'next/navigation';

export default function ProductDetail({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    // Unwrapping params for Next 15 compatibility dynamically
    const unwrappedParams = typeof params === 'object' && 'then' in params ? use(params) : params;
    const id = unwrappedParams.id;
    
    const searchParams = useSearchParams();
    const textureId = searchParams.get('texture');
    
    const [packs, setPacks] = useState<any[]>([]);
    const [activeColor, setActiveColor] = useState(0);
    const [activeSize, setActiveSize] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/textures/packs1.json')
            .then(res => res.json())
            .then(data => setPacks(data));
    }, []);

    // Find pack and texture
    const currentPack = packs.find(p => p.id === id);
    const currentTexture = currentPack?.textures.find((t: any) => t.id === textureId);

    // Provide dynamic product data
    const product = currentTexture ? {
        name: currentTexture.title,
        price: productsData[id]?.price || "$35.00",
        image: currentTexture.full,
        colors: productsData[id]?.colors || ["Standard"],
        sizes: productsData[id]?.sizes || ["4K"],
        description: productsData[id]?.description || "Individual Weinix certified texture rebuilt for maximum fidelity.",
        features: productsData[id]?.features || [
            "Seamlessly Tileable",
            "PBR Material Ready",
            "Weinix Certified Quality",
            "100% Tracking Available"
        ]
    } : (productsData[id] || {
        name: "Weinix Essential Texture",
        price: "$35.00",
        image: "/textures/hov/packs/HOV02188_white.webp",
        colors: ["Standard"],
        sizes: ["4K"],
        description: "Standard industrial grade texture rebuilt for maximum fidelity.",
        features: [
            "Seamlessly Tileable",
            "PBR Material Ready",
            "Weinix Certified Quality",
            "100% Tracking Available"
        ]
    });

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo('.anim-image-box', { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" })
          .fromTo('.anim-text', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power2.out" }, "-=0.8");
    }, { scope: containerRef, dependencies: [product] });

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

                    {/* RIGHT COLUMN: Product Info */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter mb-4 anim-text text-balance">
                            {product.name}
                        </h1>

                        {/* <div className="w-full h-px bg-black/10 dark:bg-white/5 mb-10 anim-text shadow-[0_1px_0_rgba(255,255,255,0.02)]"></div> */}

                        {/* Description */}
                        <div className="anim-text pt-6 border-t border-black/10 dark:border-white/5">
                            <p className="text-xs leading-relaxed text-black/70 dark:text-white/60 mb-8 font-medium max-w-lg">
                                {product.description}
                            </p>
                            
                            <ul className="space-y-3 mb-10">
                                {product.features.map((feature: string, i: number) => (
                                    <li key={i} className="flex items-center text-[11px] text-black/70 dark:text-white/60 font-medium tracking-wide">
                                        <div className="w-1 h-1 bg-[#ccff00] rounded-full mr-3 shrink-0 shadow-[0_0_8px_rgba(204,255,0,0.8)]"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/contact-us"
                                className="group relative inline-flex items-center justify-center px-8 py-4 text-xs font-black uppercase tracking-[0.15em] text-black bg-[#ccff00] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_40px_rgba(204,255,0,0.5)] border border-[#ccff00]/50"
                            >
                                <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative flex items-center gap-2">
                                    Enquire for Sale
                                    <ArrowRight size={14} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </div>

                    </div>
                    
                </div>
            </div>
        </main>
    );
}
