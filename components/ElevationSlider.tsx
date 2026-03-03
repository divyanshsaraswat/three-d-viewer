'use client';
import { useRef, useState } from 'react';
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

    const MIN = -100.0;
    const MAX = 100.0;

    // Protect against NaN
    const safeHeight = typeof tourHeight === 'number' && !isNaN(tourHeight) ? tourHeight : 1.6;
    const percentage = Math.max(0, Math.min(100, ((safeHeight - MIN) / (MAX - MIN)) * 100));

    return (
        <div
            className="absolute bottom-[6rem] left-6 md:bottom-[7rem] md:left-8 z-[9000] flex flex-col items-center justify-center pointer-events-auto"
            style={{ height: '200px', width: '60px' }}
        >
            <div className="relative w-full h-full flex justify-center py-4 select-none">

                {/* Visual Background Track */}
                <div className="absolute top-4 bottom-4 w-1.5 bg-[#dbe0e5] rounded-full shadow-inner pointer-events-none overflow-hidden" />

                {/* Visual Active Fill */}
                <div
                    className="absolute bottom-4 w-1.5 bg-[#673ab7] rounded-b-full pointer-events-none transition-all duration-75"
                    style={{ height: `calc(${percentage}% * (168/200))` }} // 168 = 200 - 32 padding
                />

                {/* Center marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[2px] bg-white rounded-full shadow-sm pointer-events-none z-10" />

                {/* Map-Pin Thumb Component */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-20 transition-all duration-75"
                    style={{
                        // Map 0-100% to the 168px internal track height, offset by base padding
                        bottom: `calc(${percentage}% * (168/200) + 16px - 10px)`
                    }}
                >
                    {/* Tooltip Envelope */}
                    <div className="relative flex flex-col items-center drop-shadow-md pb-[6px]">
                        <div className="bg-[#673ab7] text-white text-[13px] font-bold py-1 px-3 rounded-full whitespace-nowrap flex items-center justify-center shadow-lg">
                            {Math.round(safeHeight)}
                        </div>
                        {/* Downward triangle tip */}
                        <div className="absolute bottom-0 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#673ab7]" />
                    </div>
                    {/* Thumb Center Origin Dot */}
                    <div className="w-[20px] h-[20px] bg-[#673ab7] rounded-full shadow-md border-2 border-white -mt-[4px]" />
                </div>

                {/* 
                  Native Range Input: INVISIBLE OMNI-CAPTURE LAYER
                  We use native browser vertical configurations so it actually sits over the Track.
                */}
                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    step="0.5"
                    value={safeHeight}
                    key={`elevation-slider-${MIN}-${MAX}`} // Prevent stale DOM references
                    onChange={(e) => updateSetting('tourHeight', parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0 appearance-none z-[100]"
                    style={{
                        writingMode: 'vertical-rl',
                        direction: 'rtl',
                        WebkitAppearance: 'slider-vertical'
                    }}
                />
            </div>
        </div>
    );
}
