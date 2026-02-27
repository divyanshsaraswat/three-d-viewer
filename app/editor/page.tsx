'use client';

import { useEffect, useState } from 'react';
import SceneViewer from '@/components/SceneViewer';
import Sidebar from '@/components/Sidebar';
import CameraBookmarks from '@/components/CameraBookmarks';
import TextureCarousel from '@/components/TextureCarousel';
import Joystick from '@/components/Joystick';
import { useStore, defaultSettings, LoadedModel } from '@/store/useStore';

export default function EditorPage() {
    const modelsLength = useStore(state => state.models.length);
    const settings = useStore(state => state.settings);
    const setSettings = useStore(state => state.setSettings);
    const editorMode = useStore(state => state.editorMode);
    const setEditorMode = useStore(state => state.setEditorMode);
    const setModels = useStore(state => state.setModels);
    const isModelLoading = useStore(state => state.isModelLoading);
    const selectedMeshId = useStore(state => state.selectedMeshId);

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
        <div className="w-screen h-screen overflow-hidden flex relative font-sans text-white transition-colors duration-500" style={{ backgroundColor: '#0a0a0a' }}>
            {/* Sidebar Overlay (Only shown in Dev Mode) */}
            {editorMode !== 'prod' && <Sidebar />}

            {/* Main Scene Area */}
            <div className="flex-1 relative z-0">
                <SceneViewer />

                {modelsLength === 0 && editorMode !== 'prod' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="text-center p-8 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg" style={{ backgroundColor: 'rgba(18,18,18,0.8)' }}>
                            <h1 className="text-2xl font-light mb-2 text-white">Ready to View</h1>
                            <p className="text-white/40">Upload a 3D model from the sidebar to get started.</p>
                        </div>
                    </div>
                )}

                {/* Desktop: Camera Bookmarks positioned normally */}
                <div className={`hidden lg:block absolute bottom-4 right-4 z-40 transition-all duration-500 ease-in-out ${selectedMeshId ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'} ${editorMode === 'prod' ? '' : ''}`}>
                    <CameraBookmarks />
                </div>

                {/* Mobile/Tablet: Stack Bookmarks above Joystick in a single fixed container */}
                <div className={`lg:hidden fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 transition-all duration-500 ease-in-out ${selectedMeshId ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                    <CameraBookmarks />
                    <Joystick />
                </div>

                {/* Texture Carousel Overlay */}
                <TextureCarousel />

                {/* Global Loading Overlay */}
                <div
                    className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${isModelLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    style={{ backgroundColor: '#0a0a0a' }}
                >
                    <div className={`flex flex-col items-center transition-all duration-500 delay-100 ${isModelLoading ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}>
                        {/* Brand Spinner */}
                        <div className="relative w-12 h-12 mb-8">
                            <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#ccff00] animate-spin"></div>
                        </div>

                        {/* Brand Text */}
                        <h2 className="text-white text-lg font-light tracking-[0.3em] uppercase mb-3" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                            Loading
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#ccff00] animate-pulse" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1 h-1 rounded-full bg-[#ccff00] animate-pulse" style={{ animationDelay: '200ms' }}></span>
                            <span className="w-1 h-1 rounded-full bg-[#ccff00] animate-pulse" style={{ animationDelay: '400ms' }}></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
