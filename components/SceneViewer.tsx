'use client';

import { useStore } from '@/store/useStore';
import ViewerCanvas from './ViewerCanvas';

export default function SceneViewer() {
    const bgColor = useStore(state => state.settings.bgColor);
    const tourMode = useStore(state => state.settings.tourMode);

    return (
        <div className="w-full h-full relative" style={{ backgroundColor: bgColor }}>
            <ViewerCanvas />

            {/* Tour Mode Instructions Overlay — Desktop only */}
            {tourMode && (
                <div className="hidden xl:block absolute top-4 left-1/2 -translate-x-1/2 text-white/70 px-4 py-2 rounded-full text-sm pointer-events-none border border-white/10" style={{ backgroundColor: 'rgba(18,18,18,0.8)', backdropFilter: 'blur(12px)' }}>
                    WASD to Move • ESC to Exit
                </div>
            )}
        </div>
    );
}
