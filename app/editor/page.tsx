'use client';

import { useEffect, useState } from 'react';
import SceneViewer from '@/components/SceneViewer';
import Sidebar from '@/components/Sidebar';
import CameraBookmarks from '@/components/CameraBookmarks';
import TextureCarousel from '@/components/TextureCarousel';
import { useStore, defaultSettings, LoadedModel } from '@/store/useStore';

export default function EditorPage() {
    const modelsLength = useStore(state => state.models.length);
    const settings = useStore(state => state.settings);
    const setSettings = useStore(state => state.setSettings);
    const editorMode = useStore(state => state.editorMode);
    const setEditorMode = useStore(state => state.setEditorMode);
    const setModels = useStore(state => state.setModels);
    const isModelLoading = useStore(state => state.isModelLoading);

    const [isHydrated, setIsHydrated] = useState(false);

    // Handle initial hydration & Dev/Prod mode based on environment variable
    useEffect(() => {
        setIsHydrated(true); // Always hydrate

        const isProdMode = process.env.NEXT_PUBLIC_EDITOR_MODE === 'prod';
        if (isProdMode) {
            setEditorMode('prod');

            // Auto-load Interior 2 if empty
            if (modelsLength === 0) {
                // Instantly trigger loader so the UI knows we are fetching
                useStore.getState().setIsModelLoading(true);

                const url = '/examples/scene_optimized.glb';
                const format = 'gltf';
                const filename = 'Interior 2';

                const newModel: LoadedModel = {
                    id: crypto.randomUUID(),
                    url: url,
                    format: format,
                    filename: filename
                };

                const loadAttachedBookmarks = async () => {
                    try {
                        const baseName = url.substring(0, url.lastIndexOf('.'));
                        const bookmarksUrl = `${baseName}.json`;
                        const res = await fetch(bookmarksUrl);
                        if (res.ok) {
                            const json = await res.json();
                            if (Array.isArray(json) && json.every(b => b.id && b.position && b.rotation)) {
                                useStore.getState().setBookmarks(json);
                            }
                        }
                    } catch (e) {
                        // ignore
                    }
                };

                loadAttachedBookmarks().then(() => {
                    setModels([newModel]);
                    useStore.getState().setIsModelLoading(false);
                });
            }
        }
    }, [setEditorMode, modelsLength, setModels]);

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

    // Prevent hydration flicker
    if (!isHydrated) return null;

    return (
        <div className="w-screen h-screen overflow-hidden flex relative font-sans bg-[#e0e1e5] dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-500">
            {/* Sidebar Overlay (Only shown in Dev Mode) */}
            {editorMode !== 'prod' && <Sidebar />}

            {/* Main Scene Area */}
            <div className="flex-1 relative z-0">
                <SceneViewer />

                {modelsLength === 0 && editorMode !== 'prod' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="text-center p-8 bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-xl border border-black/10 dark:border-white/10 shadow-lg">
                            <h1 className="text-2xl font-light mb-2">Ready to View</h1>
                            <p className="text-black/60 dark:text-white/60">Upload a 3D model from the sidebar to get started.</p>
                        </div>
                    </div>
                )}

                {/* Camera Bookmarks UI - Rendered here to be on top of Scene but inside the relative container */}
                <div className={`absolute bottom-4 right-4 z-40 transition-transform ${editorMode === 'prod' ? 'translate-y-0' : ''}`}>
                    <CameraBookmarks />
                </div>

                {/* Texture Carousel Overlay */}
                <TextureCarousel />

                {/* Global Loading Overlay */}
                <div
                    className={`absolute inset-0 z-50 bg-[#e0e1e5]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-500 pointer-events-none ${isModelLoading ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className={`flex flex-col items-center transition-transform duration-500 delay-100 ${isModelLoading ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                        {/* Elegant Spinner */}
                        <div className="relative w-16 h-16 mb-6">
                            <div className="absolute inset-0 border-2 border-black/10 dark:border-white/10 rounded-full"></div>
                            <div className="absolute inset-0 border-2 border-black dark:border-white rounded-full border-t-transparent animate-spin"></div>
                        </div>

                        <h2 className="text-xl font-light tracking-widest uppercase text-black dark:text-white mb-2">
                            Loading Model
                        </h2>
                        <p className="text-sm text-black/50 dark:text-white/50 animate-pulse">
                            Optimizing geometry and textures...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
