'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface TextureEntry {
    id: string;
    title: string;
    thumb: string;
    full: string;
}

interface TexturePack {
    id: string;
    title: string;
    description: string;
    textures: TextureEntry[];
    brochurePages?: string[];
}

interface BrochureModalProps {
    pack: TexturePack;
    onClose: () => void;
}

export default function BrochureModal({ pack, onClose }: BrochureModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);
    
    const modalRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial enter animation
    useGSAP(() => {
        if (modalRef.current) {
            gsap.fromTo(modalRef.current, 
                { opacity: 0, backdropFilter: 'blur(0px)' }, 
                { opacity: 1, backdropFilter: 'blur(16px)', duration: 0.5, ease: "power3.out" }
            );
            
            const content = modalRef.current.querySelector('.modal-content');
            gsap.fromTo(content,
                { opacity: 0, y: 50, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.1, ease: "power4.out" }
            );
        }
    }, { scope: modalRef });

    // Handle closing animation
    const handleClose = () => {
        if (modalRef.current) {
            const content = modalRef.current.querySelector('.modal-content');
            gsap.to(content, { opacity: 0, y: 20, scale: 0.95, duration: 0.3, ease: "power2.in" });
            gsap.to(modalRef.current, { 
                opacity: 0, 
                backdropFilter: 'blur(0px)', 
                duration: 0.4, 
                delay: 0.1,
                ease: "power2.in", 
                onComplete: onClose 
            });
        } else {
            onClose();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight') navigate('right');
            if (e.key === 'ArrowLeft') navigate('left');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, isAnimating]);

    const pages = pack?.brochurePages && pack.brochurePages.length > 0 
        ? pack.brochurePages 
        : pack?.textures?.map(t => t.thumb) || [];

    const navigate = (dir: 'left' | 'right') => {
        if (!pack || pages.length <= 1 || isAnimating) return;
        
        const newIndex = dir === 'left' 
            ? (currentIndex === 0 ? pages.length - 1 : currentIndex - 1)
            : (currentIndex === pages.length - 1 ? 0 : currentIndex + 1);

        setDirection(dir);
        setPrevIndex(currentIndex);
        setCurrentIndex(newIndex);
        setIsAnimating(true);
    };

    // Slide Animation Hook
    useGSAP(() => {
        if (!direction || prevIndex === null) return;

        const xOffsetOut = direction === 'left' ? '100%' : '-100%';
        const xOffsetIn = direction === 'left' ? '-100%' : '100%';

        // Animate Out
        gsap.fromTo('.slide-out', 
            { x: '0%', opacity: 1 }, 
            { x: xOffsetOut, opacity: 0, duration: 0.7, ease: "expo.inOut" }
        );

        // Animate In
        gsap.fromTo('.slide-in', 
            { x: xOffsetIn, opacity: 0 }, 
            { x: '0%', opacity: 1, duration: 0.7, ease: "expo.inOut", onComplete: () => {
                setPrevIndex(null);
                setDirection(null);
                setIsAnimating(false);
            }}
        );
    }, { dependencies: [currentIndex], scope: containerRef });

    if (!pack || pages.length === 0) return null;

    const isPlaceholder = !pack.brochurePages;

    return (
        <div ref={modalRef} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 px-4 md:px-8 py-12">
            
            {/* Background click to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={handleClose}></div>
            
            <button 
                onClick={handleClose}
                className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all z-10 hover:scale-105 active:scale-95 cursor-pointer"
            >
                <X size={24} />
            </button>

            <div className="modal-content relative w-full max-w-5xl h-full max-h-[95vh] flex flex-col items-center justify-center pointer-events-none py-4 overflow-y-auto sm:overflow-visible">
                
                {/* Header - Changed to relative stacking to prevent overlap */}
                <div className="relative z-10 w-full text-center pointer-events-auto mb-6 shrink-0">
                    <p className="text-[#ccff00] text-sm font-bold uppercase tracking-[0.2em] mb-2">{pack.title} Brochure</p>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white drop-shadow-lg">
                        Page {currentIndex + 1} / {pages.length}
                    </h2>
                </div>

                {/* Main Brochure Slide Container */}
                <div className="relative z-0 w-full max-w-[320px] sm:max-w-[420px] md:max-w-[400px] h-full max-h-[450px] sm:max-h-[600px] md:max-h-[550px] aspect-[3/4] md:aspect-[1/1.414] pointer-events-auto mt-2 sm:mt-4">
                    
                    {/* Left Navigation */}
                    <button 
                        onClick={() => navigate('left')}
                        disabled={isAnimating}
                        className="absolute top-1/2 -left-4 sm:-left-16 md:-left-24 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-black/40 sm:bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 z-30 cursor-pointer"
                    >
                        <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
                    </button>

                    {/* The Page Frame */}
                    <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-[#1a1a1a] to-black relative flex flex-col items-center justify-center group border-t-[#ccff00]/30 will-change-transform bg-black">
                        
                        {isPlaceholder ? (
                            <div className="flex flex-col items-center justify-center p-8 w-full h-full">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50"></div>
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/10 border-t-[#ccff00] animate-spin mb-8"></div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-4 uppercase tracking-wider relative z-10 px-4">
                                    {pack.textures[currentIndex]?.title || `Page ${currentIndex + 1}`}
                                </h3>
                                <p className="text-white/40 text-center uppercase tracking-widest text-[10px] sm:text-xs relative z-10 px-4">Brochure Image Pending</p>
                            </div>
                        ) : (
                            <>
                                {/* Outgoing Image */}
                                {prevIndex !== null && (
                                    <img 
                                        key={`slide-${prevIndex}`}
                                        src={pages[prevIndex]} 
                                        alt={`Page ${prevIndex + 1}`} 
                                        className="slide-out absolute inset-0 w-full h-full object-contain md:object-cover bg-black" 
                                        style={{ willChange: 'transform, opacity' }}
                                    />
                                )}
                                
                                {/* Incoming Image */}
                                <img 
                                    key={`slide-${currentIndex}`}
                                    src={pages[currentIndex]} 
                                    alt={`Page ${currentIndex + 1}`} 
                                    className={`${prevIndex !== null ? 'slide-in opacity-0' : 'opacity-100'} absolute inset-0 w-full h-full object-contain md:object-cover bg-black`} 
                                    style={{ willChange: 'transform, opacity' }}
                                />
                            </>
                        )}
                    </div>

                    {/* Right Navigation */}
                    <button 
                        onClick={() => navigate('right')}
                        disabled={isAnimating}
                        className="absolute top-1/2 -right-4 sm:-right-16 md:-right-24 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-black/40 sm:bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 z-30 cursor-pointer"
                    >
                        <ChevronRight size={24} className="sm:w-8 sm:h-8" />
                    </button>

                    {/* Procure Now Button - Absolute on Desktop, Below on Mobile */}
                    <div className="md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:z-40 mt-6 sm:mt-10 md:mt-0 flex justify-center w-full pointer-events-auto">
                        <Link 
                            href="/contact-us"
                            className="group relative flex items-center gap-3 bg-[#ccff00] hover:bg-[#b8e600] text-black font-black uppercase tracking-tighter px-6 py-3 md:px-10 md:py-4 rounded-full shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden cursor-pointer"
                        >
                            <span className="relative z-10 text-xs md:text-base">Procure Now</span>
                            <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                            
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
