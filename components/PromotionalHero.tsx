'use client';

import React, { useState, useEffect } from 'react';
import BlurImage from '@/components/BlurImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_ITEMS = [
    {
        title: "Pack 01",
        image: "/textures/hov/hero/HOV02220_texture.webp",
        color: "#5e4b7a" 
    },
    {
        title: "Pack 02",
        image: "/textures/hov/hero/HOV02235_texture.webp",
        color: "#5b6a8a" 
    },
    {
        title: "Pack 03",
        image: "/textures/hov/hero/HOV02252_color.webp",
        color: "#8c3a45" 
    },
    {
        title: "Pack 04",
        image: "/textures/hov/hero/HOV02265_color.webp",
        color: "#856f45" 
    },
    {
        title: "Pack 05",
        image: "/textures/hov/hero/HOV02271_color.webp",
        color: "#3a758c" 
    },
    {
        title: "Pack 06",
        image: "/textures/hov/hero/HOV02312_color.webp",
        color: "#4b5a8a" 
    }
];

export default function PromotionalHero() {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((prev) => (prev + 1) % HERO_ITEMS.length);
    const prev = () => setIndex((prev) => (prev - 1 + HERO_ITEMS.length) % HERO_ITEMS.length);

    useEffect(() => {
        const timer = setInterval(next, 8000);
        return () => clearInterval(timer);
    }, []);

    const item = HERO_ITEMS[index];

    return (
        <>
        <div 
            className="relative w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden transition-all duration-1000 group"
            style={{ 
                backgroundColor: item.color,
                boxShadow: `0 0 50px -10px ${item.color}88` 
            }}
        >
            {/* Pulsing Ambient Glow Overlay */}
            <div 
                className="absolute inset-0 z-40 rounded-xl pointer-events-none animate-ambient-pulse"
                style={{ 
                    boxShadow: `inset 0 0 100px ${item.color}66` 
                }}
            ></div>
            
            <style jsx>{`
                @keyframes ambient-pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
                .animate-ambient-pulse {
                    animation: ambient-pulse 6s ease-in-out infinite;
                }
            `}</style>
            {/* Fading Container */}
            <div className="absolute inset-0">
                {HERO_ITEMS.map((hero, i) => (
                    <div 
                        key={i} 
                        className={`absolute inset-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            i === index 
                            ? 'opacity-100 scale-100 z-20' 
                            : 'opacity-0 scale-[1.01] z-10'
                        }`}
                    >
                        <div className="relative w-full h-full">
                            <BlurImage src={hero.image} alt={hero.title} className="w-full h-full object-cover" />
                            {/* Seamless Edge Blending Overlay */}
                            <div 
                                className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]"
                                style={{ 
                                    background: `radial-gradient(circle at center, transparent 70%, ${hero.color}88 90%, ${hero.color} 100%)` 
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* External Pagination Dots */}
        <div className="flex justify-center gap-3 mt-8">
            {HERO_ITEMS.map((_, i) => (
                <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-10 bg-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.6)]' : 'bg-black/10 dark:bg-white/10'}`}
                ></div>
            ))}
        </div>
        </>
    );
}
