"use client";

import React from 'react';
import { Menu, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';

export default function GlobalNav() {
    const { isScrolled, setIsMenuOpen, setIsAuthModalOpen, user } = useGlobalContext();
    const pathname = usePathname();
    
    const isLanding = pathname === '/home';
    const isProfile = pathname === '/profile';
    const textColorClass = isLanding ? 'text-white' : 'text-black dark:text-white';

    return (
        <>
            {/* Initial transparent navbar (visible at top of page) */}
            <nav className={`absolute w-full z-50 px-6 py-4 top-0 left-0 transition-all duration-500 bg-transparent ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
                    <Link href="/home" className={`flex items-center gap-3 font-bold text-xl tracking-tighter ${textColorClass} transition-colors`}>
                        <div className="w-4 h-4 bg-[#ccff00] transform rotate-45 rounded-sm" />
                        <span>WEINIX</span>
                    </Link>
                    <div className={`hidden md:flex gap-10 text-xs uppercase tracking-widest font-semibold ${textColorClass} transition-colors`}>
                        <Link href="/home" className="hover:opacity-70 transition-opacity">Home</Link>
                        <Link href="/about-us" className="hover:opacity-70 transition-opacity">About Us</Link>
                        {/* <a href="#" className="hover:opacity-70 transition-opacity">Project</a> */}
                        <Link href="/products" className="hover:opacity-70 transition-opacity">Products</Link>
                        <Link href="/blog" className="hover:opacity-70 transition-opacity">Blog</Link>
                    </div>
                    <div className={`flex items-center gap-6 ${textColorClass} transition-colors`}>
                        {user ? (
                            <Link href="/profile" className="group relative flex items-center justify-center px-6 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-black bg-[#ccff00] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.8)] border border-[#ccff00]/50 cursor-pointer">
                                <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative flex items-center gap-2">
                                    {user.firstName || 'Profile'}
                                </span>
                            </Link>
                        ) : (
                            <button 
                                onClick={() => setIsAuthModalOpen(true)}
                                className="group relative flex items-center justify-center px-6 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-black bg-[#ccff00] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.8)] border border-[#ccff00]/50 cursor-pointer"
                            >
                                <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative flex items-center gap-2">
                                    Join Now
                                    <ArrowRight size={14} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                            </button>
                        )}
                        <button className="hover:opacity-70 transition-opacity cursor-pointer" onClick={() => setIsMenuOpen(true)}>
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sticky scrolled navbar (slides down when page is scrolled) */}
            <nav className={`fixed w-full z-[100] px-6 py-4 top-0 left-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 transition-all duration-500 transform ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
                    <Link href="/home" className="flex items-center gap-3 font-bold text-xl tracking-tighter text-black dark:text-white transition-colors">
                        <div className="w-4 h-4 bg-[#ccff00] transform rotate-45 rounded-sm" />
                        <span>WEINIX</span>
                    </Link>
                    <div className="hidden md:flex gap-10 text-xs uppercase tracking-widest font-semibold text-black dark:text-white transition-colors">
                        <Link href="/home" className="hover:opacity-70 transition-opacity">Home</Link>
                        <Link href="/about-us" className="hover:opacity-70 transition-opacity">About Us</Link>
                        {/* <a href="#" className="hover:opacity-70 transition-opacity">Project</a> */}
                        <Link href="/products" className="hover:opacity-70 transition-opacity">Products</Link>
                        <Link href="/blog" className="hover:opacity-70 transition-opacity">Blog</Link>
                    </div>
                    <div className="flex items-center gap-6 text-black dark:text-white transition-colors">
                        {user ? (
                            <Link href="/profile" className="group relative flex items-center justify-center px-6 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-black bg-[#ccff00] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.8)] border border-[#ccff00]/50 cursor-pointer">
                                <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative flex items-center gap-2">
                                    {user.firstName || 'Profile'}
                                </span>
                            </Link>
                        ) : (
                            <button 
                                onClick={() => setIsAuthModalOpen(true)}
                                className="group relative flex items-center justify-center px-6 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-black bg-[#ccff00] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.8)] border border-[#ccff00]/50 cursor-pointer"
                            >
                                <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative flex items-center gap-2">
                                    Join Now
                                    <ArrowRight size={14} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                            </button>
                        )}
                        <button className="hover:opacity-70 transition-opacity cursor-pointer" onClick={() => setIsMenuOpen(true)}>
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}
