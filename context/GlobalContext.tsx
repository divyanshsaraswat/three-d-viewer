"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface GlobalContextType {
    hasEntered: boolean;
    setHasEntered: (v: boolean) => void;
    isMuted: boolean;
    setIsMuted: (v: boolean) => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (v: boolean) => void;
    theme: 'system' | 'light' | 'dark';
    setTheme: (v: 'system' | 'light' | 'dark') => void;
    isDarkMode: boolean;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    isScrolled: boolean;
    isAuthModalOpen: boolean;
    setIsAuthModalOpen: (v: boolean) => void;
    user: { mobileNumber: string; firstName?: string; lastName?: string; email?: string } | null;
    setUser: (user: { mobileNumber: string; firstName?: string; lastName?: string; email?: string } | null) => void;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export function useGlobalContext() {
    const ctx = useContext(GlobalContext);
    if (!ctx) throw new Error("useGlobalContext must be used within GlobalProvider");
    return ctx;
}

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [hasEntered, setHasEntered] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<{ mobileNumber: string; firstName?: string; lastName?: string; email?: string } | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (theme === 'system') {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            setIsDarkMode(mq.matches);
            const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
            mq.addEventListener('change', listener);
            return () => mq.removeEventListener('change', listener);
        } else {
            setIsDarkMode(theme === 'dark');
        }
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 150);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <GlobalContext.Provider value={{
            hasEntered, setHasEntered,
            isMuted, setIsMuted,
            isMenuOpen, setIsMenuOpen,
            theme, setTheme,
            isDarkMode,
            audioRef,
            isScrolled,
            isAuthModalOpen, setIsAuthModalOpen,
            user, setUser,
        }}>
            <div className={isDarkMode ? 'dark' : ''}>
                {children}
            </div>
        </GlobalContext.Provider>
    );
}
