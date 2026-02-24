"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Search, Menu, ArrowRight, ArrowUpRight, Play, Star, ArrowDown, ShoppingCart, Monitor, Sun, Moon } from 'lucide-react';

import ProductCarousel from '@/components/ProductCarousel';
import { useRouter } from 'next/navigation';
import FullScreenMenu from '@/components/FullScreenMenu';
import ScrollRevealText from '@/components/ScrollRevealText';
import SpecializationCarousel from '@/components/SpecializationCarousel';
import TestimonialVideo from '@/components/TestimonialVideo';
import CustomCursor from '@/components/CustomCursor';

const AnimatedWord = ({ text, highlight }: { text: string; highlight?: boolean }) => (
    <span className={`inline-block whitespace-nowrap px-1 ${highlight ? 'font-light italic font-serif tracking-normal' : ''}`}>
        {text.split('').map((char, index) => (
            <span key={index} className="inline-block  py-4 -my-4">
                <span className="hero-title-char inline-block translate-y-[120%] opacity-0 origin-bottom-left">
                    {char === ' ' ? '\u00A0' : char}
                </span>
            </span>
        ))}
    </span>
);

const AnimatedNumber = ({ target, suffix = "" }: { target: number, suffix?: string }) => {
    const numRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        const counter = { val: 0 };
        gsap.to(counter, {
            val: target,
            duration: 2.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: numRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            onUpdate: () => {
                if (numRef.current) {
                    numRef.current.innerText = Math.round(counter.val).toString();
                }
            }
        });
    }, [target]);

    return (
        <h2 ref={numRef} className="text-6xl font-bold text-black dark:text-white group-hover:-translate-y-2 transition-transform transition-colors drop-shadow-sm leading-none m-0">
            0
        </h2>
    );
};

