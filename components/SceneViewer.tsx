'use client';

import { useStore } from '@/store/useStore';
import ViewerCanvas from './ViewerCanvas';
import BlurImage from './BlurImage';

export default function SceneViewer() {
    const bgColor = useStore(state => state.settings.bgColor);
    const tourMode = useStore(state => state.settings.tourMode);
    const backgroundImage = useStore(state => state.backgroundImage);

    return (
        <div className="w-full h-full relative" style={{ backgroundColor: bgColor }}>
            {/* Background Image Layer (behind the canvas) */}
            {backgroundImage && (
                <BlurImage
                    src={backgroundImage}
                    alt=""
                    transitionDuration={1000}
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                />
            )}

            {/* Canvas Layer */}
            <div className="relative z-10 w-full h-full">
                <ViewerCanvas />
            </div>

            {/* Tour Mode Instructions Overlay — Desktop only */}
            {tourMode && (
                <div className="hidden xl:block absolute top-4 left-1/2 -translate-x-1/2 text-white/70 px-4 py-2 rounded-full text-sm pointer-events-none border border-white/10 z-20" style={{ backgroundColor: 'rgba(18,18,18,0.8)', backdropFilter: 'blur(12px)' }}>
                    Press ESC to Exit
                </div>
            )}
        </div>
    );
}
