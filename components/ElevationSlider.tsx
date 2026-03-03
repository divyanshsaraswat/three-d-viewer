'use client';
import { useRef, useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function ElevationSlider() {
    const models = useStore(state => state.models);
    const tourHeight = useStore(state => state.settings.tourHeight);
    const updateSetting = useStore(state => state.updateSetting);

    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    // Only show for the villa
    if (!models.length || models[0].id !== 'modern-villa') {
        return null; // Do not render for other models
    }

    const MIN = 0.2;
    const MAX = 100.0;

    const percentage = Math.max(0, Math.min(100, ((tourHeight - MIN) / (MAX - MIN)) * 100));

    const handleMove = (clientY: number) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        // For vertical, 0% is at the bottom, 100% is at the top.
        let topPer = (clientY - rect.top) / rect.height;
        topPer = Math.max(0, Math.min(1, topPer));
        const val = MIN + (1 - topPer) * (MAX - MIN);
        updateSetting('tourHeight', val);
    };

    const onPointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        handleMove(e.clientY);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (isDragging) {
            handleMove(e.clientY);
        }
    };

    const onPointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    return (
        <div className="absolute bottom-24 left-6 md:bottom-28 md:left-8 z-50 flex flex-col items-center h-48 pointer-events-auto">
            {/* Track */}
            <div
                ref={trackRef}
                className="w-1.5 h-full bg-[#333] rounded-full cursor-pointer relative touch-none shadow-inner"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                {/* Fill */}
                <div
                    className="absolute bottom-0 w-full bg-[#6b4ca6] rounded-full pointer-events-none"
                    style={{ height: `${percentage}%` }}
                />

                {/* Thumb & Tooltip Container */}
                <div
                    className="absolute w-[18px] h-[18px] bg-[#6b4ca6] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.5)] left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none"
                    style={{ bottom: `${percentage}%` }}
                >
                    {/* Tooltip Map Pin */}
                    <div className="absolute bottom-[22px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none drop-shadow-md">
                        <div className="bg-[#6b4ca6] text-white text-[12px] font-bold py-1 px-2.5 rounded-full whitespace-nowrap flex items-center justify-center min-w-[32px] min-h-[26px]">
                            {Math.round(tourHeight)}
                        </div>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#6b4ca6] -mt-[1px]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
