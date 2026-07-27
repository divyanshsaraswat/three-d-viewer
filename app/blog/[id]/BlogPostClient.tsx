"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import BlurImage from '@/components/BlurImage';
import { MessageCircle, Heart, Bookmark, Share, PlayCircle, Link2, Instagram } from 'lucide-react';
import Link from 'next/link';
import type { Heading } from '@/lib/sanity/richText';

export interface BlogPostData {
    title: string;
    subtitle: string;
    category?: string;
    metaTitle?: string;
    metaDescription?: string;
    image: string;
    imageAlt?: string;
    imageCaption?: string;
    tags: string[];
    bodyHtml: string;
    headings: Heading[];
    author: {
        name: string;
        designation: string;
        avatar: string;
        readTime: string;
        published: string;
        updated: string | null;
        linkedin: string;
        twitter: string;
    };
}

const BOOKMARKS_KEY = "weinix_bookmarks";

interface Bookmark {
    id: string;
    title: string;
    image: string;
    url: string;
    bookmarkedAt: string;
}

export default function BlogPostClient({
    post,
    prevId,
    nextId,
    id,
}: {
    post: BlogPostData;
    prevId: string | null;
    nextId: string | null;
    id: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sections = post.headings;

    const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
    const [progress, setProgress] = useState(0);
    const [isCopied, setIsCopied] = useState(false);
    const [isTocOpen, setIsTocOpen] = useState(false);
    const [showFloatingToc, setShowFloatingToc] = useState(false);
    const [isBottomVisible, setIsBottomVisible] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const navButtonsRef = useRef<HTMLDivElement>(null);
    const isBottomVisibleRef = useRef(false);

    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title: post.title, text: post.subtitle, url: window.location.href });
            } catch {
                // user cancelled the share sheet, nothing to do
            }
        } else {
            handleCopyLink();
        }
    };

    useEffect(() => {
        try {
            const stored: Bookmark[] = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
            setIsBookmarked(stored.some((b) => b.id === id));
        } catch {
            // ignore malformed localStorage data
        }
    }, [id]);

    const handleToggleBookmark = () => {
        try {
            const stored: Bookmark[] = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
            const exists = stored.some((b) => b.id === id);
            const next = exists
                ? stored.filter((b) => b.id !== id)
                : [...stored, { id, title: post.title, image: post.image, url: `/blog/${id}`, bookmarkedAt: new Date().toISOString() }];
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
            setIsBookmarked(!exists);
        } catch {
            // ignore write failures (e.g. private browsing storage limits)
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isFooter = entry.target.tagName === 'FOOTER';
                    const isNavButtons = entry.target === navButtonsRef.current;

                    if (isFooter || isNavButtons) {
                        if (entry.isIntersecting) {
                            isBottomVisibleRef.current = true;
                            setIsBottomVisible(true);
                            setShowFloatingToc(false);
                        } else {
                            // Check if either is still intersecting
                            const footer = document.querySelector('footer');
                            const nav = navButtonsRef.current;
                            const isFooterIntersecting = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
                            const isNavIntersecting = nav ? nav.getBoundingClientRect().top < window.innerHeight : false;

                            const visible = isFooterIntersecting || isNavIntersecting;
                            isBottomVisibleRef.current = visible;
                            setIsBottomVisible(visible);
                            if (!visible) {
                                const scrollY = window.scrollY;
                                setShowFloatingToc(scrollY > 400);
                            }
                        }
                    }
                });
            },
            {
                root: null,
                threshold: 0.01,
            }
        );

        if (navButtonsRef.current) {
            observer.observe(navButtonsRef.current);
        }

        const footer = document.querySelector('footer');
        if (footer) {
            observer.observe(footer);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const scrolled = (scrollY / totalHeight) * 100;
                const roundedScrolled = Math.min(100, Math.max(0, Math.round(scrolled)));
                setProgress(roundedScrolled);

                // Show if scrolled more than 400px and the bottom navigation block / footer is not visible
                setShowFloatingToc(scrollY > 400 && !isBottomVisibleRef.current);
            } else {
                setShowFloatingToc(false);
            }

            // Active heading = whichever crossed the reading line most recently
            // (largest top still <= the line), not just the last one found while
            // walking the list — robust even if one entry reports a stray rect.
            // The line sits 45% down the viewport (not a thin sliver near the
            // top) so a heading counts as "reached" as soon as it's comfortably
            // on screen, matching how a reader actually experiences the section.
            // Looked up fresh every call (not cached) — a cached reference can
            // silently go stale/detached if the article subtree is ever
            // replaced, which then reports an all-zero rect for every heading.
            const readingLine = window.innerHeight * 0.45;
            let current: string | null = null;
            let currentTop = -Infinity;
            for (const sec of sections) {
                const el = document.getElementById(sec.id);
                if (!el) continue;
                const top = el.getBoundingClientRect().top;
                if (top <= readingLine && top > currentTop) {
                    current = el.id;
                    currentTop = top;
                }
            }
            if (current) setActiveId(current);
        };

        window.addEventListener("scroll", handleScroll);

        // Article body comes from Sanity — its final height isn't knowable at a
        // fixed moment after mount (embedded images, fonts, and content length
        // all vary per post and can keep reflowing after paint). A ResizeObserver
        // on the page recomputes positions every time the layout actually
        // settles, instead of trusting one guessed-timing snapshot.
        const resizeObserver = new ResizeObserver(() => handleScroll());
        resizeObserver.observe(document.body);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            resizeObserver.disconnect();
        };
    }, [sections]);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const yOffset = -120;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo('.anim-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" })
          .fromTo('.anim-hero-img', { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "-=0.4")
          .fromTo('.anim-content', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.6");
    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="relative min-h-[100dvh] pt-[15vh] md:pt-[20vh] pb-32 font-sans transition-colors duration-500 text-[#242424] dark:text-white bg-white dark:bg-[#050505]">

            {/* Top progress bar for mobile/tablet/desktop (positioned above the z-[100] sticky navbar) */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5 z-[101] pointer-events-none">
                <div
                    className="h-full bg-[#1a8917] dark:bg-[#ccff00] transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="max-w-[1100px] mx-auto px-4 md:px-8 xl:px-0 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 relative">

                {/* Sticky Sidebar Table of Contents (positioned under the sticky navbar) */}
                <aside className="hidden lg:block sticky top-[140px] self-start space-y-6">
                    <div className="text-[11px] font-bold tracking-widest text-black/40 dark:text-white/40 uppercase mb-4 font-mono">
                        On This Page
                    </div>

                    <div className="relative border-l border-black/10 dark:border-white/10 pl-5 space-y-3.5">
                        {sections.map((section) => {
                            const isActive = activeId === section.id;
                            return (
                                <div
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`group relative py-0.5 text-[13px] leading-relaxed transition-all duration-300 cursor-pointer ${
                                        isActive
                                            ? 'text-[#1a8917] dark:text-[#ccff00] font-semibold'
                                            : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute -left-[22px] top-0 bottom-0 w-[2px] bg-[#1a8917] dark:bg-[#ccff00]" />
                                    )}
                                    <span className="font-mono text-[11px] mr-3 opacity-60">{section.num}</span>
                                    <span className="tracking-tight">{section.title}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Reading Progress */}
                    <div className="border-t border-dashed border-black/10 dark:border-white/10 pt-4 mt-6">
                        <span className="font-mono text-[11px] text-black/50 dark:text-white/50">
                            {progress}% read
                        </span>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="w-full min-w-0">
                    <article className="max-w-[720px] mx-auto lg:mx-0">

                        {/* Mobile Table of Contents Trigger Strip */}
                        <div className="lg:hidden mb-8 anim-header">
                            <button
                                onClick={() => setIsTocOpen(true)}
                                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl text-left transition-all active:scale-[0.98] group cursor-pointer"
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="shrink-0 text-black/60 dark:text-white/60 text-xs font-bold tracking-widest uppercase font-mono">
                                        On This Page
                                    </span>
                                    <span className="min-w-0 truncate text-[10px] text-[#1a8917] dark:text-[#ccff00] bg-[#1a8917]/10 dark:bg-[#ccff00]/10 border border-[#1a8917]/20 dark:border-[#ccff00]/30 px-2 py-0.5 rounded font-mono leading-none">
                                        {activeId.toUpperCase().replace(/-/g, ' ')}
                                    </span>
                                </div>
                                <span className="shrink-0 text-xs font-bold text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white font-mono flex items-center gap-1.5">
                                    Outline <span>➔</span>
                                </span>
                            </button>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="mb-10 anim-header">
                            {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/10 rounded-md text-xs font-semibold mb-6 border border-black/10 dark:border-white/10">
                                <span className="text-[#ccff00] text-sm leading-none">✦</span> Member-only story
                            </div> */}

                            <h1 className="text-4xl md:text-[46px] leading-[1.15] font-black tracking-tight mb-4 text-black dark:text-white">
                                {post.title}
                            </h1>

                            {/* Highlighted Subtitle */}
                            {post.subtitle && (
                                <div className="inline-block relative mb-8 lg:mb-12">
                                    <div className="absolute inset-0 bg-[#e7f5e9] dark:bg-[#e7f5e9]/10 rounded-sm -z-10 -mx-1 -my-0.5"></div>
                                    <h2 className="text-xl md:text-[22px] text-[#2f4f4f] dark:text-[#a0c0c0] font-normal leading-snug">
                                        {post.subtitle}
                                    </h2>
                                </div>
                            )}

                            {/* Author Byline Block */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">

                                {/* Author Info (Left) */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                                        <BlurImage src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-black dark:text-white text-base leading-tight">
                                            {post.author.name}
                                        </span>
                                        <span className="text-[12px] font-medium text-black/50 dark:text-white/40 mt-1">
                                            {post.author.designation}
                                        </span>
                                    </div>
                                </div>

                                {/* Dates and Read Time (Right) */}
                                <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-xs md:text-sm font-medium pt-1">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-black/40 dark:text-white/30 font-mono text-[10px] uppercase tracking-wider">Published</span>
                                        <span className="text-black/80 dark:text-white/80">{post.author.published}</span>
                                    </div>
                                    {post.author.updated && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-black/40 dark:text-white/30 font-mono text-[10px] uppercase tracking-wider">Updated</span>
                                            <span className="text-black/80 dark:text-white/80">{post.author.updated}</span>
                                        </div>
                                    )}
                                    <div className="text-black/80 dark:text-white/80 font-semibold font-mono text-xs">
                                        {post.author.readTime}
                                    </div>
                                </div>

                            </div>

                            {/* Share and Action Utility Bar */}
                            <div className="flex items-center justify-between py-3.5 border-t border-b border-black/10 dark:border-white/10 mb-12">

                                {/* Left Side: Social sharing links */}
                                <div className="flex items-center gap-3">
                                    {/* Copy Link Button */}
                                    <div className="relative">
                                        <button
                                            onClick={handleCopyLink}
                                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                                                isCopied
                                                    ? 'border-[#1a8917] dark:border-[#ccff00] text-[#1a8917] dark:text-[#ccff00] bg-[#1a8917]/5 dark:bg-[#ccff00]/5 scale-105'
                                                    : 'border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
                                            }`}
                                            title={isCopied ? "Link copied!" : "Copy story link"}
                                        >
                                            <Link2 size={15} />
                                        </button>
                                        <div
                                            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-md bg-black dark:bg-white text-white dark:text-black text-[11px] font-semibold whitespace-nowrap transition-all duration-200 pointer-events-none ${
                                                isCopied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                                            }`}
                                        >
                                            Copied
                                        </div>
                                    </div>
                                    {/* LinkedIn Link */}
                                    {post.author.linkedin && (
                                        <a
                                            href={post.author.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all font-mono text-xs font-bold leading-none cursor-pointer"
                                            title="LinkedIn Profile"
                                        >
                                            in
                                        </a>
                                    )}
                                    {/* Twitter/X Link */}
                                    {post.author.twitter && (
                                        <a
                                            href={post.author.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all font-serif text-sm font-bold leading-none cursor-pointer"
                                            title="X Profile"
                                        >
                                            𝕏
                                        </a>
                                    )}
                                    {/* Instagram Link (site-wide, not per-author in Sanity) */}
                                    <a
                                        href="https://www.instagram.com/weinix.in"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all cursor-pointer"
                                        title="Instagram"
                                    >
                                        <Instagram size={15} />
                                    </a>
                                </div>

                                {/* Right Side: Page utility options */}
                                <div className="flex items-center gap-5 text-black/60 dark:text-white/60">
                                    <button
                                        onClick={handleToggleBookmark}
                                        className={`transition-colors cursor-pointer ${isBookmarked ? 'text-[#1a8917] dark:text-[#ccff00]' : 'hover:text-black dark:hover:text-white'}`}
                                        title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                                    >
                                        <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                                        title="Share"
                                    >
                                        <Share size={18} />
                                    </button>
                                </div>

                            </div>
                        </div>

                    </article>

                    {/* Expansive Hero Image */}
                    <div className="max-w-[720px] mx-auto lg:mx-0 mb-16 anim-hero-img">
                        <div className="w-full aspect-[21/9] md:aspect-[16/8] bg-gray-100 dark:bg-[#111] overflow-hidden rounded-[1rem] md:rounded-[2rem] shadow-sm">
                            <BlurImage
                                src={post.image}
                                alt={post.imageAlt || post.title}
                                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-[2s]"
                            />
                        </div>
                        {post.imageCaption && (
                            <p className="text-center text-xs text-black/50 dark:text-white/50 mt-4 font-medium">{post.imageCaption}</p>
                        )}
                    </div>

                    {/* Article Content Block */}
                    <article className="max-w-[720px] mx-auto lg:mx-0 anim-content">
                        <div
                            className="prose prose-lg dark:prose-invert prose-p:text-[20px] prose-p:leading-[1.6] prose-p:text-[#242424] dark:prose-p:text-[#e0e0e0] prose-p:font-normal prose-h1:text-[32px] prose-h1:font-bold prose-h2:text-[32px] prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h3:mt-10 prose-h3:mb-4 prose-h4:text-[14px] prose-h4:uppercase prose-h4:tracking-wider prose-h4:font-bold prose-h4:mt-8 prose-h4:mb-3 prose-a:text-[#1a8917] dark:prose-a:text-[#ccff00] prose-li:text-[19px] prose-blockquote:border-l-[#1a8917] dark:prose-blockquote:border-l-[#ccff00] prose-blockquote:not-italic prose-code:text-[#1a8917] dark:prose-code:text-[#ccff00] prose-code:before:content-none prose-code:after:content-none [&_h5]:text-[13px] [&_h5]:uppercase [&_h5]:tracking-wide [&_h5]:font-semibold [&_h5]:mt-6 [&_h5]:mb-2 [&_h5]:text-black/70 dark:[&_h5]:text-white/70 [&_h6]:text-[13px] [&_h6]:italic [&_h6]:font-semibold [&_h6]:mt-6 [&_h6]:mb-2 [&_h6]:text-black/60 dark:[&_h6]:text-white/60 max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
                        />

                        {/* Bottom Topic Footer Tags */}
                        {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-16 mb-20 pt-10 border-t border-black/10 dark:border-white/10">
                                {post.tags.map((tag, i) => (
                                    <span key={i} className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-sm font-medium transition-colors cursor-pointer text-black/70 dark:text-white/70">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Article Navigation Buttons */}
                        <div ref={navButtonsRef} className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-black/10 dark:border-white/10">
                            {/* Back to Journal */}
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 text-sm font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white cursor-pointer active:scale-95"
                            >
                                ← Back to Journal
                            </Link>

                            {/* Previous & Next Articles */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href={prevId ? `/blog/${prevId}` : '#'}
                                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-black/10 dark:border-white/10 text-sm font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white cursor-pointer active:scale-95 ${
                                        !prevId ? 'opacity-30 pointer-events-none' : 'hover:border-black/30 dark:hover:border-white/30'
                                    }`}
                                >
                                    ← Previous Article
                                </Link>
                                <Link
                                    href={nextId ? `/blog/${nextId}` : '#'}
                                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-black/10 dark:border-white/10 text-sm font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white cursor-pointer active:scale-95 ${
                                        !nextId ? 'opacity-30 pointer-events-none' : 'hover:border-black/30 dark:hover:border-white/30'
                                    }`}
                                >
                                    Next Article →
                                </Link>
                            </div>
                        </div>
                    </article>
                </div>
            </div>

            {/* Mobile Table of Contents Drawer Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] transition-opacity duration-300 lg:hidden ${
                    isTocOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsTocOpen(false)}
            />

            {/* Mobile Table of Contents Drawer Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-[#0a0a0a] border-l border-black/10 dark:border-white/10 z-[160] shadow-2xl p-6 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] transform lg:hidden flex flex-col justify-between ${
                    isTocOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5 dark:border-white/5">
                        <span className="text-xs font-bold tracking-widest text-black/50 dark:text-white/40 uppercase font-mono">
                            On This Page
                        </span>
                        <button
                            onClick={() => setIsTocOpen(false)}
                            className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white font-mono text-xs uppercase cursor-pointer"
                        >
                            Close
                        </button>
                    </div>

                    <div className="space-y-5">
                        {sections.map((section) => {
                            const isActive = activeId === section.id;
                            return (
                                <div
                                    key={section.id}
                                    onClick={() => {
                                        scrollToSection(section.id);
                                        setIsTocOpen(false);
                                    }}
                                    className={`flex items-start gap-4 cursor-pointer text-xs font-bold uppercase tracking-wider transition-all py-1.5 ${
                                        isActive
                                            ? 'text-[#1a8917] dark:text-[#ccff00] border-l-2 border-[#1a8917] dark:border-[#ccff00] pl-3'
                                            : 'text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white pl-3.5'
                                    }`}
                                >
                                    <span className="font-mono opacity-60 text-[10px]">{section.num}</span>
                                    <span className="tracking-tight">{section.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reading Progress */}
                <div className="border-t border-black/10 dark:border-white/10 pt-6 mt-6 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-black/40 dark:text-white/40 font-mono uppercase">Progress</span>
                    <span className="font-mono text-xs font-bold text-black dark:text-[#ccff00]">
                        {progress}% read
                    </span>
                </div>
            </div>

            {/* Mobile Floating Table of Contents Trigger */}
            <div
                className={`fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:w-[400px] md:-translate-x-1/2 z-[140] lg:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showFloatingToc
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
            >
                <button
                    onClick={() => setIsTocOpen(true)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-3 bg-[#111]/95 backdrop-blur-md border border-white/10 rounded-full text-left transition-all active:scale-[0.98] group cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.3)] animate-fade-in"
                >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="shrink-0 text-white/50 text-[10px] font-bold tracking-widest uppercase font-mono">
                            On This Page
                        </span>
                        <span className="min-w-0 truncate text-[10px] text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/25 px-2 py-0.5 rounded font-mono leading-none">
                            {activeId.toUpperCase().replace(/-/g, ' ')}
                        </span>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-white/80 group-hover:text-[#ccff00] font-mono flex items-center gap-1.5 transition-colors">
                        Outline <span className="group-hover:translate-x-0.5 transition-transform">➔</span>
                    </span>
                </button>
            </div>

        </main>
    );
}
