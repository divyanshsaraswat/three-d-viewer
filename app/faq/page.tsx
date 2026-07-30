"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronDown, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const faqs = [
    {
        q: "What is WEINIX?",
        a: "WEINIX is focused on transforming textile waste into sustainable and innovative building materials. By giving discarded textiles a new purpose, WEINIX supports a more circular approach to material use and helps create solutions for the construction and design industries.",
    },
    {
        q: "What are WEINIX building materials made from?",
        a: "WEINIX materials are made using recycled textile waste. The process gives discarded textile materials a new life by transforming them into useful and sustainable material solutions for various applications.",
    },
    {
        q: "How does WEINIX help reduce textile waste?",
        a: "WEINIX helps address the growing challenge of textile waste by diverting discarded textiles from traditional waste streams and transforming them into useful building materials. This approach supports resource recovery and promotes a more circular use of materials.",
    },
    {
        q: "What types of materials does WEINIX produce?",
        a: "WEINIX develops recycled textile-based material solutions, including panels, sheets and brick-style materials. These solutions are designed to provide practical alternatives for applications across construction, architecture and interior design.",
    },
    {
        q: "Where can WEINIX recycled materials be used?",
        a: "WEINIX recycled materials can be considered for a range of applications across interior and exterior spaces, including architectural, construction and design projects. The suitability of a specific material depends on the requirements of the individual project.",
    },
    {
        q: "Can WEINIX materials be used for interior applications?",
        a: "Yes. WEINIX recycled textile-based materials can be used in suitable interior applications where sustainable and visually distinctive material solutions are required.",
    },
    {
        q: "Can WEINIX materials be used for exterior applications?",
        a: "WEINIX develops material solutions for both interior and exterior applications. The suitability of a particular product for an exterior project depends on the specific application and project requirements.",
    },
    {
        q: "How do recycled textile materials support sustainable construction?",
        a: "Using recycled textile waste as a material resource helps reduce reliance on virgin resources and gives discarded materials a new purpose. WEINIX's approach supports sustainable construction by connecting waste recovery with the development of useful building materials.",
    },
    {
        q: "What is the connection between WEINIX and the circular economy?",
        a: "WEINIX follows circular economy principles by transforming textile waste into new material products rather than treating it only as waste. This approach aims to keep materials in use for longer and create value from resources that might otherwise be discarded.",
    },
    {
        q: "Why choose recycled textile-based building materials?",
        a: "Recycled textile-based materials offer an opportunity to combine material innovation with sustainability. They can help projects incorporate waste-derived materials while supporting broader goals around resource efficiency and circular design.",
    },
    {
        q: "Are WEINIX materials suitable for construction and architectural projects?",
        a: "WEINIX materials are developed with applications in construction, architecture and design in mind. The right material solution depends on the specific needs, intended use and requirements of each project.",
    },
    {
        q: "How can I enquire about WEINIX materials or solutions?",
        a: "If you are interested in WEINIX materials, recycled textile-based building solutions or potential project applications, you can contact the WEINIX team through the website to discuss your requirements and explore suitable solutions.",
    },
];

export default function FaqPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo('.faq-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
            .fromTo('.faq-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.6")
            .fromTo('.faq-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

        const sections = gsap.utils.toArray('.faq-animate') as HTMLElement[];
        sections.forEach((section: HTMLElement) => {
            gsap.set(section, { opacity: 0, y: 40 });
            gsap.to(section, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: section, start: "top 88%" },
            });
        });
    }, { scope: containerRef });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((item) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": { "@type": "Answer", "text": item.a },
        })),
    };

    return (
        <main ref={containerRef} className="relative min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] pt-[18vh] pb-32 overflow-hidden font-sans text-black dark:text-white transition-colors duration-500">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Background ambient glows */}
            <div className="absolute top-[-15%] left-[-10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.06)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.04)_0%,transparent_60%)] pointer-events-none" />

            {/* HERO */}
            <section className="relative w-full max-w-[1000px] mx-auto flex flex-col items-center text-center px-4 md:px-8 mb-20 z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] sm:w-full min-w-[400px] max-w-[600px] aspect-square -z-10 pointer-events-none opacity-40 dark:opacity-20 blur-[100px] saturate-200">
                    <div className="absolute top-[15%] left-[20%] w-[50%] h-[50%] bg-[#ccff00] rounded-full mix-blend-multiply dark:mix-blend-screen animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                    <div className="absolute bottom-[15%] right-[20%] w-[50%] h-[50%] bg-[#88aa00] rounded-full mix-blend-multiply dark:mix-blend-screen animate-[pulse_5s_cubic-bezier(0.4,0,0.6,1)_infinite]" style={{ animationDelay: '1s' }} />
                </div>

                <span className="faq-badge bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/20 font-semibold tracking-widest text-[10px] sm:text-xs px-6 py-2 rounded-full uppercase mb-8">
                    FAQ
                </span>

                <h1 className="faq-title text-4xl sm:text-5xl md:text-[4rem] font-black leading-[1.05] tracking-tighter uppercase mb-6">
                    Frequently Asked Questions
                </h1>

                <p className="faq-subtitle text-sm md:text-base font-medium tracking-wide text-black/60 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
                    Have questions about WEINIX and our recycled textile-based building materials? Explore our FAQs to learn more about our materials, applications, and approach to textile waste recycling — from recycled panels and sheets to brick-style building solutions.
                </p>
            </section>

            {/* ACCORDION */}
            <section className="px-4 md:px-8 max-w-[900px] mx-auto relative z-10 faq-animate">
                <div className="space-y-3">
                    {faqs.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div
                                key={i}
                                className="bg-white/90 dark:bg-[#111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-2xl overflow-hidden transition-colors"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 cursor-pointer"
                                >
                                    <span className="flex items-baseline gap-3 text-[15px] md:text-base font-bold tracking-tight">
                                        <span className="text-[#8aab00] dark:text-[#ccff00] font-mono text-xs shrink-0">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        {item.q}
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        className={`shrink-0 text-black/40 dark:text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#8aab00] dark:text-[#ccff00]' : ''}`}
                                    />
                                </button>
                                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-5 pl-[3.25rem] text-[13px] md:text-sm text-black/60 dark:text-white/50 leading-relaxed font-medium">
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="px-4 md:px-8 max-w-[900px] mx-auto mt-24 relative z-10 faq-animate">
                <div className="bg-[#ccff00] text-black rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all duration-700">
                    <div className="absolute top-0 left-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise-lines.png")' }} />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[1] mb-6">
                            Have More Questions?
                        </h2>
                        <p className="font-semibold text-black/70 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-8">
                            If you&apos;re interested in WEINIX materials or exploring solutions for a specific project, get in touch to discuss your requirements.
                        </p>
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center gap-2 bg-black text-[#ccff00] font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:scale-[1.03] transition-transform shadow-xl"
                        >
                            <Mail size={14} />
                            Contact Us
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
