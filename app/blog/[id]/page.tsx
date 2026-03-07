"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import BlurImage from '@/components/BlurImage';
import { notFound } from 'next/navigation';
import { MessageCircle, Heart, Bookmark, Share, PlayCircle } from 'lucide-react';
import Link from 'next/link';
// @ts-ignore
import { use } from 'react';

const fullPostsData: Record<string, any> = {
    "circular-economy-shift": {
        title: "The Shift to a Circular Fashion Economy: A Complete Beginner's Guide",
        subtitle: "Everything you wanted to know but were afraid to ask.",
        author: {
            name: "Laksh Sharma",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
            readTime: "16 min read",
            date: "Mar 23, 2025"
        },
        stats: { likes: "6.3K", comments: "116" },
        image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2000",
    },
    "industrial-recovery-methods": {
        title: "Industrial Material Recovery: Thermal vs Mechanical Processing",
        subtitle: "How we maintain fiber integrity while scaling post-consumer waste operations globally.",
        author: {
            name: "Deep Patel",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
            readTime: "24 min read",
            date: "Sep 28, 2025"
        },
        stats: { likes: "12.1K", comments: "342" },
        image: "https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?auto=format&fit=crop&q=80&w=2000",
    },
    // Adding generic fallbacks
    "sustainable-materials": {
        title: "Building the Infrastructure for Tomorrow's Materials",
        subtitle: "Why we aren't a charity. The economics of operating a massive material recovery engine.",
        author: {
            name: "Laksh Sharma",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
            readTime: "9 min read",
            date: "Sep 15, 2025"
        },
        stats: { likes: "4.8K", comments: "89" },
        image: "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&q=80&w=2000",
    },
    "design-without-waste": {
        title: "Designing Products Without the Concept of Waste",
        subtitle: "A framework for creating apparel that fundamentally flows back into raw commodity streams.",
        author: {
            name: "Deep Patel",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
            readTime: "12 min read",
            date: "Sep 02, 2025"
        },
        stats: { likes: "8.2K", comments: "210" },
        image: "https://images.unsplash.com/photo-1529369623266-f5264b696110?auto=format&fit=crop&q=80&w=2000",
    }
};

