"use client";

import React, { useRef, useState, useEffect, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import BlurImage from '@/components/BlurImage';
import { ArrowUpRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

const POSTS_PER_PAGE = 10;

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
        author: "Divyansh Saraswat",
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

function BlogContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const { trackEvent } = useAnalytics();

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        trackEvent('newsletter_subscribe_clicked', { email_provided: !!email });
        if (!email) {
            setStatus('error');
            setMessage('Email is required');
            return;
        }

        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Thank you for subscribing!');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to connect to the server');
        }

        // Reset status after 5 seconds
        setTimeout(() => {
            if (status !== 'loading') {
                setStatus('idle');
                setMessage('');
            }
        }, 5000);
    };

    const currentPage = Number(searchParams.get('page') || '1');
    const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set('page', page.toString());
        router.push(`/blog?${params.toString()}`);
        
        // Scroll smoothly to top of blog grid
        const gridElement = document.querySelector('.blog-grid');
        if (gridElement) {
            const yOffset = -150;
            const y = gridElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const paginatedPosts = blogPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

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
    }, { scope: containerRef, dependencies: [currentPage] });

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
                        <div className="w-full max-w-md blog-header-elem">
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-transparent border border-black/20 dark:border-white/20 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-black/50 dark:focus:border-[#ccff00] transition-colors text-black dark:text-white"
                                    required
                                />
                                <button 
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="bg-black dark:bg-[#ccff00] text-white dark:text-black font-semibold rounded-full px-8 py-3.5 text-sm hover:scale-[1.03] transition-transform active:scale-95 shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 'Subscribe'}
                                </button>
                            </form>
                            
                            {/* Status Message */}
                            {message && (
                                <div className={`mt-3 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-1 ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {status === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                    {message}
                                </div>
                            )}
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
                    {paginatedPosts.map((post) => (
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

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-20">
                        {/* Prev Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-sm font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer active:scale-95 ${
                                currentPage === 1 ? 'opacity-30 pointer-events-none' : 'hover:border-black/30 dark:hover:border-white/30 text-black dark:text-white'
                            }`}
                            title="Previous Page"
                        >
                            ←
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNum = index + 1;
                            const isActive = pageNum === currentPage;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer active:scale-95 ${
                                        isActive
                                            ? 'bg-black dark:bg-[#ccff00] text-white dark:text-black shadow-md shadow-black/10 dark:shadow-[#ccff00]/10 border border-transparent'
                                            : 'border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-sm font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer active:scale-95 ${
                                currentPage === totalPages ? 'opacity-30 pointer-events-none' : 'hover:border-black/30 dark:hover:border-white/30 text-black dark:text-white'
                            }`}
                            title="Next Page"
                        >
                            →
                        </button>
                    </div>
                )}

            </div>
        </main>
    );
}

export default function BlogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505] text-black dark:text-white font-mono text-sm">
                Loading journal...
            </div>
        }>
            <BlogContent />
        </Suspense>
    );
}
