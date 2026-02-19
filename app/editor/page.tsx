'use client';

import { useEffect } from 'react';
import SceneViewer from '@/components/SceneViewer';
import Sidebar from '@/components/Sidebar';
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
        <div className="w-screen h-screen overflow-hidden flex relative font-sans text-neutral-100">
            {/* Sidebar Overlay */}
            <Sidebar />

            {/* Main Scene Area */}
            <div className="flex-1 relative">
                <SceneViewer />

                {modelsLength === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                            <h1 className="text-2xl font-light mb-2">Ready to View</h1>
                            <p className="text-neutral-400">Upload a 3D model from the sidebar to get started.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
