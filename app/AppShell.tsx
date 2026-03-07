"use client";

import React from 'react';
import GlobalProvider, { useGlobalContext } from '@/context/GlobalContext';
import GlobalNav from '@/components/GlobalNav';
import GlobalFooter from '@/components/GlobalFooter';
import FullScreenMenu from '@/components/FullScreenMenu';
import CustomCursor from '@/components/CustomCursor';
import { usePathname } from 'next/navigation';

function AppShellInner({ children }: { children: React.ReactNode }) {
    const { hasEntered, isMuted, setIsMuted, audioRef, isMenuOpen, setIsMenuOpen } = useGlobalContext();
    const pathname = usePathname();

    // Pages where we show the landing-style layout (nav + footer)
    const isLandingStyle = pathname === '/landing' || pathname === '/about-us';

    return (
        <>
            {/* ---------- BACKGROUND AUDIO ---------- */}
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

            <CustomCursor />

            {isLandingStyle && <GlobalNav />}

            <div className="bg-[#f5f5f5] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] min-h-screen overflow-hidden font-sans transition-colors duration-500">
                {children}

                {isLandingStyle && <GlobalFooter />}
            </div>

            <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <GlobalProvider>
            <AppShellInner>{children}</AppShellInner>
        </GlobalProvider>
    );
}
