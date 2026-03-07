"use client";

import React from 'react';
import { Search, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';

export default function GlobalNav() {
    const { isScrolled, setIsMenuOpen } = useGlobalContext();
    const pathname = usePathname();
    
    const isLanding = pathname === '/landing';
    const textColorClass = isLanding ? 'text-white' : 'text-black dark:text-white';

    return (
        <>
            {/* Initial transparent navbar (visible at top of page) */}
            <nav className={`absolute w-full z-50 px-6 py-4 top-0 left-0 transition-all duration-500 bg-transparent ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
                    <Link href="/landing" className={`flex items-center gap-3 font-bold text-xl tracking-tighter ${textColorClass} transition-colors`}>
                        <div className="w-4 h-4 bg-[#ccff00] transform rotate-45 rounded-sm" />
                        <span>WEINIX</span>
                    </Link>
                    <div className={`hidden md:flex gap-10 text-xs uppercase tracking-widest font-semibold ${textColorClass} transition-colors`}>
                        <Link href="/landing" className="hover:opacity-70 transition-opacity">Home</Link>
                        <Link href="/about-us" className="hover:opacity-70 transition-opacity">About Us</Link>
                        {/* <a href="#" className="hover:opacity-70 transition-opacity">Project</a> */}
                        <Link href="/products" className="hover:opacity-70 transition-opacity">Products</Link>
                        <Link href="/blog" className="hover:opacity-70 transition-opacity">Blog</Link>
                    </div>
                    <div className={`flex items-center gap-6 ${textColorClass} transition-colors`}>
                        <button className="hover:opacity-70 transition-opacity cursor-pointer"><Search size={18} /></button>
                        <button className="hover:opacity-70 transition-opacity cursor-pointer" onClick={() => setIsMenuOpen(true)}>
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sticky scrolled navbar (slides down when page is scrolled) */}
            <nav className={`fixed w-full z-[100] px-6 py-4 top-0 left-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 transition-all duration-500 transform ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
                    <Link href="/landing" className="flex items-center gap-3 font-bold text-xl tracking-tighter text-black dark:text-white transition-colors">
                        <div className="w-4 h-4 bg-[#ccff00] transform rotate-45 rounded-sm" />
                        <span>WEINIX</span>
                    </Link>
                    <div className="hidden md:flex gap-10 text-xs uppercase tracking-widest font-semibold text-black dark:text-white transition-colors">
                        <Link href="/landing" className="hover:opacity-70 transition-opacity">Home</Link>
                        <Link href="/about-us" className="hover:opacity-70 transition-opacity">About Us</Link>
                        {/* <a href="#" className="hover:opacity-70 transition-opacity">Project</a> */}
                        <Link href="/products" className="hover:opacity-70 transition-opacity">Products</Link>
                        <Link href="/blog" className="hover:opacity-70 transition-opacity">Blog</Link>
                    </div>
                    <div className="flex items-center gap-6 text-black dark:text-white transition-colors">
                        <button className="hover:opacity-70 transition-opacity cursor-pointer"><Search size={18} /></button>
                        <button className="hover:opacity-70 transition-opacity cursor-pointer" onClick={() => setIsMenuOpen(true)}>
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}
