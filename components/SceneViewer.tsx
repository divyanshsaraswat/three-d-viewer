'use client';

import { useStore } from '@/store/useStore';
import ViewerCanvas from './ViewerCanvas';

export default function SceneViewer() {
    const bgColor = useStore(state => state.settings.bgColor);
    const tourMode = useStore(state => state.settings.tourMode);

    return (
        <div className="w-full h-full relative" style={{ backgroundColor: bgColor }}>
            <ViewerCanvas />
        </div>
    );
}
