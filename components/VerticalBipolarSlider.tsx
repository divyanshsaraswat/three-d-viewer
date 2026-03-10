'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

const VerticalBipolarSlider = () => {
    // We get the actual camera height configuration from the game engine store
    const models = useStore(state => state.models);
    const isModelLoading = useStore(state => state.isModelLoading);
    const tourHeight = useStore(state => state.settings.tourHeight);
    const updateSetting = useStore(state => state.updateSetting);

    // Track the local value representing the slide head
    const [value, setValue] = useState(tourHeight);

    // Ensure state syncs if the height gets updated by a preset/reload
    useEffect(() => {
        setValue(tourHeight);
    }, [tourHeight]);

    // Keyboard shortcuts for Z (up) and X (down)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            const step = 4.0;
            if (e.key.toLowerCase() === 'z') {
                const newValue = Math.min(140.0, value + step); // Hardcoded MAX temporarily for scope
                setValue(newValue);
                updateSetting('tourHeight', newValue);
            } else if (e.key.toLowerCase() === 'x') {
                const newValue = Math.max(-140.0, value - step); // Hardcoded MIN temporarily for scope
                setValue(newValue);
                updateSetting('tourHeight', newValue);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [value, updateSetting]);

    // Only render the component if the modern-villa is actively loaded and finished loading
    if (isModelLoading || !models.length || models[0].id !== 'modern-villa') {
        return null;
    }

    // The Villa model is scaled massively, so +/- 100 units only moves it a few feet visually.
    // Upping the scale to +/- 800 units allows full roof and basement coverage.
    const MIN = -140.0;
    const MAX = 140.0;

    // This function runs every time you drag the slider up or down
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numValue = parseFloat(event.target.value);
        setValue(numValue);
        // Dispatch the change instantly to the 3D Orbit Camera
        updateSetting('tourHeight', numValue);
    };

    // To prevent the player from accidentally rotating the 3D camera while dragging the slider
    const blockEvent = (e: any) => {
        e.stopPropagation();
        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
            e.nativeEvent.stopImmediatePropagation();
        }
    };

    return (
        <div
            className="absolute bottom-[6rem] left-6 md:bottom-[7rem] md:left-8 z-[9000] flex flex-col items-center pointer-events-auto"
            style={{
                backgroundColor: 'rgba(18,18,18,0.85)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '16px 10px',
                fontFamily: 'sans-serif',
                color: 'white'
            }}
            onPointerDown={blockEvent}
            onPointerMove={blockEvent}
            onPointerUp={blockEvent}
            onPointerCancel={blockEvent}
            onWheel={blockEvent}
            onTouchStart={blockEvent}
            onTouchMove={blockEvent}
            onTouchEnd={blockEvent}
        >
            <div className="flex flex-col items-center gap-1.5 mb-3">
                <div className="flex items-center gap-1.5 text-[8.5px] uppercase font-bold tracking-widest whitespace-nowrap opacity-80">
                    <kbd className="bg-black/50 border border-white/20 text-[#ccff00] px-1.5 py-[1px] rounded-[3px] shadow-[0_1.5px_0_rgba(255,255,255,0.15)] leading-none flex items-center justify-center font-sans tracking-normal">Z</kbd>
                    <span className="text-white">UP</span>
                </div>
                <div className="text-[10px] font-mono opacity-50">+{MAX}</div>
            </div>

            {/* The actual native vertical slider */}
            <input
                type="range"
                min={MIN}
                max={MAX}
                value={value}
                step={0.1}
                onChange={handleSliderChange}
                className="cursor-pointer"
                style={{
                    appearance: 'slider-vertical' as any,
                    WebkitAppearance: 'slider-vertical' as any,
                    height: '160px', // Exact height of the slider track
                    width: '10px'
                }}
                // This helps older versions of Firefox understand it's vertical
                {...{ orient: "vertical" }}
            />

            <div className="flex flex-col items-center gap-1.5 mt-3">
                <div className="text-[10px] font-mono opacity-50">{MIN}</div>
                <div className="flex items-center gap-1.5 text-[8.5px] uppercase font-bold tracking-widest whitespace-nowrap opacity-80">
                    <kbd className="bg-black/50 border border-white/20 text-[#ccff00] px-1.5 py-[1px] rounded-[3px] shadow-[0_1.5px_0_rgba(255,255,255,0.15)] leading-none flex items-center justify-center font-sans tracking-normal">X</kbd>
                    <span className="text-white">DN</span>
                </div>
            </div>

            {/* Displaying the exact active value */}
            <div className="mt-3 text-[12px] font-bold text-[#ccff00] tabular-nums">
                {Number(value).toFixed(1)}
            </div>
        </div>
    );
};

export default VerticalBipolarSlider;