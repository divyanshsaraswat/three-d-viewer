"use client";

import React from 'react';
import { ArrowRight, Sun, Moon, Monitor, Instagram } from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';

export default function GlobalFooter() {
    const { theme, setTheme } = useGlobalContext();

    return (
        <footer className="relative  pb-12 px-4 md:px-8 mt-12 bg-gray-100 dark:bg-[#0a0a0a] transition-colors duration-500 overflow-hidden">
            {/* Background subtle lines */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 5px)' }}></div>

            <div className="max-w-[1200px] mx-auto relative z-10">

                {/* CTA Floating Card */}
                <div className="bg-white dark:bg-[#111111] rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 md:p-16 mb-24 shadow-2xl flex flex-col-reverse lg:flex-row items-center justify-between gap-8 md:gap-12 border border-black/5 dark:border-white/5 transition-colors overflow-hidden">
                    <div className="flex-1 w-full max-w-2xl text-center lg:text-left">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-black dark:text-white leading-[1.1] mb-8 md:mb-10 transition-colors">
                            Let&apos;s Turn Big Ideas Into Extraordinary Realities – Together
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <a href="/contact-us" className="w-full sm:w-auto bg-[#171717] dark:bg-white text-white dark:text-[#171717] px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#ccff00] hover:text-[#171717] dark:hover:bg-[#ccff00] dark:hover:text-[#171717] transition-colors inline-block text-center">
                                Contact Sales
                            </a>
                            {/* <button className="w-full sm:w-auto justify-center bg-transparent border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white text-black dark:text-white px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase flex items-center gap-2 transition-colors">
                                <ArrowRight size={16} /> Book a Consultation
                            </button> */}
                        </div>
                    </div>

                    {/* Abstract Brand Graphic */}
                    <div className="shrink-0 relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 flex items-center justify-center mt-4 lg:mt-0">
                        <div className="absolute inset-0 rounded-full border-[1rem] sm:border-[1.5rem] md:border-[2rem] border-[#ccff00]"></div>
                        <div className="absolute w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-[#ccff00] rounded-full"></div>
                        <div className="absolute top-0 right-1/2 translate-x-8 -translate-y-2 sm:translate-x-12 sm:-translate-y-4 md:translate-x-16 md:-translate-y-6 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-[#ccff00] rounded-full"></div>
                    </div>
                </div>

                {/* 4 Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 text-black dark:text-white transition-colors">

                    {/* Col 1: Brand */}
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter mb-6">
                            <img src="/icon-weinix.svg" alt="Weinix Logo" className="w-8 h-8 object-contain" />
                            <span>WEINIX</span>
                        </div>
                        <p className="text-sm max-w-[280px] leading-relaxed mb-8 opacity-60 text-gray-800 dark:text-gray-300 transition-colors">
                            We are a multidisciplinary architecture studio crafting bold, purposeful spaces that stand the test of time.
                        </p>
                        <div className="flex gap-4">

                            <a href="https://www.instagram.com/weinix.in" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#ccff00] hover:text-black transition-colors">
                                <span className="font-bold text-xs uppercase tracking-widest"><Instagram size={16} /></span>
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Navigation */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-[#ccff00]">Discovery</h4>
                        <ul className="space-y-4 text-sm opacity-60 text-gray-800 dark:text-gray-300 transition-colors">
                            <li><a href="/home" className="hover:text-[#ccff00] hover:opacity-100 transition-colors">Home</a></li>
                            <li><a href="/about-us" className="hover:text-[#ccff00] hover:opacity-100 transition-colors">About</a></li>
                            <li><a href="/products" className="hover:text-[#ccff00] hover:opacity-100 transition-colors">Products</a></li>
                            <li><a href="/blog" className="hover:text-[#ccff00] hover:opacity-100 transition-colors">Blog</a></li>
                            <li><a href="/contact-us" className="hover:text-[#ccff00] hover:opacity-100 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Col 3: Contact */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-[#ccff00]">Contact</h4>
                        <ul className="space-y-4 text-sm opacity-60 text-gray-800 dark:text-gray-300 transition-colors">
                            <li className="flex gap-3">
                                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <a href="mailto:contact@re-verse.in" className="hover:text-[#ccff00] hover:opacity-100 transition-colors">contact@re-verse.in</a>
                            </li>
                            <li className="flex gap-3">
                                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <span>+91 9898458583</span>
                            </li>
                            <li className="flex justify-start gap-3">
                                <svg className="w-4 h-4 mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <span className="text-xs leading-relaxed">
                                    B-911, Titanium City Center (Corporate Building),<br />
                                    Prahlad Nagar Road, Ahmedabad,<br />
                                    Gujarat - 380015, India
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Newsletter */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Newsletter</h4>
                        <p className="text-sm opacity-60 text-gray-800 dark:text-gray-300 mb-6 leading-relaxed transition-colors">
                            Stay informed with the latest listings, insights, and real estate news.
                        </p>
                        <div className="relative flex items-center bg-white dark:bg-[#1a1a1a] rounded-full p-1 border border-black/10 dark:border-white/10 shadow-sm transition-colors">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-transparent pl-4 pr-2 text-sm focus:outline-none text-black dark:text-white"
                            />
                            <button className="bg-[#171717] dark:bg-white text-white dark:text-[#171717] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#ccff00] hover:text-[#171717] dark:hover:bg-[#ccff00] dark:hover:text-[#171717] transition-colors shrink-0">
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom Bar */}
                <div className="pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center text-xs opacity-60 text-black dark:text-white transition-colors">
                    <p>© {new Date().getFullYear()} WEINIX by Re-Verse Green Clothing Pvt. Ltd. All Rights Reserved.</p>

                    {/* Theme Toggle Pill */}
                    <div className="flex items-center justify-center rounded-[2rem] p-1.5 shadow-inner mt-4 md:mt-0 transition-colors">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-2 px-4 rounded-[1.5rem] transition-all duration-300 flex items-center justify-center cursor-pointer ${theme === 'light' ? 'bg-white text-black shadow-sm border border-black/5 dark:bg-[#2a2a2a] dark:text-white dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] dark:border-white/10' : 'hover:text-black dark:hover:text-gray-300 border border-transparent'}`}
                            aria-label="Light Theme"
                        >
                            <Sun size={14} strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-2 px-4 rounded-[1.5rem] transition-all duration-300 flex items-center justify-center cursor-pointer ${theme === 'dark' ? 'bg-white text-black shadow-sm border border-black/5 dark:bg-[#2a2a2a] dark:text-white dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] dark:border-white/10' : 'hover:text-black dark:hover:text-gray-300 border border-transparent'}`}
                            aria-label="Dark Theme"
                        >
                            <Moon size={14} strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => setTheme('system')}
                            className={`p-2 px-4 rounded-[1.5rem] transition-all duration-300 flex items-center justify-center cursor-pointer ${theme === 'system' ? 'bg-white text-black shadow-sm border border-black/5 dark:bg-[#2a2a2a] dark:text-white dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] dark:border-white/10' : 'hover:text-black dark:hover:text-gray-300 border border-transparent'}`}
                            aria-label="System Theme"
                        >
                            <Monitor size={14} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Antimetal Brand Footer */}
                <div className="mt-16 flex items-center justify-center gap-6 md:gap-8 opacity-60 hover:opacity-100 transition-opacity cursor-pointer text-black dark:text-[#a0a0a0]">
                    <img src="/icon-weinix.svg" alt="Weinix Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl" />
                    <span className="text-6xl md:text-8xl font-medium tracking-wide bg-clip-text text-transparent bg-gradient-to-b from-black to-black/60 dark:from-[#cfcfcf] dark:to-[#555]">
                        WEINIX
                    </span>
                </div>
            </div>
        </footer>
    );
}
