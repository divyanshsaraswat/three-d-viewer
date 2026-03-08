"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import BlurImage from '@/components/BlurImage';
import Link from 'next/link';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const products = [
    {
        id: "tshirt",
        name: "Weinix Circles T-Shirt",
        price: "$45.00",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200",
        span: "md:col-span-2 md:row-span-2",
        objectPosition: "center"
    },
    {
        id: "bag",
        name: "Weinix Drawstring Bag",
        price: "$28.00",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
        span: "md:col-span-1 md:row-span-1",
        objectPosition: "center"
    },
    {
        id: "cup",
        name: "Weinix Stainless Cup",
        price: "$18.00",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
        span: "md:col-span-1 md:row-span-1",
        objectPosition: "center"
    },
    {
        id: "mug",
        name: "Weinix Industrial Mug",
        price: "$22.00",
        image: "https://images.unsplash.com/photo-1574226516831-2f54b73241ae?auto=format&fit=crop&q=80&w=800",
        span: "md:col-span-1 md:row-span-1",
        objectPosition: "center"
    },
    {
        id: "hoodie",
        name: "Weinix Heavy Hoodie",
        price: "$85.00",
        image: "https://images.unsplash.com/photo-1556821840-0062c3fdb1e2?auto=format&fit=crop&q=80&w=800",
        span: "md:col-span-1 md:row-span-1",
        objectPosition: "center"
    },
    {
        id: "onesie",
        name: "Weinix Essential Onesie",
        price: "$25.00",
        image: "https://images.unsplash.com/photo-1522771930-78848d528717?auto=format&fit=crop&q=80&w=800",
        span: "md:col-span-1 md:row-span-1",
        objectPosition: "center top"
    }
];

export default function ProductsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Staggered fade up for product cards
        const cards = gsap.utils.toArray('.product-card') as HTMLElement[];
        
        gsap.fromTo(cards, 
            { opacity: 0, y: 60, scale: 0.98 },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 1.4, 
                ease: "power3.out",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: ".grid-container",
                    start: "top 85%",
                }
            }
        );

        // Header reveal
        gsap.fromTo('.header-reveal',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.15, delay: 0.1 }
        );
        
    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="relative min-h-screen pt-[20vh] pb-32 overflow-hidden font-sans transition-colors duration-500 text-black dark:text-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                
                {/* HEADER */}
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 header-reveal">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-black dark:text-[#ccff00]">Store.</h1>
                        <p className="text-black/60 dark:text-white/60 font-medium text-sm md:text-lg max-w-xl leading-relaxed">
                            Zero-compromise apparel engineered for the circular economy. Secondary commodities rebuilt into premium essentials.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-6 py-4 rounded-full shadow-lg">
                        <span className="text-black/80 dark:text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Collection / Series 01</span>
                        <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse shadow-[0_0_12px_rgba(204,255,0,0.8)]"></div>
                    </div>
                </div>

                {/* BENTO GRID (First Row) */}
                <div className="grid-container grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[400px]">
                    {products.slice(0, 3).map((item, i) => (
                        <Link href={`/products/${item.id}`} key={item.id} className={`product-card bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none rounded-[2rem] overflow-hidden relative group cursor-pointer ${item.span} block hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
                            {/* Inset Shadow for Premium Blending */}
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/5 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none"></div>
                            
                            <BlurImage 
                                src={item.image} 
                                alt={item.name}
                                className={`w-full h-full object-cover origin-center group-hover:scale-[1.04] transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] grayscale-[0.2] group-hover:grayscale-0 ${item.objectPosition ? 'object-' + item.objectPosition.split(' ').join('-') : ''}`}
                                style={{ objectPosition: item.objectPosition }}
                            />

                            {/* Floating Price Pill */}
                            <div className="absolute left-6 bottom-6 md:left-8 md:bottom-8 z-20 flex items-center group-hover:-translate-y-2 transition-transform duration-[1s] ease-[cubic-bezier(0.25,1,0.5,1)]">
                                <div className="bg-[#111]/90 backdrop-blur-md border border-white/10 text-white/90 text-[10px] sm:text-xs font-semibold px-4 py-2.5 rounded-full flex items-center shadow-2xl tracking-wide">
                                    {item.name}
                                </div>
                                <div className="bg-[#ccff00] text-black text-[10px] sm:text-xs font-bold px-4 py-2.5 rounded-full flex items-center -ml-4 shadow-[0_0_20px_rgba(204,255,0,0.15)] z-10 border border-[#ccff00]/50 tracking-wide">
                                    {item.price}
                                    <span className="ml-1 opacity-50 text-[9px]">USD</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* HORIZONTAL CAROUSEL (Second Row) */}
                <div className="mt-8 w-full overflow-hidden">
                    <div className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory pb-6 pt-2 w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] px-4 md:px-safe max-w-none">
                        <div className="hidden md:block w-[calc((100vw-1400px)/2)] shrink-0"></div> {/* Left Spacer for massive screens */}
                        
                        {/* Ensure the first item lines up with the Grid on desktop by calculating the container margin */}
                        <div className="md:hidden shrink-0 w-4"></div>
                        
                        {[...products.slice(3), ...products.slice(0, 3)].map((item, i) => (
                            <Link href={`/products/${item.id}`} key={`${item.id}-${i}`} className="product-card shrink-0 w-[85vw] md:w-[400px] h-[400px] bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none rounded-[2rem] overflow-hidden relative group cursor-pointer snap-center md:snap-start block hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/5 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none"></div>
                            
                            <BlurImage 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover origin-center group-hover:scale-[1.04] transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] grayscale-[0.2] group-hover:grayscale-0"
                                style={{ objectPosition: item.objectPosition }}
                            />

                            <div className="absolute left-6 bottom-6 md:left-8 md:bottom-8 z-20 flex items-center group-hover:-translate-y-2 transition-transform duration-[1s] ease-[cubic-bezier(0.25,1,0.5,1)]">
                                <div className="bg-[#111]/90 backdrop-blur-md border border-white/10 text-white/90 text-[10px] sm:text-xs font-semibold px-4 py-2.5 rounded-full flex items-center shadow-2xl tracking-wide">
                                    {item.name}
                                </div>
                                <div className="bg-[#ccff00] text-black text-[10px] sm:text-xs font-bold px-4 py-2.5 rounded-full flex items-center -ml-4 shadow-[0_0_20px_rgba(204,255,0,0.15)] z-10 border border-[#ccff00]/50 tracking-wide">
                                    {item.price}
                                    <span className="ml-1 opacity-50 text-[9px]">USD</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                        
                        <div className="shrink-0 w-8 md:w-[calc((100vw-1400px)/2)]"></div> {/* Right Padding */}
                    </div>
                </div>

            </div>
        </main>
    );
}
