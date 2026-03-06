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

        </div>
    );
}
