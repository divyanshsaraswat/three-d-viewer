"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Twitter, Instagram, Linkedin } from 'lucide-react';

interface FullScreenMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const navLinks = [
    { title: "ABOUT US", num: "01" },
    { title: "OUR WORK", num: "02" },
    { title: "SERVICES", num: "03" },
    { title: "BLOG", num: "04" },
    { title: "CONTACT US", num: "05" },
];

export default function FullScreenMenu({ isOpen, onClose }: FullScreenMenuProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgPanelsRef = useRef<HTMLDivElement[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLAnchorElement[]>([]);
    const backdropRef = useRef<HTMLDivElement>(null);
    const [shouldRender, setShouldRender] = useState(isOpen);

    if (isOpen && !shouldRender) {
        setShouldRender(true);
    }

    useEffect(() => {
        if (!shouldRender || !containerRef.current || !contentRef.current || !backdropRef.current) return;

        const tl = gsap.timeline();

        if (isOpen) {
            // Un-hide container
            gsap.set(containerRef.current, { autoAlpha: 1 });

            // Fade in backdrop
            tl.to(backdropRef.current, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' })
                // 3 bars slide from right to left
                .fromTo(bgPanelsRef.current,
                    { x: '100%' },
                    { x: '0%', duration: 0.7, stagger: 0.1, ease: 'expo.inOut' },
                    "-=0.4"
                )
                // Reveal content
                .fromTo(contentRef.current,
                    { autoAlpha: 0, x: 20 },
                    { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' },
                    "-=0.2" // overlap
                )
                // Stagger links
                .fromTo(linksRef.current,
                    { y: 30, autoAlpha: 0 },
                    { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' },
                    "-=0.3"
                );

        } else {
            // Reverse everything
            tl.to(contentRef.current, { autoAlpha: 0, x: 20, duration: 0.3, ease: 'power2.in' })
                .to(bgPanelsRef.current, {
                    x: '100%',
                    duration: 0.5,
                    stagger: -0.1, // reverse stagger so the top-most leaves first
                    ease: 'expo.inOut'
                }, "-=0.2")
                .to(backdropRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, "-=0.2")
                .set(containerRef.current, { autoAlpha: 0 })
                .call(() => setShouldRender(false));
        }
    }, [isOpen, shouldRender]);

    if (!shouldRender) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100] invisible pointer-events-auto flex justify-end">

            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 cursor-pointer"
                onClick={onClose}
            />

            {/* Menu side panel */}
            <div className="relative w-full md:w-[600px] h-full flex pointer-events-none overflow-hidden">
                {/* 3 background panels animated in sync (stacked deeply) */}
                <div ref={el => { if (el) bgPanelsRef.current[0] = el }} className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-[#2a2a2a] z-0"></div>
                <div ref={el => { if (el) bgPanelsRef.current[1] = el }} className="absolute inset-0 w-full h-full bg-gray-100 dark:bg-[#1a1a1a] z-10"></div>
                <div ref={el => { if (el) bgPanelsRef.current[2] = el }} className="absolute inset-0 w-full h-full bg-white dark:bg-[#111111] z-20"></div>

                {/* Content overlay */}
                <div ref={contentRef} className="absolute inset-0 w-full h-full flex flex-col pt-8 md:pt-12 px-6 md:px-16 pb-12 opacity-0 pointer-events-auto text-black dark:text-white z-30">

                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 md:top-12 md:right-12 flex items-center gap-2 uppercase text-xs font-bold tracking-widest group hover:text-[#ccff00] transition-colors z-50 cursor-pointer text-black dark:text-white"
                    >
                        Close
                        <X size={24} className="group-hover:rotate-180 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                    </button>

                    <div className="flex-1 flex flex-col justify-center mt-16 md:mt-12 w-full max-w-md mx-auto">
                        {navLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={`#${link.title.toLowerCase().replace(' ', '-')}`}
                                ref={el => { if (el) linksRef.current[idx] = el }}
                                className="relative group w-max cursor-pointer py-4 px-6 -ml-6 rounded-2xl mb-2 flex items-start overflow-hidden"
                                onClick={onClose}
                            >
                                {/* Background block sliding from bottom to top on hover */}
                                <div className="absolute inset-0 w-full h-full bg-[#ccff00] rounded-2xl transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-0" />

                                <div className="relative z-10 overflow-hidden pointer-events-none flex items-start shadow-none">
                                    {/* Primary Text */}
                                    <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold uppercase tracking-tighter text-black dark:text-white transform group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] leading-none m-0 p-0">
                                        {link.title}
                                    </h2>
                                    {/* Secondary Text absolutely positioned under the first */}
                                    <h2 className="absolute top-0 left-0 text-[2.5rem] md:text-[3.5rem] font-bold uppercase tracking-tighter text-black dark:text-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] leading-none m-0 p-0">
                                        {link.title}
                                    </h2>
                                </div>

                                {/* Numbers container */}
                                <div className="relative z-10 overflow-hidden ml-3 md:ml-4 mt-1 md:mt-2 pointer-events-none">
                                    <span className="block text-[#ccff00] dark:text-[#ccff00] text-xs font-bold transform group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] leading-none m-0 p-0">
                                        {link.num}
                                    </span>
                                    <span className="absolute top-0 left-0 block text-black dark:text-black text-xs font-bold transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] leading-none m-0 p-0">
                                        {link.num}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Socials Bottom Row */}
                    <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 mt-auto border-t border-black/10 dark:border-white/10 pt-8">
                        <span className="text-black dark:text-white">Socials</span>
                        <div className="flex flex-wrap gap-6">
                            <a href="#" className="hover:text-[#ccff00] transition-colors flex items-center gap-2"><Instagram size={16} /> Instagram</a>
                            <a href="#" className="hover:text-[#ccff00] transition-colors flex items-center gap-2"><Linkedin size={16} /> LinkedIn</a>
                            <a href="#" className="hover:text-[#ccff00] transition-colors flex items-center gap-2"><Twitter size={16} /> X/Twitter</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
