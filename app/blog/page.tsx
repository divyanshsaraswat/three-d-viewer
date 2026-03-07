"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import BlurImage from '@/components/BlurImage';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
    {
        id: "circular-economy-shift",
        title: "The Shift to a Circular Fashion Economy",
        excerpt: "How do we create systems that close the loop on apparel waste and impress upon the industry that secondary commodities are the future? Look no further.",
        author: "Laksh Sharma",
        date: "12 Oct 2025",
        image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200",
    },
    {
        id: "industrial-recovery-methods",
        title: "Best practices in industrial material recovery",
        excerpt: "This deep dive into our thermal press and mechanical shredding methodologies shows how we maintain integrity while scaling post-consumer waste operations.",
        author: "Deep Patel",
        date: "28 Sep 2025",
        image: "https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?auto=format&fit=crop&q=80&w=1200",
    },
    {
        id: "sustainable-materials",
        title: "Building the infrastructure for tomorrow",
        excerpt: "Why we aren't a charity. A look into the economics of operating a massive material recovery engine that rivals traditional first-use manufacturing plants.",
        author: "Laksh Sharma",
        date: "15 Sep 2025",
        image: "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&q=80&w=1200",
    },
    {
        id: "design-without-waste",
        title: "Designing products without the concept of waste",
        excerpt: "When the end of a product's life is decided at its inception, we can engineer garments that flow seamlessly back into our raw material stream.",
        author: "Deep Patel",
        date: "02 Sep 2025",
        image: "https://images.unsplash.com/photo-1529369623266-f5264b696110?auto=format&fit=crop&q=80&w=1200",
    }
];

export default function BlogPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.1 });
        
        // Header animation
        tl.fromTo('.blog-header-elem', 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
        );

        // Grid cards animation
        const cards = gsap.utils.toArray('.blog-card') as HTMLElement[];
        gsap.fromTo(cards, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1.2, 
                ease: "power3.out",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: ".blog-grid",
                    start: "top 85%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="relative min-h-[100dvh] pt-[15vh] pb-32 overflow-hidden font-sans transition-colors duration-500 text-black dark:text-white bg-white dark:bg-[#050505]">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
                    <div className="flex-1 max-w-xl">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-8 blog-header-elem text-black dark:text-white">
                            Weinix Journal
                        </h1>
                        
                        {/* Newsletter Subscribe */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md blog-header-elem">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="flex-1 bg-transparent border border-black/20 dark:border-white/20 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-black/50 dark:focus:border-[#ccff00] transition-colors"
                            />
                            <button className="bg-black dark:bg-[#ccff00] text-white dark:text-black font-semibold rounded-full px-8 py-3.5 text-sm hover:scale-[1.03] transition-transform active:scale-95 shadow-md">
                                Subscribe
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 md:max-w-sm blog-header-elem">
                        <p className="text-black/60 dark:text-white/60 text-lg md:text-xl font-medium leading-relaxed">
                            New facility features, the latest in recovery technology, industry solutions, and updates.
                        </p>
                    </div>
                </div>

                <div className="w-full h-px bg-black/10 dark:bg-white/10 mb-16 blog-header-elem"></div>

                {/* BLOG GRID */}
                <div className="blog-grid grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                    {blogPosts.map((post) => (
                        <Link href={`/blog/${post.id}`} key={post.id} className="blog-card group cursor-pointer flex flex-col block">
                            {/* Image Container with Frosted Overlay */}
                            <div className="relative w-full aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-6 bg-gray-100 dark:bg-[#111] shadow-sm">
                                <BlurImage 
                                    src={post.image} 
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                                />
                                
                                {/* Frosted Glass Author Overlay */}
                                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/90 to-white/0 dark:from-black/90 dark:to-black/0 backdrop-blur-[2px] z-10 flex items-end justify-between px-6 md:px-8 pb-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <div>
                                        <p className="font-bold text-sm text-black dark:text-white">{post.author}</p>
                                        <p className="font-medium text-[11px] text-black/70 dark:text-white/70">{post.date}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-black/50 backdrop-blur-md flex items-center justify-center border border-black/10 dark:border-white/10 shadow-sm">
                                        <ArrowUpRight size={14} className="text-black dark:text-[#ccff00]" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex flex-col px-2">
                                <h2 className="text-2xl font-bold tracking-tight mb-3 text-black dark:text-white group-hover:underline decoration-2 underline-offset-4 decoration-black/20 dark:decoration-white/20 transition-all">
                                    {post.title}
                                </h2>
                                <p className="text-black/60 dark:text-white/60 text-sm md:text-base font-medium leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                
                                <div className="flex items-center gap-2 font-bold text-sm text-black dark:text-white mt-auto hover:text-black/70 dark:hover:text-[#ccff00] transition-colors w-max">
                                    Read post <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </main>
    );
}
