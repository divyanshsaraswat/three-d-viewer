'use client';

import { useStore } from '@/store/useStore';
import ViewerCanvas from './ViewerCanvas';

export default function SceneViewer() {
    const bgColor = useStore(state => state.settings.bgColor);
    const tourMode = useStore(state => state.settings.tourMode);

    return (
        <div className="w-full h-full relative" style={{ backgroundColor: bgColor }}>
            <ViewerCanvas />

            {/* Tour Mode Instructions Overlay */}
            {tourMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur pointer-events-none">
                    Click to Start • WASD to Move • ESC to Exit
                </div>
            )}
        </div>
    );
}
