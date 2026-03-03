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
            {/* Top Number (Maximum Sky) */}
            <div className="text-[10px] opacity-60 mb-2">+{MAX}</div>

            {/* The actual native vertical slider */}
            <input
                type="range"
                min={MIN}
                max={MAX}
                value={value}
                step={4}
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

            {/* Bottom Number (Minimum Subsurface) */}
            <div className="text-[10px] opacity-60 mt-2">{MIN}</div>

            {/* Displaying the exact active value */}
            <div className="mt-3 text-[12px] font-bold text-[#ccff00]">
                {Number(value).toFixed(1)}
            </div>
        </div>
    );
};

export default VerticalBipolarSlider;