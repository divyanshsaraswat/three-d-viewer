'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import SceneViewer from '@/components/SceneViewer';
import Sidebar from '@/components/Sidebar';
import CameraBookmarks from '@/components/CameraBookmarks';
import TextureCarousel from '@/components/TextureCarousel';
import Joystick from '@/components/Joystick';
import VerticalBipolarSlider from '@/components/VerticalBipolarSlider';
import { useStore, defaultSettings, LoadedModel } from '@/store/useStore';
import { MODEL_OPTIONS } from '@/components/ModelSelectDialog';
import { useMemo } from 'react';
import LoadingGestures from '@/components/LoadingGestures';
import TextType from '@/components/TextType';
import { OnboardingProvider } from '@onboardjs/react';
import { tourSteps, tourRegistry } from '@/config/tour';
import TourOverlay from '@/components/TourOverlay';

export default function EditorPage({ params }: { params: Promise<{ modelId: string }> }) {
    const modelsLength = useStore(state => state.models.length);
    const models = useStore(state => state.models);
    const settings = useStore(state => state.settings);
    const setSettings = useStore(state => state.setSettings);
    const editorMode = useStore(state => state.editorMode);
    const setEditorMode = useStore(state => state.setEditorMode);
    const setModels = useStore(state => state.setModels);
    const isModelLoading = useStore(state => state.isModelLoading);
    const selectedMeshId = useStore(state => state.selectedMeshId);

    const [isHydrated, setIsHydrated] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [hasSeenTour, setHasSeenTour] = useState(true); // Default to true to prevent flash

    const loadingQuotes = useMemo(() => {
        const quotes = [
            "Good architecture takes time. So does loading a good one. Please bear with us while we assemble your digital space.",
            "If great buildings aren’t built in a day, a detailed 3D experience probably shouldn’t be either.",
            "Behind every smooth experience is a slightly stressed rendering engine working very hard right now.",
            "We could have shown you a boring loading bar. Instead, we’re building an entire space for you.",
            "A moment please. Our pixels are currently negotiating with physics to form beautiful structures.",
            "Some people rush design. We prefer building things properly — even if it takes a few seconds longer.",
            "Think of this moment as the calm before you step into a world designed with intention.",
            "Sustainable design is about patience and precision. Your experience is loading with both.",
            "While this loads, imagine walking through a space designed exactly the way you want it.",
            "Rome wasn’t built in a day. Your 3D experience will be ready much faster though.",
            "Every great structure begins with a blueprint. This one begins with a loading screen.",
            "We’re currently arranging thousands of polygons so your imagination gets a place to live.",
            "Good design is invisible. Until you render it in 3D.",
            "While you wait, remember: the best spaces are those built thoughtfully.",
            "This pause is temporary. Good architecture lasts forever.",
            "If design was instant, architects would be out of jobs. Luckily, this takes a moment.",
            "Loading sustainable structures… because the future deserves better spaces.",
            "Our rendering engine is currently turning ideas into dimensions.",
            "Great experiences are built layer by layer. Yours is almost ready.",
            "Behind this screen, geometry is becoming architecture.",
            "A few seconds of patience for a much better perspective.",
            "While this loads, consider how much engineering goes into something that feels simple.",
            "Innovation takes a moment. Especially when it’s in 3D.",
            "We promise this is faster than building the real structure.",
            "If creativity had a loading bar, it would probably look like this.",
            "Our servers are currently assembling walls, spaces, and possibilities.",
            "Not all loading screens are wasted time. Some are the doorway to better ideas.",
            "Every polygon you see later is currently being politely placed into position.",
            "While you wait, imagine the space you wish existed. We might already be building it.",
            "The best environments are not rushed — even digital ones.",
            "A small pause now for a smoother experience ahead.",
            "The system is currently convincing thousands of pixels to behave like architecture.",
            "We’re building a digital space where ideas can actually be explored.",
            "Good design should feel effortless. Making it that way is the hard part.",
            "Rendering innovation in progress.",
            "You’re about to enter a space where imagination meets structure.",
            "Precision takes time. Even in the digital world.",
            "Somewhere inside this server, geometry is becoming design.",
            "Our processors are currently doing architectural yoga to align everything perfectly.",
            "Just a moment — your immersive experience is putting on its finishing touches.",
            "A thoughtful space deserves a thoughtful loading time.",
            "Not all waiting is wasted. Sometimes it’s preparation.",
            "Think of this as the digital equivalent of watching a building rise floor by floor.",
            "While you wait, remember that great spaces shape great ideas.",
            "Loading the architecture of possibilities.",
            "Because the future of design should be experienced, not just imagined.",
            "A moment of patience now for a better perspective later.",
            "Every great experience begins with a small pause.",
            "Turning imagination into navigable spaces.",
            "Almost there. Your next perspective is loading."
        ];

        for (let i = quotes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
        }
        return quotes;
    }, []);

    // Handle initial hydration & Model Loading based on URL parmeters
    useEffect(() => {
        setIsHydrated(true); // Always hydrate

        // Ensure dev/prod settings sync
        const isProdMode = process.env.NEXT_PUBLIC_EDITOR_MODE === 'prod';
        if (isProdMode) {
            setEditorMode('prod');
        }

        // Auto-load dynamically requested model
        params.then((unwrappedParams) => {
            const targetModelId = unwrappedParams.modelId;
            const currentModels = useStore.getState().models;

            // If the requested model is already loaded, do nothing
            if (currentModels.length > 0 && currentModels[0].id === targetModelId) {
                return;
            }
            const targetModel = MODEL_OPTIONS.find(m => m.id === targetModelId);

            if (targetModel) {
                useStore.getState().setIsModelLoading(true);
                // Clear existing models first to force the viewer to unmount the old one
                useStore.getState().setModels([]);

                const url = targetModel.url;
                // Extract format safely
                const formatMatch = url.match(/\.([a-z0-9]+)$/i);
                const format = (formatMatch ? formatMatch[1] : 'glb') as LoadedModel['format'];

                // Append a cache-busting parameter to ensure PlayCanvas/Browser doesn't load a stale blob
                const cacheBustedUrl = url.includes('?')
                    ? `${url}&cb=${Date.now()}`
                    : `${url}?cb=${Date.now()}`;

                const newModel: LoadedModel = {
                    id: targetModel.id,
                    url: cacheBustedUrl,
                    format: format,
                    filename: `${targetModel.title}.${format}`
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
                    if (targetModel.cameraSettings) {
                        useStore.getState().setModelCameraSettings(targetModel.cameraSettings);
                    } else {
                        useStore.getState().setModelCameraSettings(null); // Explicit clear
                    }
                    // Set background image if the model defines one
                    useStore.getState().setBackgroundImage(targetModel.backgroundImage ? `/${targetModel.backgroundImage}` : null);
                });
            }
        });
    }, [setEditorMode, modelsLength, setModels, params]);

    // Load settings and tour status from LocalStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('3d-viewer-settings');
            if (saved) {
                // Merge with default settings to ensure new keys exist
                const parsed = JSON.parse(saved);
                setSettings({ ...defaultSettings, ...parsed });
            }

            const tourStatus = localStorage.getItem('tour-completed-v1');
            if (tourStatus !== 'true') {
                setHasSeenTour(false);
                // Immediately set it to true so that a page refresh never shows it again
                localStorage.setItem('tour-completed-v1', 'true');
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

    // Handle Capture Completion
    useEffect(() => {
        const handleComplete = () => setIsCapturing(false);
        window.addEventListener('screenshot-complete', handleComplete);
        return () => window.removeEventListener('screenshot-complete', handleComplete);
    }, []);

    // Destroy the Onboard JS tracking by hiding the overlay when finished
    useEffect(() => {
        const handleTourFinish = () => setHasSeenTour(true);
        window.addEventListener('tour-fully-completed', handleTourFinish);
        return () => window.removeEventListener('tour-fully-completed', handleTourFinish);
    }, []);

    // Prevent hydration flicker
    if (!isHydrated) return null;

    return (
        <OnboardingProvider
            steps={tourSteps}
            componentRegistry={tourRegistry}
        >
            <div className="w-screen h-screen overflow-hidden flex relative font-sans text-white transition-colors duration-500 select-none" style={{ backgroundColor: '#0a0a0a' }}>
                {/* Back to Home Button (Top Left) */}
                <button
                    onClick={() => window.location.assign('/home')}
                    className={`absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-black/60 hover:border-black/30 dark:hover:border-white/30 transition-all duration-700 shadow-lg group ${selectedMeshId || isModelLoading ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform text-[#88aa00] dark:text-[#ccff00]">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                    <span className="text-xs font-bold tracking-widest uppercase">Home</span>
                </button>

                {/* Sidebar Overlay (Only shown in Dev Mode) */}
                {editorMode !== 'prod' && <Sidebar />}

                {/* Main Scene Area */}
                <div className="flex-1 relative z-0" id="tour-canvas-area">
                    <SceneViewer />

                    {modelsLength === 0 && editorMode !== 'prod' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="text-center p-8 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg" style={{ backgroundColor: 'rgba(18,18,18,0.8)' }}>
                                <h1 className="text-2xl font-light mb-2 text-white">Ready to View</h1>
                                <p className="text-white/40">Upload a 3D model from the sidebar to get started.</p>
                            </div>
                        </div>
                    )}

                    {/* Desktop: Camera Bookmarks & Floating Buttons */}
                    <div className={`hidden xl:flex flex-col items-end gap-3 absolute bottom-4 right-4 z-40 transition-all duration-700 ease-in-out ${(selectedMeshId || isModelLoading) ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                        {/* Floating Screenshot Button */}
                        <button
                            id="tour-capture-btn-desktop"
                            disabled={isCapturing}
                            onClick={() => {
                                if (isCapturing) return;
                                setIsCapturing(true);
                                // Yield rendering thread briefly before heavy WebGL readPixels blocks it
                                setTimeout(() => {
                                    window.dispatchEvent(new CustomEvent('take-screenshot'));
                                }, 50);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-[#1a1a1a] border rounded-lg text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-all shadow-lg backdrop-blur-sm group ${isCapturing ? 'border-black/20 dark:border-white/20 opacity-70 cursor-wait' : 'border-black/10 dark:border-white/10 hover:border-[#88aa00]/40 dark:hover:border-[#ccff00]/40 cursor-pointer'}`}
                            title="Take High-Quality Screenshot"
                        >
                            {isCapturing ? (
                                <div className="w-4 h-4 border-2 border-black/20 dark:border-white/20 border-t-[#88aa00] dark:border-t-[#ccff00] rounded-full animate-spin"></div>
                            ) : (
                                <ImageIcon size={16} className="text-[#88aa00] dark:text-[#ccff00] group-hover:scale-110 transition-transform" />
                            )}
                            <span className="text-xs font-medium">{isCapturing ? 'Capturing...' : 'Capture'}</span>
                        </button>

                        <CameraBookmarks containerId="tour-saved-views-desktop" />
                    </div>

                    {/* Mobile/Tablet: Stack Bookmarks above Joystick in a single fixed container */}
                    <div className={`xl:hidden fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 transition-all duration-700 ease-in-out ${(selectedMeshId || isModelLoading) ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                        {/* Floating Screenshot Button (Mobile/Tablet) */}
                        <button
                            id="tour-capture-btn-mobile"
                            disabled={isCapturing}
                            onClick={() => {
                                if (isCapturing) return;
                                setIsCapturing(true);
                                setTimeout(() => {
                                    window.dispatchEvent(new CustomEvent('take-screenshot'));
                                }, 50);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-[#1a1a1a] border rounded-lg text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-all shadow-lg backdrop-blur-sm group ${isCapturing ? 'border-black/20 dark:border-white/20 opacity-70 cursor-wait' : 'border-black/10 dark:border-white/10 hover:border-[#88aa00]/40 dark:hover:border-[#ccff00]/40 cursor-pointer'}`}
                            title="Take High-Quality Screenshot"
                        >
                            {isCapturing ? (
                                <div className="w-4 h-4 border-2 border-black/20 dark:border-white/20 border-t-[#88aa00] dark:border-t-[#ccff00] rounded-full animate-spin"></div>
                            ) : (
                                <ImageIcon size={16} className="text-[#88aa00] dark:text-[#ccff00] group-hover:scale-110 transition-transform" />
                            )}
                            <span className="text-xs font-medium">{isCapturing ? 'Capturing...' : 'Capture'}</span>
                        </button>

                        <CameraBookmarks containerId="tour-saved-views-mobile" />
                        <Joystick />
                    </div>

                    {/* Vertical Elevation Slider (Bottom Left, above text) */}
                    <div className={`transition-all duration-700 ease-in-out delay-100 relative z-[9999] ${isModelLoading ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                        <VerticalBipolarSlider />
                    </div>

                    {/* WEINIX Branding Watermark */}
                    <div className={`absolute bottom-6 left-6 md:bottom-8 md:left-8 z-40 pointer-events-none flex flex-col items-start select-none drop-shadow-lg transition-all duration-700 delay-200 ${isModelLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-black/90 dark:text-white/90 leading-none transition-colors duration-500">
                            WEINIX
                        </h1>
                        <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#88aa00] dark:text-[#ccff00] mt-1 pl-0.5 transition-colors duration-500">
                            3D Walkthrough
                        </p>
                    </div>

                    {/* Texture Carousel Overlay */}
                    <TextureCarousel />

                    {/* Global Loading Overlay */}
                    <div
                        className={`absolute inset-0 z-50 flex flex-col justify-between items-center pb-8 pt-0 transition-opacity duration-700 ${isModelLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        style={{ backgroundColor: '#0a0a0a' }}
                    >
                        {/* Top Spacer to push center down exactly halfway */}
                        <div className="flex-1"></div>

                        {/* Center Box */}
                        <div className={`shrink-0 flex flex-col items-center transition-all duration-500 delay-100 ${isModelLoading ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}>
                            {/* Brand Spinner */}
                            <div className="relative w-12 h-12 mb-8">
                                <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#ccff00] animate-spin"></div>
                            </div>

                            {/* Loading Quotes */}
                            <div className="max-w-[90vw] md:max-w-xl text-center px-4">
                                <TextType
                                    text={loadingQuotes}
                                    typingSpeed={30}
                                    deletingSpeed={10}
                                    pauseDuration={3000}
                                    loop={true}
                                    className="text-sm md:text-base lg:text-lg font-light tracking-wide text-[#ccff00] drop-shadow-[0_0_8px_rgba(204,255,0,0.4)]"
                                    finishedClassName="scale-[1.03] drop-shadow-[0_0_25px_rgba(204,255,0,0.9)] opacity-90"
                                />
                            </div>
                        </div>

                        {/* Bottom Gestures */}
                        <div className="flex-1 flex items-end justify-center w-full">
                            <div className={`transition-all duration-1000 w-full delay-300 ${isModelLoading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <LoadingGestures />
                            </div>
                        </div>
                    </div>
                    {!hasSeenTour && <TourOverlay />}
                </div>
            </div>
        </OnboardingProvider>
    );
}
