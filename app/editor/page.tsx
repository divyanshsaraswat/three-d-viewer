'use client';

import { useEffect } from 'react';
import SceneViewer from '@/components/SceneViewer';
import Sidebar from '@/components/Sidebar';
import CameraBookmarks from '@/components/CameraBookmarks';
import TextureCarousel from '@/components/TextureCarousel';
import { useStore, defaultSettings } from '@/store/useStore';

export default function EditorPage() {
    const modelsLength = useStore(state => state.models.length);
    const settings = useStore(state => state.settings);
    const setSettings = useStore(state => state.setSettings);

    // Load settings from LocalStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('3d-viewer-settings');
            if (saved) {
                // Merge with default settings to ensure new keys exist
                const parsed = JSON.parse(saved);
                setSettings({ ...defaultSettings, ...parsed });
            }
        } catch (e) {
            console.warn('Failed to access localStorage:', e);
        }
    }, [setSettings]);

    // Save settings to LocalStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('3d-viewer-settings', JSON.stringify(settings));
        } catch (e) {
            // Ignore write errors
        }
    }, [settings]);

    return (
        <div className="w-screen h-screen overflow-hidden flex relative font-sans bg-[#e0e1e5] dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-500">
            {/* Sidebar Overlay */}
            <Sidebar />

            {/* Main Scene Area */}
            <div className="flex-1 relative z-0">
                <SceneViewer />

                {modelsLength === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="text-center p-8 bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-xl border border-black/10 dark:border-white/10 shadow-lg">
                            <h1 className="text-2xl font-light mb-2">Ready to View</h1>
                            <p className="text-black/60 dark:text-white/60">Upload a 3D model from the sidebar to get started.</p>
                        </div>
                    </div>
                )}

                {/* Camera Bookmarks UI - Rendered here to be on top of Scene but inside the relative container */}
                <div className="absolute bottom-4 right-4 z-50">
                    <CameraBookmarks />
                </div>

                {/* Texture Carousel Overlay */}
                <TextureCarousel />
            </div>
        </div>
    );
}