export default function BlogPost({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    // Unwrapping params safely
    const unwrappedParams = typeof params === 'object' && 'then' in params ? use(params) : params;
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    const id = unwrappedParams.id;
    const post = fullPostsData[id];
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo('.anim-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" })
          .fromTo('.anim-hero-img', { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "-=0.4")
          .fromTo('.anim-content', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.6");
    }, { scope: containerRef });

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center text-black dark:text-white bg-white dark:bg-[#050505]">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Post not found</h1>
                    <Link href="/blog" className="underline hover:text-[#ccff00]">Return to Blog</Link>
                </div>
            </div>
        );
    }

    return (
        <main ref={containerRef} className="relative min-h-[100dvh] pt-[15vh] md:pt-[20vh] pb-32 font-sans transition-colors duration-500 text-[#242424] dark:text-white bg-white dark:bg-[#050505]">
            <article className="max-w-[720px] mx-auto px-4 md:px-0">
                
                {/* Title & Subtitle */}
                <div className="mb-10 anim-header">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/10 rounded-md text-xs font-semibold mb-6 border border-black/10 dark:border-white/10">
                        <span className="text-[#ccff00] text-sm leading-none">✦</span> Member-only story
                    </div>
                    
                    <h1 className="text-4xl md:text-[46px] leading-[1.15] font-black tracking-tight mb-4 text-black dark:text-white">
                        {post.title}
                    </h1>
                    
                    {/* Highlighted Subtitle (Medium Style Background) */}
                    <div className="inline-block relative mb-8 lg:mb-12">
                        <div className="absolute inset-0 bg-[#e7f5e9] dark:bg-[#e7f5e9]/10 rounded-sm -z-10 -mx-1 -my-0.5"></div>
                        <h2 className="textxl md:text-[22px] text-[#2f4f4f] dark:text-[#a0c0c0] font-normal leading-snug">
                            {post.subtitle}
                        </h2>
                    </div>
                    
                    {/* Author Byline block */}
                    <div className="flex items-center justify-between mb-8 cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                                <BlurImage src={post.author.avatar!} alt={post.author.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-black dark:text-white group-hover:underline decoration-1 underline-offset-2">{post.author.name}</span>
                                    <span className="text-[#1a8917] dark:text-[#ccff00] bg-[#1a8917]/10 dark:bg-[#ccff00]/10 border border-[#1a8917]/20 dark:border-[#ccff00]/30 px-3 py-0.5 rounded-full text-xs font-medium transition-colors hover:bg-[#1a8917]/20 dark:hover:bg-[#ccff00]/20">Follow</span>
                                </div>
                                <div className="flex items-center gap-2 text-[13px] text-black/60 dark:text-white/50 mt-1">
                                    <span>{post.author.readTime}</span>
                                    <span>·</span>
                                    <span>{post.author.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar (Medium stats strip) */}
                    <div className="flex items-center justify-between py-3 md:py-4 border-t border-b border-black/10 dark:border-white/10 mb-12">
                        <div className="flex items-center gap-6 text-black/60 dark:text-white/60">
                            <button className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors group">
                                <Heart size={18} className="group-hover:fill-black/10 dark:group-hover:fill-white/10" /> 
                                <span className="text-sm font-medium">{post.stats.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors">
                                <MessageCircle size={18} /> 
                                <span className="text-sm font-medium">{post.stats.comments}</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-5 text-black/60 dark:text-white/60">
                            <button className="hover:text-black dark:hover:text-white transition-colors"><Bookmark size={20} /></button>
                            <button className="hover:text-black dark:hover:text-white transition-colors"><PlayCircle size={20} /></button>
                            <button className="hover:text-black dark:hover:text-white transition-colors"><Share size={18} /></button>
                        </div>
                    </div>
                </div>

            </article>

            {/* Expansive Hero Image that breaks out slightly */}
            <div className="max-w-[720px] mx-auto px-4 md:px-0 mb-16 anim-hero-img">
                <div className="w-full aspect-[21/9] md:aspect-[16/8] bg-gray-100 dark:bg-[#111] overflow-hidden rounded-[1rem] md:rounded-[2rem] shadow-sm">
                    <BlurImage 
                        src={post.image} 
                        alt="Featured hero" 
                        className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-[2s]"
                    />
                </div>
                <p className="text-center text-xs text-black/50 dark:text-white/50 mt-4 font-medium">Photo acquired directly from the Weinix processing facilities.</p>
            </div>

            {/* Article Content Block */}
            <article className="max-w-[720px] mx-auto px-4 md:px-0 anim-content">
                <div className="prose prose-lg dark:prose-invert prose-p:text-[20px] prose-p:leading-[1.6] prose-p:text-[#242424] dark:prose-p:text-[#e0e0e0] prose-p:font-normal prose-h2:text-[32px] prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-a:text-[#1a8917] dark:prose-a:text-[#ccff00] prose-li:text-[19px] max-w-none">
                    <p>
                        Every year, millions of tonnes of clothing are discarded—shoved into landfills, burned in dumping yards, or left to leach microplastics into soil and groundwater. The fashion industry is one of the largest contributors to industrial waste globally, yet the materials locked inside discarded garments—cotton fibers, polyester threads, blended textiles—retain enormous recoverable value.
                    </p>
                    <p>
                        <strong>Weinix exists to unlock that value.</strong> As we scale our thermal press and mechanical shredding methodologies across continents, the definition of a &quot;primary commodity&quot; begins to blur. Why pull virgin materials from the earth when millions of tonnes of premium fibers are sitting exactly where we left them?
                    </p>
                    <h2>The infrastructure for tomorrow</h2>
                    <p>
                        We are not a charity. We are infrastructure. This distinction is vital because it shifts the framing of the conversation from &quot;ethical consumption&quot; to &quot;industrial viability.&quot; Operations of our scale demand financial frameworks that rival traditional manufacturing pipelines—otherwise, the system collapses beneath its own weight.
                    </p>
                    <blockquote>
                        &quot;When the end of a product's life is decided at its inception, we can engineer garments that flow seamlessly back into our raw material stream.&quot;
                    </blockquote>
                    <p>
                        Post-consumer clothing waste procured through the logistics network flows into Weinix processing hubs, where it is subjected to a proprietary purification cycle. Zippers are melted. Natural fibers are chemically decoupled from synthetics. Colors are entirely stripped back to baseline white via massive-scale optical bleaching systems. 
                    </p>
                    <p>
                        What leaves the facility is not recycled clothing—it is fresh, virgin-equivalent thread, completely unassailable in its structural integrity.
                    </p>
                </div>
                
                {/* Bottom Topic Footer Tags */}
                <div className="flex flex-wrap gap-2 mt-16 mb-20 pt-10 border-t border-black/10 dark:border-white/10">
                    {["Circular Economy", "Industrial Design", "Sustainability", "Materials", "Supply Chain"].map((tag, i) => (
                        <span key={i} className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-sm font-medium transition-colors cursor-pointer text-black/70 dark:text-white/70">
                            {tag}
                        </span>
                    ))}
                </div>
            </article>

        </main>
    );
}
