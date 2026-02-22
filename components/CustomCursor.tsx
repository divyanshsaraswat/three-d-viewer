"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorCircleRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only run on desktop/devices with fine pointer
        if (window.matchMedia("(pointer: coarse)").matches) return;

        // Ensure body has the class to hide default cursor
        document.body.classList.add('custom-cursor-active');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        // Initial setup for quick set
        if (cursorDotRef.current) gsap.set(cursorDotRef.current, { x: mouseX, y: mouseY });
        if (cursorCircleRef.current) gsap.set(cursorCircleRef.current, { x: mouseX, y: mouseY });

        const moveCursor = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);

            // wrappers are translated by GSAP
            if (cursorDotRef.current) {
                gsap.to(cursorDotRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    ease: "power2.out"
                });
            }

            if (cursorCircleRef.current) {
                gsap.to(cursorCircleRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.5,
                    ease: "power3.out"
                });
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over standard clickable elements
            const isClickable = target.closest('a, button, input, [role="button"], .cursor-pointer');
            setIsHovering(!!isClickable);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsVisible(false); // Hide when leaving window
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            document.body.classList.remove('custom-cursor-active');
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isVisible]);

    // Render nothing on mobile
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    return (
        <div className="hidden md:block pointer-events-none z-[10000]" style={{ opacity: isVisible ? 1 : 0 }}>
            {/* Outer Circle Wrapper (GSAP positions this) */}
            <div ref={cursorCircleRef} className="fixed top-0 left-0 pointer-events-none z-[10000]">
                {/* Visual Element (Tailwind scales this) */}
                <div
                    className={`w-10 h-10 border-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center ${isHovering ? 'scale-[1.8] bg-black/20 border-black/50 dark:bg-[#ccff00]/60 dark:border-[#ccff00]/60' : 'scale-100 border-black dark:border-[#ccff00]'
                        } ${isClicking ? 'scale-[0.8] border-transparent bg-black/40 dark:bg-[#ccff00]/80' : ''
                        }`}
                ></div>
            </div>

            {/* Inner Dot Wrapper (GSAP positions this) */}
            <div ref={cursorDotRef} className="fixed top-0 left-0 pointer-events-none z-[10000]">
                {/* Visual Element (Tailwind scales this) */}
                <div
                    className={`w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out bg-black dark:bg-[#ccff00] ${isHovering ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                        }`}
                ></div>
            </div>
        </div>
    );
}
