'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export default function Joystick() {
    const baseRef = useRef<HTMLDivElement>(null);
    const stickRef = useRef<HTMLDivElement>(null);
    const setJoystickInput = useStore(state => state.setJoystickInput);

    const isDragging = useRef(false);

    const updateStick = (clientX: number, clientY: number) => {
        if (!baseRef.current || !stickRef.current) return;

        const rect = baseRef.current.getBoundingClientRect();
        const maxRadius = rect.width / 2 - 18; // Dynamically fit within the base circle
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = clientX - centerX;
        let dy = clientY - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > maxRadius) {
            dx = (dx / distance) * maxRadius;
            dy = (dy / distance) * maxRadius;
        }

        // Move the visual stick
        stickRef.current.style.transform = `translate(${dx}px, ${dy}px)`;

        // Normalize to [-1, 1] and send to store
        // We invert Y so that 'up' is negative Y visually, but often translates to positive fwd.
        // Actually, let's just send true visual vector. 
        // Y negative = up visually. X positive = right visually.
        setJoystickInput(dx / maxRadius, dy / maxRadius);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        updateStick(e.clientX, e.clientY);
        baseRef.current?.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        updateStick(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        if (stickRef.current) {
            stickRef.current.style.transition = 'transform 0.1s ease-out';
            stickRef.current.style.transform = `translate(0px, 0px)`;
            // Remove the transition immediately after it finishes so movement is responsive again
            setTimeout(() => {
                if (stickRef.current) stickRef.current.style.transition = '';
            }, 100);
        }
        setJoystickInput(0, 0);
        baseRef.current?.releasePointerCapture(e.pointerId);
    };

    return (
        <div
            className="z-40"
            // Prevent default touch actions like scrolling while interacting with the joystick
            style={{ touchAction: 'none' }}
        >
            {/* Joystick Base */}
            <div
                ref={baseRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border border-white/10 flex items-center justify-center relative touch-none select-none" style={{ backgroundColor: 'rgba(18,18,18,0.8)', backdropFilter: 'blur(12px)' }}
            >
                {/* Joystick Nub */}
                <div
                    ref={stickRef}
                    className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full shadow-lg pointer-events-none" style={{ backgroundColor: 'rgba(204,255,0,0.5)' }}
                />
            </div>
        </div>
    );
}
