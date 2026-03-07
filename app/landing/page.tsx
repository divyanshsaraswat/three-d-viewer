"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ArrowUpRight, Play, Star, ArrowDown } from 'lucide-react';

import ProductCarousel from '@/components/ProductCarousel';
import BlurImage from '@/components/BlurImage';
import { useRouter } from 'next/navigation';
import ScrollRevealText from '@/components/ScrollRevealText';
import SpecializationCarousel from '@/components/SpecializationCarousel';
import TestimonialVideo from '@/components/TestimonialVideo';
import { useGlobalContext } from '@/context/GlobalContext';

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
        <h2 ref={numRef} className="text-6xl font-bold text-black dark:text-white transition-transform transition-colors drop-shadow-sm leading-none m-0">
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

const AnimatedCO2Card = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const numRef = useRef<HTMLSpanElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const counter = { val: 0 };
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        tl.to(counter, {
            val: 3,
            duration: 2,
            ease: "power3.out",
            onUpdate: () => {
                if (numRef.current) {
                    numRef.current.innerText = counter.val.toFixed(1);
                }
            }
        }, 0);

        tl.fromTo(progressRef.current,
            { width: "0%" },
            { width: "66%", duration: 2, ease: "power3.out" },
            0
        );
    }, []);

    return (
        <div ref={cardRef} className="absolute left-6 bottom-1/3 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 p-3 rounded-2xl flex items-center gap-3 transition-all duration-500 delay-100 group hover:-translate-y-2 active:scale-[0.98]">
            <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center text-black overflow-hidden relative">
                <ArrowUpRight size={16} className="absolute transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-x-6 group-hover:-translate-y-6 group-active:translate-x-6 group-active:-translate-y-6" />
                <ArrowUpRight size={16} className="absolute transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] -translate-x-6 translate-y-6 group-hover:translate-x-0 group-hover:translate-y-0 group-active:translate-x-0 group-active:translate-y-0" />
            </div>
            <div>
                <p className="text-black dark:text-white font-bold text-sm transition-colors">
                    <span ref={numRef}>0.0</span> kg CO2
                </p>
                <div className="w-16 h-1 bg-black/20 dark:bg-white/30 rounded-full mt-1 overflow-hidden">
                    <div ref={progressRef} className="h-full bg-[#ccff00] rounded-full w-0"></div>
                </div>
            </div>
        </div>
    );
};

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayContainerRef = useRef<HTMLDivElement>(null);
    const overlayBgRef = useRef<HTMLDivElement>(null);
    
    const [activeAccordion, setActiveAccordion] = useState<number>(0);
    const [hasScrolledTable, setHasScrolledTable] = useState(false);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    
    const [mediaProgress, setMediaProgress] = useState(0);
    const [isAllMediaLoaded, setIsAllMediaLoaded] = useState(false);

    const { hasEntered, setHasEntered, isMuted, setIsMuted, audioRef } = useGlobalContext();

    useEffect(() => {
        if (hasEntered) {
            setIsAllMediaLoaded(true);
            setMediaProgress(100);
            return;
        }

        const imgElements = Array.from(document.querySelectorAll('img'));
        const videoElements = Array.from(document.querySelectorAll('video'));
        const totalMedia = imgElements.length + videoElements.length;

        if (totalMedia === 0) {
            setIsAllMediaLoaded(true);
            setMediaProgress(100);
            return;
        }

        let loadedCount = 0;
        const mediaPromises: Promise<void>[] = [];

        imgElements.forEach((img) => {
            const src = img.getAttribute('src');
            if (src) {
                mediaPromises.push(new Promise<void>((resolve) => {
                    const preloader = new Image();
                    preloader.src = src;
                    if (preloader.complete) {
                        resolve();
                    } else {
                        preloader.onload = () => resolve();
                        preloader.onerror = () => resolve();
                    }
                }));
            } else {
                mediaPromises.push(Promise.resolve());
            }
        });

        videoElements.forEach((vid) => {
            mediaPromises.push(new Promise<void>((resolve) => {
                if (vid.readyState >= 3) {
                    resolve();
                } else {
                    const onLoaded = () => resolve();
                    vid.addEventListener('canplaythrough', onLoaded, { once: true });
                    vid.addEventListener('error', onLoaded, { once: true });
                    setTimeout(onLoaded, 5000);
                }
            }));
        });

        mediaPromises.forEach(p => p.then(() => {
            loadedCount++;
            setMediaProgress(Math.floor((loadedCount / totalMedia) * 100));
        }));

        Promise.all(mediaPromises).then(() => {
            setIsAllMediaLoaded(true);
            setMediaProgress(100);
        });
    }, [hasEntered]);

    const handleEnter = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
        
        if (overlayContainerRef.current && overlayBgRef.current) {
            const tl = gsap.timeline({
                onComplete: () => setHasEntered(true)
            });
            tl.to(overlayBgRef.current, { yPercent: -100, duration: 0.8, ease: "expo.inOut" })
              .to(overlayContainerRef.current, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.65")
              .set(overlayContainerRef.current, { display: "none" });
        } else {
            setHasEntered(true);
        }
    };
    const router = useRouter();

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

    useGSAP(() => {

        // Hero entry animation
        const heroTl = gsap.timeline({ delay: 1.5 });
        heroTl.fromTo('.hero-bg-video',
            { scale: 1.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
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

        // Section reveal animations — use opacity + transform only (no autoAlpha/y) to avoid CLS
        const sections = gsap.utils.toArray('.animate-section') as HTMLElement[];
        sections.forEach((section: HTMLElement) => {
            gsap.set(section, { opacity: 0, yPercent: 5 });
            gsap.to(section, {
                opacity: 1,
                yPercent: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                }
            });
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
        <div ref={containerRef}>
                {/* ---------- FIRST VISIT: Enter Experience Overlay ---------- */}
                {!hasEntered && (
                    <div
                        ref={overlayContainerRef}
                        className="fixed inset-0 z-[250] bg-[#ccff00] flex flex-col items-center justify-center"
                    >
                        <div ref={overlayBgRef} className="absolute inset-0 bg-[#0a0a0a]" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="text-white text-3xl md:text-5xl font-bold tracking-tighter flex items-center gap-4 mb-8">
                                <div className="w-8 h-8 bg-[#ccff00] transform rotate-45 rounded-sm" />
                                <span>WEINIX</span>
                            </div>
                            
                            <div className="text-[#ccff00] text-sm font-mono mb-6 tracking-widest uppercase h-4">
                                {!isAllMediaLoaded ? `Loading Assets... ${mediaProgress}%` : ''}
                            </div>

                            <button
                                onClick={handleEnter}
                                disabled={!isAllMediaLoaded}
                                className={`text-white border border-white/30 px-8 py-3 rounded-full uppercase tracking-widest text-sm font-bold text-center transition-all duration-300 ${isAllMediaLoaded ? 'hover:bg-white hover:text-black cursor-pointer animate-pulse' : 'opacity-50 cursor-wait'}`}
                            >
                                {isAllMediaLoaded ? 'Enter Experience' : 'Preparing Experience...'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ---------- BACKGROUND AUDIO (Landing Page Only) ---------- */}
                <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

                {/* ---------- AUDIO TOGGLE ---------- */}
                {hasEntered && (
                    <button
                        onClick={() => {
                            if (audioRef.current) {
                                audioRef.current.muted = !isMuted;
                                setIsMuted(!isMuted);
                            }
                        }}
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

                <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#e0e1e5]/10 dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-500">

                    {/* Background Video */}
                    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center bg-black select-none">
                        <video
                            key="hero-video"
                            className="hero-bg-video w-full h-full object-cover opacity-90 pointer-events-none select-none"
                            autoPlay
                            loop
                            muted
                            playsInline
                            // @ts-ignore - webkit-specific attribute
                            webkit-playsinline="true"
                            x-webkit-airplay="deny"
                            disablePictureInPicture
                            disableRemotePlayback
                            controls={false}
                            tabIndex={-1}
                            preload="auto"
                            style={{ pointerEvents: 'none' }}
                            onCanPlayThrough={() => setIsVideoLoaded(true)}
                            onLoadedData={() => setIsVideoLoaded(true)}
                        >
                            <source src="hero-section 2.webm" type="video/webm" />
                            <source src="hero-section-2.mp4" type="video/mp4" />
                        </video>
                        {/* Invisible layer to physically block ALL interactions on the video */}
                        <div className="absolute inset-0 z-10 w-full h-full" style={{ touchAction: 'none' }} onContextMenu={(e) => e.preventDefault()}></div>
                        {/* Radial Gradient overlay focused on center */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,transparent_70%)] z-[2] pointer-events-none"></div>
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
                                onClick={() => window.location.assign('/editor')}
                                className="bg-[#ccff00] text-black font-semibold tracking-wide text-xs md:text-sm px-6 py-3 rounded-[20px] shadow-[0_8px_30px_rgba(204,255,0,0.2)] hover:scale-[1.03] transition-transform duration-300 w-full sm:w-auto border border-[#ccff00]">
                                Experience in 3D
                            </button>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-white dark:to-[#0a0a0a] pointer-events-none"></div>

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
                <div className="w-full bg-[#ccff00] py-4 md:py-6 transform -rotate-3 scale-110 my-12 overflow-hidden flex whitespace-nowrap z-20 relative border-y-[3px] border-black drop-shadow-lg" style={{ contain: "content" }}>
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
                        <div className="md:col-span-1 md:row-span-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-center group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-all duration-500 active:scale-[0.98]">
                            <div className="flex items-end gap-2 mb-2">
                                <h3 className="text-4xl font-bold text-black dark:text-white group-hover:text-[#ccff00] group-active:text-[#ccff00] transition-colors duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]">Pure</h3>
                                <span className="text-sm pb-1 text-[#ccff00]">Fibers</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">Mechanical shredding breaks fabrics back to their core. Ready for rebirth.</p>
                        </div>

                        {/* Stage 3 pt2 (Top Mid-R) */}
                        <div className="md:col-span-1 md:row-span-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-end items-end text-right group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-all duration-500 active:scale-[0.98] relative overflow-hidden">
                            <div className="absolute -top-8 -left-8 w-48 h-48 opacity-40 group-hover:opacity-60 group-active:opacity-60 group-hover:scale-110 group-active:scale-110 group-hover:rotate-12 group-active:rotate-12 transition-all duration-[800ms] ease-[cubic-bezier(0.87,0,0.13,1)] pointer-events-none">
                                <BlurImage src="mesh.png" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="relative z-10 w-full flex flex-col items-end justify-end">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors">No Chemicals</p>
                                <h3 className="text-5xl font-bold text-black dark:text-white mb-1 group-hover:scale-105 group-active:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] origin-right">0%</h3>
                                <p className="text-[#e78b1f] text-sm font-bold">Dyes used</p>
                            </div>
                        </div>

                        {/* Stage 2 (Top Right) */}
                        <div className="md:col-span-1 md:row-span-2 bg-white dark:bg-[#222222] border border-gray-100 dark:border-transparent transition-colors duration-500 rounded-[2rem] p-8 flex flex-col justify-between group cursor-pointer">
                            <div>
                                <h3 className="text-lg font-bold text-black dark:text-white mb-6 leading-snug transition-colors">Every piece is sorted by hand. Quality matters, even in waste.</h3>
                                <div className="flex -space-x-3 mb-8">
                                    <BlurImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                    <BlurImage src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
                                    <BlurImage src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full border-2 border-white dark:border-[#222222] grayscale group-hover:grayscale-0 transition-all object-cover" />
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

                        {/* Stage 1 (Center Big) — hidden on mobile to prevent overlap */}
                        <div className="hidden md:block md:col-span-2 md:row-span-2 rounded-[2rem] relative p-0 overflow-visible group cursor-pointer active:scale-[0.99] transition-transform duration-500 mt-0">
                            {/* Inner clipping context for background/overlay */}
                            <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 dark:from-[#0a0a0a] dark:via-[#111111]/40 to-transparent transition-colors duration-500 z-10"></div>
                            </div>

                            {/* Outer pop-out image */}
                            <div className="absolute inset-x-0 bottom-0 top-[-15%] z-10 flex items-end justify-center pointer-events-none">
                                <BlurImage src="centre.webp" className="w-[110%] h-[110%] max-w-none object-contain object-bottom opacity-100 origin-bottom transition-transform duration-1400 ease-[cubic-bezier(0.87,0,0.13,1)] drop-shadow-2xl" alt="Collection" />
                            </div>

                            {/* Ensure interactive elements sit above the image */}
                            <div className="relative z-20 w-full h-full pointer-events-none">
                                <div className="pointer-events-auto w-full h-full">
                                    <AnimatedCO2Card />

                                    <div className="absolute right-6 bottom-1/4 bg-white/80 dark:bg-[#1a1a1a] backdrop-blur-md border border-black/10 dark:border-white/10 p-5 rounded-2xl text-black dark:text-white group-hover:-translate-y-2 group-active:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] delay-200">
                                        <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center absolute top-3 right-3 text-[#ccff00] text-xs transition-colors">♥</div>
                                        <h3 className="text-2xl font-bold mb-1">1 kg</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 transition-colors">Collected Textiles</p>
                                        <p className="text-[#22c55e] text-xs font-bold flex items-center gap-1">▲ Prevented</p>
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6 z-10">
                                        <span className="bg-[#ccff00] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Our Customers</span>
                                        <p className="text-black dark:text-white text-base md:text-lg font-medium leading-snug w-full md:w-3/4 transition-colors">
                                            &quot;It starts with you. Old clothes, worn linens, forgotten fabrics—we collect them before they reach the landfill.&quot;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stage 5 (Bottom Left) */}
                        <div className="md:col-span-1 md:row-span-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col items-center group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-all duration-500 active:scale-[0.98]">
                            <div className="bg-[#ccff00] text-black text-xl font-bold rounded-2xl p-4 text-center w-full mb-6">
                                Ancient Craft <br /> + Sustainability
                            </div>
                            <div className="relative w-full h-40 mb-6 flex justify-center items-center">
                                <div className="absolute w-24 h-32 -rotate-12 group-hover:rotate-0 group-active:rotate-0 transition-transform duration-[800ms] ease-[cubic-bezier(0.87,0,0.13,1)]">
                                    <BlurImage src="weaving-1.webp" className="w-full h-full rounded-[1rem] object-cover" alt="Weaving 1" />
                                </div>
                                <div className="absolute w-24 h-32 rotate-12 mt-8 ml-8 group-hover:rotate-0 group-active:rotate-0 transition-all duration-[800ms] ease-[cubic-bezier(0.87,0,0.13,1)] delay-75">
                                    <BlurImage src="weaving-2.webp" className="w-full h-full rounded-[1rem] object-cover border-2 border-white dark:border-[#1a1a1a]" alt="Weaving 2" />
                                </div>
                            </div>
                            <p className="text-black dark:text-white text-center text-sm font-medium leading-relaxed mt-4 transition-colors">
                                Traditional looms weave rescued fibers into premium sheets. Each takes 4 hours, touching 12 pairs of skilled hands.
                            </p>
                        </div>

                        {/* Stage 6 pt1 (Middle Right - CUBO equivalent) */}
                        <div className="md:col-span-1 md:row-span-1 bg-white dark:bg-[#222222] border border-gray-100 dark:border-transparent transition-all duration-500 rounded-[2rem] flex flex-col items-center justify-center p-6 group cursor-pointer overflow-hidden relative active:scale-[0.98]">
                            <div className="w-16 h-16 border-4 border-black/10 dark:border-white/20 rounded-full flex items-center justify-center relative mb-4 group-hover:scale-110 group-active:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]">
                                <div className="w-6 h-6 border-4 border-[#ccff00] rounded-full absolute -top-2"></div>
                                <div className="w-6 h-6 border-4 border-black dark:border-white rounded-full absolute -bottom-1 -left-1 transition-colors"></div>
                                <div className="w-6 h-6 border-4 border-[#e78b1f] rounded-full absolute -bottom-1 -right-1"></div>
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white tracking-widest transition-colors">OEKO-TEX®</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Certified</p>
                        </div>

                        {/* Stage 6 pt2 (Bottom Mid-L - Color Swatches equivalent) */}
                        <div className="md:col-span-1 md:row-span-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-between group cursor-pointer hover:border-black/10 dark:hover:border-white/10 transition-all duration-500 active:scale-[0.98]">
                            <div>
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-1 transition-colors">300 TC</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest transition-colors">Quality Note</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-[#222222] group-hover:bg-white group-active:bg-white transition-colors duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] delay-0"></div>
                                <div className="w-10 h-10 rounded-xl bg-gray-300 dark:bg-[#333333] group-hover:bg-[#ccff00] group-active:bg-[#ccff00] transition-colors duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] delay-75"></div>
                                <div className="w-10 h-10 rounded-xl bg-gray-400 dark:bg-[#444444] group-hover:bg-[#e78b1f] group-active:bg-[#e78b1f] transition-colors duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] delay-150"></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 font-medium transition-colors">Softer than conventional cotton.</p>
                        </div>

                        {/* Stage 6 pt3 (Bottom Right - We Build Future equivalent) */}
                        <div className="md:col-span-2 md:row-span-1 bg-[#ccff00] rounded-[2rem] p-8 flex items-center justify-between group cursor-pointer overflow-hidden relative active:scale-[0.98] transition-transform duration-500">
                            <div className="z-10 relative">
                                <h2 className="text-3xl md:text-5xl font-bold text-black mb-2 leading-none tracking-tighter">Waste,<br />Reimagined.</h2>
                                <p className="text-black/80 text-sm font-semibold max-w-[200px] mt-4">Every sheet passes 7 quality checks before reaching you.</p>
                            </div>
                            <div className="absolute -right-10 -top-10 text-black/10 group-hover:scale-105 group-active:scale-105 group-hover:rotate-6 group-active:rotate-6 transition-all duration-[800ms] ease-[cubic-bezier(0.87,0,0.13,1)]">
                                <BlurImage src="spring.png" alt="Interactive placeholder" className="w-[240px] h-[240px] rounded-[3rem] object-cover opacity-100" />
                            </div>
                        </div>

                    </div>
                </section>

                {/* ---------- OUR SPECIALIZATION ---------- */}
                <SpecializationCarousel />

                {/* ---------- PRODUCT SHOWCASE (3D CAROUSEL) ---------- */}
                <ProductCarousel />

                {/* ---------- SELECTED WORKS (VIDEO BLOCK) ---------- */}
                {/* <section className="py-32 px-4 md:px-8 bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-500">
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
                                <BlurImage src="https://images.unsplash.com/photo-1574519659052-780c7a523aee?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Building Video" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/50 dark:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-[#ccff00] group-hover:text-black transition-colors pl-1">
                                        <Play size={24} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-[40%] h-[400px] rounded-3xl overflow-hidden relative">
                                <BlurImage src="https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Building Detail" />
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* ---------- GENERAL PURPOSE BUILDINGS ---------- */}
                <section className="py-32 px-4 md:px-8 max-w-[1200px] mx-auto relative animate-section text-black dark:text-white transition-colors duration-500">
                    <div className="flex flex-col md:flex-row h-[600px] gap-8 relative z-0">
                        <div className="w-full md:w-1/2 h-full rounded-3xl overflow-hidden bg-[#007090]">
                            <BlurImage src="https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-overlay opacity-80" alt="White Architecture" />
                        </div>
                        <div className="w-full md:w-1/2 h-full pt-32">
                            <div className="w-full h-[80%] rounded-3xl overflow-hidden">
                                <BlurImage src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Steel Architecture" />
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
                            <div className={`md:hidden absolute inset-y-0 right-0 z-10 w-24 flex items-center justify-end pr-4 pointer-events-none bg-gradient-to-l from-gray-100/90 dark:from-black via-gray-100/50 dark:via-black/40 to-transparent transition-opacity duration-500 ${!hasScrolledTable ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="flex flex-col items-center gap-2 text-black/70 dark:text-white drop-shadow-md pb-4 transition-colors">
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
                                        <BlurImage src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Avatar" />
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
            </div>
    );
}
