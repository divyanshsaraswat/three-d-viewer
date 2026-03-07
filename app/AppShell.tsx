"use client";

import React from 'react';
import GlobalProvider, { useGlobalContext } from '@/context/GlobalContext';
import GlobalNav from '@/components/GlobalNav';
import GlobalFooter from '@/components/GlobalFooter';
import FullScreenMenu from '@/components/FullScreenMenu';
import CustomCursor from '@/components/CustomCursor';
import { usePathname } from 'next/navigation';

function AppShellInner({ children }: { children: React.ReactNode }) {
    const { hasEntered, isMenuOpen, setIsMenuOpen } = useGlobalContext();
    const pathname = usePathname();

    // Pages where we show the landing-style layout (nav + footer)
    const isLandingStyle = pathname === '/home' || pathname === '/about-us' || pathname.startsWith('/products') || pathname.startsWith('/blog');

    return (
        <>

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