const AnimatedLineGraph = () => {
    const pathRef = useRef<SVGPathElement>(null);

    useGSAP(() => {
        if (!pathRef.current) return;
        const length = pathRef.current.getTotalLength() || 500;
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(pathRef.current, {
            strokeDashoffset: 0,
            duration: 1.5,
            delay: 0.2, // slight delay after scroll
            ease: "power2.out",
            scrollTrigger: {
                trigger: pathRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    }, []);

    return (
        <div className="w-full h-16 my-4 w-[120%] -ml-[10%] opacity-80 group-hover:opacity-100 transition-opacity">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 50" preserveAspectRatio="none">
                {/* Subtle background grid lines */}
                <path d="M 0 12.5 L 200 12.5 M 0 25 L 200 25 M 0 37.5 L 200 37.5" stroke="currentColor" strokeWidth="0.5" className="text-black/5 dark:text-white/5" />

                {/* The animated trend line */}
                <path
                    ref={pathRef}
                    d="M 0 45 Q 20 40 40 35 T 80 20 T 120 15 T 160 5 T 200 0"
                    fill="none"
                    stroke="#ccff00"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(204,255,0,0.6)]"
                />
            </svg>
        </div>
    );
};

const AnimatedCircleGraph = () => {
    const circleRef = useRef<SVGCircleElement>(null);
    const numRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        if (!circleRef.current) return;

        // Math for 40px radius circle
        const length = 251.2;
        const targetOffset = 100.48; // 60% full

        gsap.set(circleRef.current, { strokeDasharray: length, strokeDashoffset: length });

        const counter = { val: 0 };
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: circleRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        tl.to(circleRef.current, {
            strokeDashoffset: targetOffset,
            duration: 2.5,
            ease: "power3.out",
        }, 0);

        tl.to(counter, {
            val: 60,
            duration: 2.5,
            ease: "power3.out",
            onUpdate: () => {
                if (numRef.current) {
                    numRef.current.innerText = Math.round(counter.val) + "%";
                }
            }
        }, 0);
    }, []);

    return (
        <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/10 dark:text-white/10 transition-colors" />
                <circle
                    ref={circleRef}
                    cx="50" cy="50" r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-[#ccff00] drop-shadow-[0_0_8px_rgba(204,255,0,0.4)]"
                    style={{ strokeLinecap: "round" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span ref={numRef} className="text-3xl font-bold text-black dark:text-white transition-colors">0%</span>
                <span className="text-[10px] uppercase tracking-widest text-[#ccff00]">Recycled</span>
            </div>
        </div>
    );
};

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeAccordion, setActiveAccordion] = useState<number>(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    // Audio and Loader State
    const [hasEntered, setHasEntered] = useState(false);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hasScrolledTable, setHasScrolledTable] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const masterTlRef = useRef<gsap.core.Timeline | null>(null);

    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (theme === 'system') {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            setIsDarkMode(mq.matches);

            const listener = (e: MediaQueryListEvent) => {
                setIsDarkMode(e.matches);
            };
            mq.addEventListener('change', listener);
            return () => mq.removeEventListener('change', listener);
        } else {
            setIsDarkMode(theme === 'dark');
        }
    }, [theme]);

    const specializations = [
        "Architecture",
        "Interior Design",
        "Masterplan",
        "Construction",
        "Documentation"
    ];

    const projects = [
        { title: "Crescent", subtitle: "2024 / COMMERCIAL", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" },
        { title: "Ventureplex", subtitle: "2024 / CORPORATE", image: "https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=800&auto=format&fit=crop", active: true },
        { title: "Horizon", subtitle: "2023 / RESIDENTIAL", image: "https://images.unsplash.com/photo-1545622744-8d4cb237deaf?q=80&w=800&auto=format&fit=crop" },
    ];

    // Handle Audio Mute Toggle
    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Handle actual entry after clicking "Enter"
    const handleEnter = () => {
        setHasEntered(true);
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
        if (masterTlRef.current) {
            masterTlRef.current.play();
        }
    };

    useGSAP(() => {
        // Master startup timeline (paused until user interaction)
        const masterTl = gsap.timeline({ paused: true });
        masterTlRef.current = masterTl;

        // 1. Initial logo fade up
        masterTl.to('.loader-text', { opacity: 1, duration: 0.8, y: -20, ease: "power3.out" })
            // 2. Logo fade out
            .to('.loader-text', { opacity: 0, duration: 0.5, delay: 0.2, y: -40, ease: "power3.in" })
            // 3. Black background slides up
            .to('.loader-bg', { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.2")
            // 4. Yellow container slides up
            .to('.loader-container', { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.65")
            // 5. Hide container
            .set('.loader-container', { display: "none" });

        // Hero entry animation correctly sequenced after the loader finishes
        masterTl.fromTo('.hero-bg-video',
            { scale: 1.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" },
            "-=0.4"
        )
            .fromTo('.hero-title-char',
                { y: '120%', opacity: 0, rotationZ: 10 },
                { y: '0%', opacity: 1, rotationZ: 0, duration: 0.8, stagger: 0.03, ease: "power4.out" },
                "-=1.0"
            )
            .fromTo('.hero-subtitle',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                "-=0.5"
            )
            .fromTo('.hero-cta',
                { filter: 'blur(12px)', opacity: 0, y: 15 },
                { filter: 'blur(0px)', opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
                "-=0.3"
            );

        // Section reveal animations
        const sections = gsap.utils.toArray('.animate-section') as HTMLElement[];
        sections.forEach((section: HTMLElement) => {
            gsap.fromTo(section,
                { autoAlpha: 0, y: 50 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                    }
                }
            );
        });

        // Spinning badge
        gsap.to('.spinning-badge', {
            rotation: 360,
            duration: 10,
            repeat: -1,
            ease: "linear"
        });

    });

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            {/* ---------- BACKGROUND AUDIO ---------- */}
            <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

            {/* ---------- AUDIO TOGGLE ---------- */}
            {hasEntered && (
                <button
                    onClick={toggleMute}
                    className="fixed bottom-6 left-6 z-[100] w-12 h-12 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md flex justify-center cursor-pointer items-center hover:bg-white dark:hover:bg-white/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden group"
                    aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                >
                    {isMuted ? (
                        <div className="w-5 h-[2px] bg-black dark:bg-white rounded-full transition-all duration-300"></div>
                    ) : (
                        <svg className="w-6 h-6 text-black dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                @keyframes wave {
                                    0% { d: path("M3 12h2l2-2 3 4 3-4 3 4 2-2h3"); }
                                    20% { d: path("M3 12h2l2-8 3 16 3-16 3 16 2-8h3"); }
                                    40% { d: path("M3 12h2l2-4 3 8 3-8 3 8 2-4h3"); }
                                    60% { d: path("M3 12h2l2-10 3 20 3-20 3 20 2-10h3"); }
                                    80% { d: path("M3 12h2l2-6 3 12 3-12 3 12 2-6h3"); }
                                    100% { d: path("M3 12h2l2-2 3 4 3-4 3 4 2-2h3"); }
                                }
                                .wave-path { animation: wave 1.2s infinite ease-in-out; }
                            `}} />
                            <path className="wave-path" d="M3 12h2l2-2 3 4 3-4 3 4 2-2h3" />
                        </svg>
                    )}
                </button>
            )}

            <CustomCursor />

            {/* ---------- INITIAL LOADING SCREEN ---------- */}
            <div className={`loader-container fixed inset-0 z-[200] bg-[#ccff00] flex flex-col items-center justify-center ${hasEntered ? 'pointer-events-none' : ''}`}>
                <div className="loader-bg absolute inset-0 bg-[#0a0a0a]" />

                {!hasEntered ? (
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="text-white text-3xl md:text-5xl font-bold tracking-tighter flex items-center gap-4 mb-8">
                            <div className="w-8 h-8 bg-[#ccff00] transform rotate-45 rounded-sm" />
                            <span>WEINIX</span>
                        </div>
                        <button
                            onClick={handleEnter}
                            disabled={!isVideoLoaded}
                            className={`text-white border border-white/30 px-8 py-3 rounded-full uppercase tracking-widest text-sm font-bold text-center transition-all duration-300 ${isVideoLoaded ? 'hover:bg-white hover:text-black cursor-pointer animate-pulse' : 'opacity-50 cursor-wait'}`}
                        >
                            {isVideoLoaded ? 'Enter Experience' : 'Loading Experience...'}  
                        </button>
                    </div>
                ) : (
                    <div className="loader-text relative z-10 opacity-0 transform translate-y-5 text-white text-3xl md:text-5xl font-bold tracking-tighter flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#ccff00] transform rotate-45 rounded-sm" />
                        <span>WEINIX</span>
                    </div>
                )}
            </div>

            <div ref={containerRef} className="bg-[#f5f5f5] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] min-h-screen overflow-hidden font-sans transition-colors duration-500">

                {/* ---------- NAVBAR ---------- */}
                <nav className="absolute w-full z-50 px-6 py-4 top-0 left-0 transition-colors duration-500 bg-transparent">
                    <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-3 font-bold text-xl tracking-tighter text-black dark:text-white transition-colors">
                            <div className="w-4 h-4 bg-[#ccff00] transform rotate-45 rounded-sm" />
                            <span>WEINIX</span>
                        </div>
                        <div className="hidden md:flex gap-10 text-xs uppercase tracking-widest font-semibold text-black dark:text-white transition-colors">
                            <a href="#" className="hover:opacity-70 transition-opacity">Home</a>
                            <a href="#" className="hover:opacity-70 transition-opacity">Project</a>
                            <a href="#" className="hover:opacity-70 transition-opacity">Service</a>
                            <a href="#" className="hover:opacity-70 transition-opacity">Blog</a>
                        </div>
                        <div className="flex items-center gap-6 text-black dark:text-white transition-colors">
                            <button className="hover:opacity-70 transition-opacity cursor-pointer"><Search size={18} /></button>
                            <button className="hover:opacity-70 transition-opacity cursor-pointer"><ShoppingCart size={22} /></button>
                            <button className="hover:opacity-70 transition-opacity cursor-pointer" onClick={() => setIsMenuOpen(true)}>
                                <Menu size={22} />
                            </button>
                        </div>
                    </div>
                </nav>
                <nav className={`fixed w-full z-[100] px-6 py-4 top-0 left-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 transition-all duration-500 transform ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                    <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-3 font-bold text-xl tracking-tighter text-black dark:text-white transition-colors">
                            <div className="w-4 h-4 bg-[#ccff00] transform rotate-45 rounded-sm" />
                            <span>WEINIX</span>
                        </div>
                        <div className="hidden md:flex gap-10 text-xs uppercase tracking-widest font-semibold text-black dark:text-white transition-colors">
                            <a href="#" className="hover:opacity-70 transition-opacity">Home</a>
                            <a href="#" className="hover:opacity-70 transition-opacity">Project</a>
                            <a href="#" className="hover:opacity-70 transition-opacity">Service</a>
                            <a href="#" className="hover:opacity-70 transition-opacity">Blog</a>
                        </div>
                        <div className="flex items-center gap-6 text-black dark:text-white transition-colors">
                            <button className="hover:opacity-70 transition-opacity cursor-pointer"><Search size={18} /></button>
                            <button className="hover:opacity-70 transition-opacity cursor-pointer" onClick={() => router.push('/cart')}><ShoppingCart size={22} /></button>
                            <button className="hover:opacity-70 transition-opacity cursor-pointer" onClick={() => setIsMenuOpen(true)}>
                                <Menu size={22} />
                            </button>
                        </div>
                    </div>
                </nav>

                {/* ---------- HERO SECTION ---------- */}
                <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#e0e1e5]/10 dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-500">

                    {/* Background Video */}
                    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center bg-black">
                        <video
                            key={isDarkMode ? 'dark' : 'light'}
                            className="hero-bg-video w-full h-full object-cover opacity-90"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            onCanPlayThrough={() => setIsVideoLoaded(true)}
                            onLoadedData={() => setIsVideoLoaded(true)}
                        >
                            <source src="hero-section 2.mp4" type="video/mp4" />
                            <source src="hero-section 2.webm" type="video/webm" />
                        </video>
                        {/* <div className="absolute inset-0 bg-black/15 z-[1]"></div> */}
                        {/* Radial Gradient overlay focused on center */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,transparent_70%)] z-[2]"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 w-full max-w-[1000px] mx-auto flex flex-col items-center justify-center text-center px-4 md:px-8 mt-[-6rem] pointer-events-auto">

                        {/* Title Lines (split for staggered animation) */}
                        <h1 className="hero-title text-4xl sm:text-5xl lg:text-[4rem] font-extrabold leading-[1.1] tracking-tight text-center text-black dark:text-white mb-6 flex flex-col w-full max-w-[800px] mx-auto uppercase [text-shadow:0px_4px_20px_rgba(0,0,0,0.1)]">
                            <div className="flex flex-wrap justify-center items-center w-full gap-x-2 sm:gap-x-3">
                                <AnimatedWord text="Build" />
                                <AnimatedWord text="Sustainable." highlight={true} />
                            </div>
                            <div className="flex flex-wrap justify-center items-center w-full gap-x-2 sm:gap-x-3 md:-mt-2">
                                <AnimatedWord text="Live" />
                                <AnimatedWord text="Purposeful." highlight={true} />
                            </div>
                        </h1>

                        <p className="hero-subtitle text-sm md:text-base font-bold tracking-wide text-black/80 dark:text-white/80 max-w-xl mx-auto leading-relaxed mb-8 [text-shadow:0px_4px_20px_rgba(0,0,0,0.8)]">
                            Revolutionary building materials crafted from recycled textiles. <br className="hidden md:block" /> Structural strength meets environmental conscience.
                        </p>

                        <div className="hero-cta flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 w-full">
                            <button className="bg-black/60 dark:bg-white/10 text-white backdrop-blur-sm border border-white/20 font-semibold tracking-wide text-xs md:text-sm px-6 py-3 rounded-[20px] hover:bg-black/80 dark:hover:bg-white/20 transition-all duration-300 w-full sm:w-auto shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                                Explore Our Story
                            </button>
                            <button className="bg-transparent text-white border-2 border-white/30 font-semibold tracking-wide text-xs md:text-sm px-6 py-3 rounded-[20px] hover:bg-white/10 hover:border-white/60 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm [text-shadow:0px_2px_10px_rgba(0,0,0,0.5)]">
                                Shop Sustainable Bricks
                            </button>
                            <button
                                onClick={() => router.push('/editor')}
                                className="bg-[#ccff00] text-black font-semibold tracking-wide text-xs md:text-sm px-6 py-3 rounded-[20px] shadow-[0_8px_30px_rgba(204,255,0,0.2)] hover:scale-[1.03] transition-transform duration-300 w-full sm:w-auto border border-[#ccff00]">
                                Experience in 3D
                            </button>
                        </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 w-full ${isDarkMode ? 'h-24' : 'h-8 opacity-20'}  bg-gradient-to-b from-transparent to-white dark:to-[#0a0a0a] pointer-events-none`}></div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-20 mix-blend-difference text-white opacity-80">
                        <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
                        <div className="w-[1px] h-10 bg-white/30 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[scrollLine_2s_infinite_ease-in-out]" />
                        </div>
                    </div>
                </section>

                {/* ---------- TRANSFORMATION STORY (TEXT REVEAL + BENTO GRID) ---------- */}
                <ScrollRevealText />

                {/* ---------- SUBTLE TICKER ---------- */}
                <div className="w-full bg-[#ccff00] py-4 md:py-6 transform -rotate-3 scale-110 my-12 overflow-hidden flex whitespace-nowrap z-20 relative border-y-[3px] border-black drop-shadow-lg">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes ticker-marquee {
                            0% { transform: translateX(0%); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-ticker {
                            animation: ticker-marquee 30s linear infinite;
                            display: flex;
                            width: max-content;
                        }
                    `}} />
                    <div className="animate-ticker items-center flex">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center">
                                <span className="text-black font-semibold text-3xl md:text-5xl lg:text-[4rem] uppercase tracking-tighter mx-4 md:mx-8">500+ tons textile waste transformed</span>
                                <svg className="w-8 h-8 md:w-12 md:h-12 text-black fill-current mx-2 transform scale-y-90" viewBox="0 0 10 9" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 0h2v1h1v1h2V1h1V0h2v3h1v2h-1v1H8v1H7v1H6v1H4V8H3V7H2V6H1V5H0V3h1V0z" />
                                </svg>
                                <span className="text-black font-semibold text-3xl md:text-5xl lg:text-[4rem] uppercase tracking-tighter mx-4 md:mx-8">50K+ sustainable bricks produced</span>
                                <svg className="w-8 h-8 md:w-12 md:h-12 text-black fill-current mx-2 transform scale-y-90" viewBox="0 0 10 9" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 0h2v1h1v1h2V1h1V0h2v3h1v2h-1v1H8v1H7v1H6v1H4V8H3V7H2V6H1V5H0V3h1V0z" />
                                </svg>
                                <span className="text-black font-semibold text-3xl md:text-5xl lg:text-[4rem] uppercase tracking-tighter mx-4 md:mx-8">100% Carbon Neutral Manufacturing</span>
                                <svg className="w-8 h-8 md:w-12 md:h-12 text-black fill-current mx-2 transform scale-y-90" viewBox="0 0 10 9" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 0h2v1h1v1h2V1h1V0h2v3h1v2h-1v1H8v1H7v1H6v1H4V8H3V7H2V6H1V5H0V3h1V0z" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>

                <section className="pb-24 pt-12 px-4 md:px-8 max-w-[1200px] mx-auto text-black dark:text-white transition-colors duration-500 relative z-30">
                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[repeat(4,_minmax(260px,_auto))] gap-4 h-auto animate-section">

                        {/* Stage 4 (Top Left) */}
                        <div className="md:col-span-1 md:row-span-2 bg-white dark:bg-[#222222] border border-gray-100 dark:border-transparent transition-colors duration-500 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group relative overflow-hidden cursor-pointer">
                            <h3 className="text-xl font-bold mb-8 text-black dark:text-white transition-colors">Fiber Blending</h3>
                            <AnimatedCircleGraph />
                            <h4 className="text-3xl font-bold text-black dark:text-white mb-2 transition-colors">+ 40%</h4>
                            <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors">Virgin Cotton.<br />Perfect blend of sustainability.</p>
                        </div>

                        {/* Stage 3 pt1 (Top Mid-L) */}
                        <div className="md:col-span-1 md:row-span-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-center group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-colors duration-500">
                            <div className="flex items-end gap-2 mb-2">
                                <h3 className="text-4xl font-bold text-black dark:text-white group-hover:text-[#ccff00] transition-colors">Pure</h3>
                                <span className="text-sm pb-1 text-[#ccff00]">Fibers</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">Mechanical shredding breaks fabrics back to their core. Ready for rebirth.</p>
                        </div>

                        {/* Stage 3 pt2 (Top Mid-R) */}
                        <div className="md:col-span-1 md:row-span-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-end items-end text-right group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-colors duration-500 relative overflow-hidden">
                            <img src="mesh.png" alt="" className="w-48 h-48 object-cover absolute -top-8 -left-8 opacity-40 group-hover:opacity-60 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 pointer-events-none" />
                            <div className="relative z-10 w-full flex flex-col items-end justify-end">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors">No Chemicals</p>
                                <h3 className="text-5xl font-bold text-black dark:text-white mb-1 group-hover:scale-105 transition-transform origin-right">0%</h3>
                                <p className="text-[#e78b1f] text-sm font-bold">Dyes used</p>
                            </div>
                        </div>

                        {/* Stage 2 (Top Right) */}
                        <div className="md:col-span-1 md:row-span-2 bg-white dark:bg-[#222222] border border-gray-100 dark:border-transparent transition-colors duration-500 rounded-[2rem] p-8 flex flex-col justify-between group cursor-pointer">
                            <div>
                                <h3 className="text-lg font-bold text-black dark:text-white mb-6 leading-snug transition-colors">Every piece is sorted by hand. Quality matters, even in waste.</h3>
                                <div className="flex -space-x-3 mb-8">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                    <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                    <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                    <button
                                        className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] bg-[#ccff00] text-black flex items-center justify-center text-xl font-bold transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10 relative"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const x = rect.left + rect.width / 2;
                                            const y = rect.top + rect.height / 2;

                                            for (let i = 0; i < 12; i++) {
                                                const particle = document.createElement('div');
                                                particle.className = 'fixed w-2 h-2 rounded-full bg-[#ccff00] pointer-events-none z-[100]';
                                                particle.style.left = `${x}px`;
                                                particle.style.top = `${y}px`;
                                                document.body.appendChild(particle);

                                                const angle = (Math.PI * 2 * i) / 12;
                                                const velocity = 50 + Math.random() * 50;

                                                gsap.to(particle, {
                                                    x: Math.cos(angle) * velocity,
                                                    y: Math.sin(angle) * velocity,
                                                    opacity: 0,
                                                    scale: 0.5 + Math.random(),
                                                    duration: 0.6 + Math.random() * 0.4,
                                                    ease: "power2.out",
                                                    onComplete: () => particle.remove()
                                                });
                                            }
                                        }}
                                    >
                                        <span className="mb-1">+</span>
                                    </button>
                                </div>
                            </div>

                            <AnimatedLineGraph />

                            <div className="relative z-10">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors">Rural Women Employed</p>
                                <div className="flex items-baseline gap-2">
                                    <AnimatedNumber target={50} />
                                    <span className="text-[#ccff00] text-xl font-bold">+</span>
                                </div>
                            </div>
                        </div>

                        {/* Stage 1 (Center Big) */}
                        <div className="md:col-span-2 md:row-span-2 rounded-[2rem] relative flex items-center justify-center p-0 overflow-hidden group cursor-pointer">
                            <img src="collection.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Collection" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 dark:from-[#171717] dark:via-[#171717]/40 to-transparent transition-colors duration-500"></div>

                            <div className="absolute left-6 bottom-1/3 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 p-3 rounded-2xl flex items-center gap-3 group-hover:-translate-y-2 transition-all duration-500 delay-100">
                                <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center text-black">
                                    <ArrowUpRight size={16} />
                                </div>
                                <div>
                                    <p className="text-black dark:text-white font-bold text-sm transition-colors">3 kg CO2</p>
                                    <div className="w-16 h-1 bg-black/20 dark:bg-white/30 rounded-full mt-1"><div className="w-2/3 h-full bg-[#ccff00] rounded-full"></div></div>
                                </div>
                            </div>

                            <div className="absolute right-6 bottom-1/4 bg-white/80 dark:bg-[#1a1a1a] backdrop-blur-md border border-black/10 dark:border-white/10 p-5 rounded-2xl text-black dark:text-white group-hover:-translate-y-2 transition-all duration-500 delay-200">
                                <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center absolute top-3 right-3 text-[#ccff00] text-xs transition-colors">♥</div>
                                <h3 className="text-2xl font-bold mb-1">1 kg</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 transition-colors">Collected Textiles</p>
                                <p className="text-[#22c55e] text-xs font-bold flex items-center gap-1">▲ Prevented</p>
                            </div>

                            <div className="absolute bottom-6 left-6 right-6 z-10 pointers-events-none">
                                <span className="bg-[#ccff00] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Stage 1: Collection</span>
                                <p className="text-black dark:text-white text-base md:text-lg font-medium leading-snug w-full md:w-3/4 transition-colors">
                                    &quot;It starts with you. Old clothes, worn linens, forgotten fabrics—we collect them before they reach the landfill.&quot;
                                </p>
                            </div>
                        </div>

                        {/* Stage 5 (Bottom Left) */}
                        <div className="md:col-span-1 md:row-span-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col items-center group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-colors duration-500">
                            <div className="bg-[#ccff00] text-black text-xl font-bold rounded-2xl p-4 text-center w-full mb-6">
                                Ancient Craft <br /> + Sustainability
                            </div>
                            <div className="relative w-full h-40 mb-6 flex justify-center items-center">
                                <img src="weaving-1.webp" className="w-24 h-32 rounded-[1rem] object-cover absolute -rotate-12 group-hover:rotate-0 transition-transform duration-500" alt="Weaving 1" />
                                <img src="weaving-2.webp" className="w-24 h-32 rounded-[1rem] object-cover absolute rotate-12 mt-8 ml-8 group-hover:rotate-0 transition-transform duration-500 delay-100 border-2 border-white dark:border-[#1a1a1a] transition-colors" alt="Weaving 2" />
                            </div>
                            <p className="text-black dark:text-white text-center text-sm font-medium leading-relaxed mt-4 transition-colors">
                                Traditional looms weave rescued fibers into premium sheets. Each takes 4 hours, touching 12 pairs of skilled hands.
                            </p>
                        </div>

                        {/* Stage 6 pt1 (Middle Right - CUBO equivalent) */}
                        <div className="md:col-span-1 md:row-span-1 bg-white dark:bg-[#222222] border border-gray-100 dark:border-transparent transition-colors duration-500 rounded-[2rem] flex flex-col items-center justify-center p-6 group cursor-pointer overflow-hidden relative">
                            <div className="w-16 h-16 border-4 border-black/10 dark:border-white/20 rounded-full flex items-center justify-center relative mb-4 group-hover:scale-110 transition-transform duration-300">
                                <div className="w-6 h-6 border-4 border-[#ccff00] rounded-full absolute -top-2"></div>
                                <div className="w-6 h-6 border-4 border-black dark:border-white rounded-full absolute -bottom-1 -left-1 transition-colors"></div>
                                <div className="w-6 h-6 border-4 border-[#e78b1f] rounded-full absolute -bottom-1 -right-1"></div>
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white tracking-widest transition-colors">OEKO-TEX®</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Certified</p>
                        </div>

                        {/* Stage 6 pt2 (Bottom Mid-L - Color Swatches equivalent) */}
                        <div className="md:col-span-1 md:row-span-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-between group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-colors duration-500">
                            <div>
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-1 transition-colors">300 TC</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest transition-colors">Quality Note</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-[#222222] group-hover:bg-white transition-colors duration-300 delay-0"></div>
                                <div className="w-10 h-10 rounded-xl bg-gray-300 dark:bg-[#333333] group-hover:bg-[#ccff00] transition-colors duration-300 delay-75"></div>
                                <div className="w-10 h-10 rounded-xl bg-gray-400 dark:bg-[#444444] group-hover:bg-[#e78b1f] transition-colors duration-300 delay-150"></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 font-medium transition-colors">Softer than conventional cotton.</p>
                        </div>

                        {/* Stage 6 pt3 (Bottom Right - We Build Future equivalent) */}
                        <div className="md:col-span-2 md:row-span-1 bg-[#ccff00] rounded-[2rem] p-8 flex items-center justify-between group cursor-pointer overflow-hidden relative">
                            <div className="z-10 relative">
                                <p className="text-black/50 text-[10px] font-bold uppercase tracking-widest mb-2">Stage 6: Finishing & Quality</p>
                                <h2 className="text-3xl md:text-5xl font-bold text-black mb-2 leading-none tracking-tighter">Waste,<br />Reimagined.</h2>
                                <p className="text-black/80 text-sm font-semibold max-w-[200px] mt-4">Every sheet passes 7 quality checks before reaching you.</p>
                            </div>
                            <div className="absolute -right-10 -top-10 text-black/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                <img src="spring.png" alt="Interactive placeholder" className="w-[240px] h-[240px] rounded-[3rem] object-cover opacity-100" />
                            </div>
                        </div>

                    </div>
                </section>

                {/* ---------- OUR SPECIALIZATION ---------- */}
                <SpecializationCarousel />

                {/* ---------- PRODUCT SHOWCASE (3D CAROUSEL) ---------- */}
                <ProductCarousel />

                {/* ---------- SELECTED WORKS (VIDEO BLOCK) ---------- */}
                <section className="py-32 px-4 md:px-8 bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-500">
                    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16 animate-section">
                        <div className="md:w-1/3">
                            <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter mb-6">SELECTED<br />WORKS</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 transition-colors">
                                We translate our client&apos;s vision into highly curated design. We are dedicated to providing the best possible service for all our architectural endeavours.
                            </p>
                            <button className="bg-[#ccff00] text-[#171717] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                                Explore
                            </button>
                        </div>

                        <div className="md:w-2/3 w-full flex gap-6">
                            <div className="w-[60%] h-[400px] rounded-3xl overflow-hidden relative cursor-pointer group">
                                <img src="https://images.unsplash.com/photo-1574519659052-780c7a523aee?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Building Video" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/50 dark:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-[#ccff00] group-hover:text-black transition-colors pl-1">
                                        <Play size={24} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-[40%] h-[400px] rounded-3xl overflow-hidden relative">
                                <img src="https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Building Detail" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ---------- GENERAL PURPOSE BUILDINGS ---------- */}
                <section className="py-32 px-4 md:px-8 max-w-[1200px] mx-auto relative animate-section text-black dark:text-white transition-colors duration-500">
                    <div className="flex flex-col md:flex-row h-[600px] gap-8 relative z-0">
                        <div className="w-full md:w-1/2 h-full rounded-3xl overflow-hidden bg-[#007090]">
                            <img src="https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-overlay opacity-80" alt="White Architecture" />
                        </div>
                        <div className="w-full md:w-1/2 h-full pt-32">
                            <div className="w-full h-[80%] rounded-3xl overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Steel Architecture" />
                            </div>
                        </div>
                    </div>
                    {/* Floating overlapping white card */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[600px] bg-white dark:bg-[#1a1a1a] p-12 rounded-3xl shadow-2xl z-10 border border-gray-100 dark:border-white/5 transition-colors duration-500">
                        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4 leading-tight">GENERAL<br />PURPOSE<br />BUILDINGS</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 transition-colors">
                            We translate our client&apos;s vision into highly curated design. We are dedicated to providing the best architecture, transforming skylines globally.
                        </p>
                        <button className="bg-[#171717] dark:bg-white text-white dark:text-[#171717] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#ccff00] hover:text-[#171717] dark:hover:bg-[#ccff00] dark:hover:text-[#171717] transition-colors">
                            Discover <ArrowUpRight size={16} />
                        </button>
                    </div>
                </section>

                {/* ---------- HONEST COMPARISON ---------- */}
                <section className="py-32 px-4 md:px-8 bg-white dark:bg-[#121212] text-black dark:text-white transition-colors duration-500">
                    <div className="max-w-[1200px] mx-auto animate-section">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 text-black dark:text-white transition-colors">Honest Comparison</h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm uppercase tracking-widest leading-loose transition-colors">
                                Weinix Sustainable Brick — Your Best Choice for Sustainable Construction
                            </p>
                        </div>

                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transition-colors duration-500">
                            {/* Scroll Hint Overlay (Mobile Only) */}
                            <div className={`md:hidden absolute inset-y-0 right-0 z-10 w-24 flex items-center justify-end pr-4 pointer-events-none bg-gradient-to-l from-black/80 dark:from-black via-black/40 to-transparent transition-opacity duration-500 ${!hasScrolledTable ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="flex flex-col items-center gap-2 text-white drop-shadow-md pb-4">
                                    <ArrowRight size={24} className="animate-[fadeSlideRight_1.5s_infinite_ease-in-out]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Swipe</span>
                                </div>
                            </div>

                            <div
                                onScroll={(e) => {
                                    const target = e.target as HTMLDivElement;
                                    // Hide hint when scrolled right, show again when back at the start
                                    setHasScrolledTable(target.scrollLeft > 20);
                                }}
                                className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 overflow-x-auto w-full smooth-scroll"
                            >
                                {/* Table Header */}
                                <div className="grid grid-cols-4 min-w-[800px] border-b border-black/10 dark:border-white/10 relative transition-colors">
                                    <div className="p-6 md:p-8 flex items-center">
                                        <span className="font-bold text-base md:text-xl uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors">Feature</span>
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center border-l border-black/10 dark:border-white/5 transition-colors">
                                        <span className="font-bold text-base md:text-xl tracking-tighter text-black dark:text-white transition-colors">Fired Clay Brick</span>
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center border-l border-black/10 dark:border-white/5 transition-colors">
                                        <span className="font-bold text-base md:text-xl tracking-tighter text-black dark:text-white transition-colors">Concrete Block</span>
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center bg-[#ccff00]/10 border-l border-[#ccff00]/20 relative overflow-hidden group">
                                        <div className="absolute top-0 w-full h-1 bg-[#ccff00]"></div>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ccff00]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Star className="w-5 h-5 md:w-6 md:h-6 text-[#ccff00] drop-shadow-md" />
                                        </div>
                                        <span className="font-bold text-base md:text-xl tracking-tighter text-[#ccff00]">Weinix Sustainable Brick</span>
                                    </div>
                                </div>

                                {/* Table Rows */}
                                {[
                                    {
                                        feature: "Water Usage",
                                        firedClay: "15L per brick",
                                        concrete: "8L per brick",
                                        weinix: "0.3L per brick (98% less)"
                                    },
                                    {
                                        feature: "CO2 Emissions",
                                        firedClay: "0.5 kg (kiln firing)",
                                        concrete: "0.4 kg (cement)",
                                        weinix: "0.05 kg (90% less)"
                                    },
                                    {
                                        feature: "Energy Consumption",
                                        firedClay: "Very High (firing)",
                                        concrete: "High (cement production)",
                                        weinix: "Low (compression only)"
                                    },
                                    {
                                        feature: "Compressive Strength",
                                        firedClay: "3.5-10 MPa",
                                        concrete: "4-12 MPa",
                                        weinix: "5-8 MPa (load-bearing certified)"
                                    },
                                    {
                                        feature: "Thermal Insulation",
                                        firedClay: "0.6-0.8 W/mK",
                                        concrete: "1.0-1.3 W/mK",
                                        weinix: "0.4-0.5 W/mK (40% better)"
                                    },
                                    {
                                        feature: "Fire Resistance",
                                        firedClay: "Excellent",
                                        concrete: "Excellent",
                                        weinix: "Good (Class B fire rating)"
                                    },
                                    {
                                        feature: "Weight",
                                        firedClay: "3-3.5 kg",
                                        concrete: "8-10 kg",
                                        weinix: "2.5-3 kg (easier handling)"
                                    },
                                    {
                                        feature: "Recyclability",
                                        firedClay: "Low",
                                        concrete: "Low",
                                        weinix: "High (can be reprocessed)"
                                    },
                                    {
                                        feature: "Price per sq meter",
                                        firedClay: "₹400-500",
                                        concrete: "₹350-450",
                                        weinix: "₹420-480 (competitive premium)"
                                    }
                                ].map((row, idx) => (
                                    <div key={idx} className="grid grid-cols-4 min-w-[800px] border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                                        <div className="p-4 md:p-8 flex items-center">
                                            <span className="font-medium text-sm md:text-base text-gray-700 dark:text-gray-300 transition-colors">{row.feature}</span>
                                        </div>
                                        <div className="p-4 md:p-8 flex items-center justify-center text-center border-l border-black/5 dark:border-white/5 text-sm md:text-base text-gray-500 dark:text-gray-400 transition-colors">
                                            <span>{row.firedClay}</span>
                                        </div>
                                        <div className="p-4 md:p-8 flex items-center justify-center text-center border-l border-black/5 dark:border-white/5 text-sm md:text-base text-gray-500 dark:text-gray-400 transition-colors">
                                            <span>{row.concrete}</span>
                                        </div>
                                        <div className="p-4 md:p-8 flex items-center justify-center text-center bg-[#ccff00]/5 border-l border-[#ccff00]/20 text-sm md:text-base text-black dark:text-white font-bold group-hover:bg-[#ccff00]/10 transition-colors">
                                            <span>{row.weinix}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ---------- TESTIMONIALS ---------- */}
                <section className="py-12 px-4 md:px-8 max-w-[1200px] mx-auto text-center bg-gray-100 dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-500 rounded-3xl mb-8">
                    <div className="animate-section mb-16 pt-16">
                        <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 text-black dark:text-white transition-colors">WHAT ARE THEY<br />SAYING?</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm uppercase tracking-widest leading-loose transition-colors">
                            we translate our client&apos;s vision into highly curated design <br />
                            and deliver top-tier architectural results.
                        </p>
                    </div>

                    <TestimonialVideo />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-section text-left px-8">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-white/5 transition-colors duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gray-200 dark:bg-[#222222] rounded-full overflow-hidden transition-colors">
                                        <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Avatar" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-black dark:text-white transition-colors">Client Name {i + 1}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase transition-colors">Architecture Pro</p>
                                    </div>
                                </div>
                                <h5 className="font-bold text-lg mb-4 text-black dark:text-white transition-colors">Great Work</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 transition-colors">
                                    &quot;They translate our client&apos;s vision into highly curated design. We are dedicated to providing the best possible service and they delivered beyond expectations. Truly remarkable.&quot;
                                </p>
                                <div className="flex text-[#ccff00]">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pb-16 animate-section">
                        <button className="bg-[#171717] dark:bg-white text-white dark:text-[#171717] px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#ccff00] hover:text-[#171717] dark:hover:bg-[#ccff00] dark:hover:text-[#171717] transition-colors">
                            View All
                        </button>
                    </div>
                </section>

                {/* ---------- NEW FOOTER ---------- */}
                <footer className="relative pt-32 pb-12 px-4 md:px-8 mt-12 bg-gray-100 dark:bg-[#0a0a0a] transition-colors duration-500 overflow-hidden">
                    {/* Background subtle lines / grain simulation */}
                    <div className="absolute inset-0 opacity-10 dark:opacity-5 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 5px)' }}></div>

                    <div className="max-w-[1200px] mx-auto relative z-10 animate-section">

                        {/* CTA Floating Card */}
                        <div className="bg-white dark:bg-[#111111] rounded-[3rem] p-10 md:p-16 mb-24 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 border border-black/5 dark:border-white/5 transition-colors">
                            <div className="flex-1 max-w-2xl">
                                <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-black dark:text-white leading-[1.1] mb-10 transition-colors">
                                    Let&apos;s Turn Big Ideas Into Extraordinary Realities – Together
                                </h3>
                                <div className="flex flex-wrap items-center gap-4">
                                    <button className="bg-[#171717] dark:bg-white text-white dark:text-[#171717] px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#ccff00] hover:text-[#171717] dark:hover:bg-[#ccff00] dark:hover:text-[#171717] transition-colors">
                                        Contact Sales
                                    </button>
                                    <button className="bg-transparent border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white text-black dark:text-white px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase flex items-center gap-2 transition-colors">
                                        <ArrowRight size={16} /> Book a Consultation
                                    </button>
                                </div>
                            </div>

                            {/* Abstract Brand Graphic */}
                            <div className="shrink-0 relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-[1.5rem] md:border-[2rem] border-[#ccff00]"></div>
                                <div className="absolute w-20 h-20 md:w-28 md:h-28 bg-[#ccff00] rounded-full"></div>
                                <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-4 md:translate-x-16 md:-translate-y-6 w-10 h-10 md:w-14 md:h-14 bg-[#ccff00] rounded-full"></div>
                            </div>
                        </div>

                        {/* 4 Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 text-black dark:text-white transition-colors">

                            {/* Col 1: Brand */}
                            <div className="lg:col-span-4">
                                <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter mb-6">
                                    <div className="w-5 h-5 bg-[#ccff00] transform -skew-x-12" />
                                    <div className="w-2 h-5 bg-[#171717] dark:bg-white transform -skew-x-12 -ml-2 transition-colors" />
                                    <span>WEINIX</span>
                                </div>
                                <p className="text-sm max-w-[280px] leading-relaxed mb-8 opacity-60 text-gray-800 dark:text-gray-300 transition-colors">
                                    We are a multidisciplinary architecture studio crafting bold, purposeful spaces that stand the test of time.
                                </p>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#ccff00] hover:text-black transition-colors">
                                        <span className="font-serif font-bold text-sm">f</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#ccff00] hover:text-black transition-colors">
                                        <span className="font-bold text-xs uppercase tracking-widest">in</span>
                                    </a>
                                </div>
                            </div>

                            {/* Col 2: Nav Items */}
                            <div className="lg:col-span-2">
                                <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Nav Item</h4>
                                <ul className="space-y-4 text-sm opacity-60 text-gray-800 dark:text-gray-300 transition-colors">
                                    <li><a href="#" className="hover:text-[#ccff00] hover:opacity-100 transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-[#ccff00] hover:opacity-100 transition-colors">Our Architect</a></li>
                                    <li><a href="#" className="hover:text-[#ccff00] hover:opacity-100 transition-colors">Process</a></li>
                                </ul>
                            </div>

                            {/* Col 3: Contact */}
                            <div className="lg:col-span-3">
                                <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Contact</h4>
                                <ul className="space-y-4 text-sm opacity-60 text-gray-800 dark:text-gray-300 transition-colors">
                                    <li className="flex gap-3">
                                        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        <a href="mailto:hello@axiombuild.com" className="hover:text-[#ccff00] hover:opacity-100 transition-colors">hello@axiombuild.com</a>
                                    </li>
                                    <li className="flex gap-3">
                                        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        <span>+1 (123) 985 789</span>
                                    </li>
                                    <li className="flex justify-start gap-3">
                                        {/* Simple Map Pin Icon */}
                                        <svg className="w-4 h-4 mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        <span>213 West Orchard Street<br />Kings Mountain, NC 28086</span>
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
                            <p>© 2024 WEINIX. All Rights Reserved.</p>

                            {/* Theme Toggle Pill (Moved from right side to bottom bar for space) */}
                            <div className="flex items-center justify-center rounded-[#2rem] p-1.5 shadow-inner   mt-4 md:mt-0 transition-colors">
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
                        <div className="mt-16 flex items-center justify-center gap-8 opacity-60 hover:opacity-100 transition-opacity cursor-pointer text-black dark:text-[#a0a0a0]">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-10 bg-[#ccff00] transform -skew-x-12" />
                                <div className="w-5 h-10 bg-[#171717] dark:bg-white transform -skew-x-12 -ml-2 transition-colors" />
                            </div>
                            <span className="text-8xl font-medium tracking-wide bg-clip-text text-transparent bg-gradient-to-b from-black to-black/60 dark:from-[#cfcfcf] dark:to-[#555]">
                                WEINIX
                            </span>
                        </div>
                    </div>
                </footer>

                <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            </div>
        </div>
    );
}
