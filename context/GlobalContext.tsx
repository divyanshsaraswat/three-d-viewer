"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface GlobalContextType {
    hasEntered: boolean;
    setHasEntered: (v: boolean) => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (v: boolean) => void;
    theme: 'system' | 'light' | 'dark';
    setTheme: (v: 'system' | 'light' | 'dark') => void;
    isDarkMode: boolean;
    isScrolled: boolean;
    isAuthModalOpen: boolean;
    setIsAuthModalOpen: (v: boolean) => void;
    user?: any; // Marked optional or removed, keeping definition out of context completely. Let's simplify entirely without it.
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export function useGlobalContext() {
    const ctx = useContext(GlobalContext);
    if (!ctx) throw new Error("useGlobalContext must be used within GlobalProvider");
    return ctx;
}

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [hasEntered, setHasEntered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
            isMenuOpen, setIsMenuOpen,
            theme, setTheme,
            isDarkMode,
            isScrolled,
            isAuthModalOpen, setIsAuthModalOpen,
        }}>
            <div className={isDarkMode ? 'dark' : ''}>
                {children}
            </div>
        </GlobalContext.Provider>
    );
}
