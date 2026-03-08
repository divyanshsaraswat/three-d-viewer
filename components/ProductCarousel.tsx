"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import BlurImage from '@/components/BlurImage';
import { ArrowRight, ShoppingCart, Expand, MoveRight } from 'lucide-react';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const products = [
    {
        id: 1,
        name: 'Sustainable Sheet Set',
        category: 'Bedroom Essentials',
        price: '$120.00',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop',
        desc: 'Crafted from 12 rescued garments. Minimalist design meets maximalist sustainability.'
    },
    {
        id: 2,
        name: 'Recycled Cotton Covers',
        category: 'Living Room',
        price: '$45.00',
        image: 'https://images.unsplash.com/photo-1584063223005-592bbbaad434?q=80&w=1200&auto=format&fit=crop',
        desc: 'Zero waste production. Breathable, durable, and naturally dyed using earth minerals.'
    },
    {
        id: 3,
        name: 'Duvet Collection',
        category: 'Climate Controlled',
        price: '$150.00',
        image: 'https://images.unsplash.com/photo-1629948618342-921d279930f6?q=80&w=1200&auto=format&fit=crop',
        desc: '100% recycled fibers optimized for thermal regulation. Luxury that breathes.'
    },
    {
        id: 4,
        name: 'Bath Series 01',
        category: 'Wellness',
        price: '$60.00',
        image: 'https://images.unsplash.com/photo-1616627547584-bf2fccecefa8?q=80&w=1200&auto=format&fit=crop',
        desc: 'Ultra-absorbent textile blend. Quick-dry technology distilled from reclaimed polyester.'
    },
    {
        id: 5,
        name: 'Eco-Performance Mat',
        category: 'Active Life',
        price: 'Pre-order',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=1200&auto=format&fit=crop',
        desc: 'Non-slip grip engineered from recycled rubber and cotton fibers. Available soon.'
    },
    {
        id: 6,
        name: 'Linen Throw Blanket',
        category: 'Home Comfort',
        price: '$85.00',
        image: 'https://images.unsplash.com/photo-1578308818044-9243c52fa2a2?q=80&w=1200&auto=format&fit=crop',
        desc: 'Hand-woven from upcycled flax. A lightweight layer of sustainable warmth.'
    },
    {
        id: 7,
        name: 'Canvas Tote Set',
        category: 'Accessories',
        price: '$35.00',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
        desc: 'Reinforced utility bags made from repurposed industrial canvas. Built for life.'
    }
];

export default function ProductCarousel() {
    const sectionRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Entrance stagger for cards - still keep this reveal!
        gsap.from(".product-card", {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
            }
        });

        // Track scroll progress for the custom indicator
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const progress = container.scrollLeft / (container.scrollWidth - container.clientWidth);
            const indicator = document.getElementById('scroll-bar-indicator');
            if (indicator) gsap.to(indicator, { scaleX: progress, duration: 0.1, ease: "none" });
        };

        container.addEventListener('scroll', handleScroll);
        // Initial call
        handleScroll();

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-[#0a0a0a] min-h-screen py-24 md:py-32 overflow-hidden transition-colors duration-500">
            <div className="w-full flex flex-col justify-center">
                {/* Header Content */}
                <div className="px-6 md:px-20 mb-12 md:mb-16 z-10 select-none">
                    <span className="text-[#ccff00] text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-4 block animate-section">Series / 01 Collection</span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase leading-none mb-6 animate-section">
                        Product<br />Showcase
                    </h2>
                    <p className="text-white/40 text-[9px] md:text-[10px] font-bold max-w-sm uppercase tracking-widest mt-4 leading-loose animate-section">
                        Regenerative luxury for modern living. Engineered for circularity.
                    </p>
                </div>

                {/* Horizontal Scrolling Area - Now User Interacted */}
                <div className="relative w-full group">
                    <div 
                        ref={scrollContainerRef} 
                        className="flex gap-6 md:gap-10 px-6 md:px-20 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 items-stretch"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {products.map((product) => (
                            <div 
                                key={product.id} 
                                className="product-card relative w-[85vw] sm:w-[50vw] md:w-[42vw] lg:w-[32vw] aspect-[4/5] md:h-[55vh] group rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-[#121212] border border-white/5 shadow-2xl flex-shrink-0 snap-center md:snap-start transition-all duration-700 hover:shadow-[0_0_60px_rgba(204,255,0,0.08)]"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-1000 ease-out">
                                    <BlurImage 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
                                </div>

                                {/* Card Content */}
                                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white z-20">
                                    <div className="group-hover:translate-y-0 translate-y-6 transition-transform duration-500 ease-out">
                                        <span className="bg-[#ccff00] text-black text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                                            {product.category}
                                        </span>
                                        <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 uppercase leading-none">{product.name}</h3>
                                        <p className="text-white/40 text-[11px] md:text-sm font-medium max-w-sm mb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 leading-relaxed">
                                            {product.desc}
                                        </p>
                                        
                                        <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Price</span>
                                                <span className="text-xl md:text-2xl font-bold text-[#ccff00]">{product.price}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-[#ccff00] hover:text-black transition-all">
                                                    <Expand size={18} />
                                                </button>
                                                <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white text-black flex items-center justify-center hover:bg-[#ccff00] transition-colors">
                                                    <ShoppingCart size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Final Discovery Card */}
                        <div className="product-card relative w-[80vw] sm:w-[45vw] md:w-[35vw] lg:w-[25vw] aspect-[4/5] md:h-[55vh] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-[#ccff00] flex flex-col items-center justify-center p-8 md:p-12 text-center flex-shrink-0 snap-center md:snap-start group cursor-pointer active:scale-95 transition-all">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-black/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MoveRight size={28} className="text-black group-hover:translate-x-2 transition-transform" />
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black text-black uppercase leading-[0.9] tracking-tighter">
                                Full<br />Catalog
                            </h3>
                            <button className="mt-8 text-black/40 font-bold uppercase tracking-widest text-[9px] border-b border-black/10 pb-1 group-hover:text-black transition-colors">
                                Discover All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress Bar & Instructions */}
                <div className="mt-8 mx-auto flex items-center gap-6 z-20">
                    <div className="w-32 md:w-48 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                        <div className="absolute inset-x-0 h-full bg-[#ccff00] origin-left scale-x-0" id="scroll-bar-indicator" />
                    </div>
                    <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-black text-white/30 whitespace-nowrap">Swipe to explore products</span>
                </div>
            </div>
        </section>
    );
}

