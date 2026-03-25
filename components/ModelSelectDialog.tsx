'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import BlurImage from './BlurImage';

export interface ModelOption {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    cameraSettings?: {
        speed?: number;
        collisionPadding?: number;
    };
    backgroundImage?: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
    {
        id: 'interior-2',
        title: 'Interior 2',
        description: 'Modern residential interior space.',
        thumbnail: 'interior-2.webp',
        url: '/examples/scene_optimized.glb',
        cameraSettings: {
            speed: 1.0,
            collisionPadding: 2.35
        }
    },
    {
        id: 'modern-villa',
        title: 'Modern Villa with Pool',
        description: 'A large, expansive architecture scene with a pool.',
        thumbnail: 'villa.webp',
        url: '/examples/Villa_optimized.glb',
        backgroundImage: 'background - villa.jpg',
        cameraSettings: {
            speed: 21.0,
            collisionPadding: 2.0
        }
    }
];

export default function ModelSelectDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    // Animation states — mirrors AuthModal pattern
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let rafId: number;

        if (isOpen) {
            setShouldRender(true);
            // Double rAF ensures the DOM has fully flushed the initial un-animated state
            rafId = requestAnimationFrame(() => {
                rafId = requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            setIsVisible(false);
            // Wait for exit transition to finish before unmounting
            timeoutId = setTimeout(() => {
                setShouldRender(false);
            }, 500);
        }

        return () => {
            clearTimeout(timeoutId);
            cancelAnimationFrame(rafId);
        };
    }, [isOpen]);

    if (!shouldRender) return null;

    const handleSelect = (id: string) => {
        onClose();
        window.location.assign(`/editor/${id}`);
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6" style={{ perspective: '1000px' }}>
            {/* Backdrop — frosted glass like AuthModal */}
            <div 
                className={`absolute inset-0 bg-white/60 dark:bg-black/50 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ willChange: 'opacity' }}
                onClick={onClose}
            />

            {/* Dialog — Liquid Glass Effect matching AuthModal */}
            <div 
                className={`relative w-full max-w-2xl bg-white/70 dark:bg-black/40 backdrop-blur-[48px] rounded-[32px] overflow-hidden border border-black/5 dark:border-white/10 [box-shadow:inset_0_1px_1px_rgba(255,255,255,0.8)] dark:[box-shadow:inset_0_1px_1px_rgba(255,255,255,0.1)] transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] p-6 sm:p-7 pt-8 max-h-[80vh] flex flex-col ${
                    isVisible ? 'scale-100 translate-y-0 opacity-100 rotate-x-0' : 'scale-95 translate-y-8 opacity-0 pointer-events-none -rotate-x-2'
                }`}
                style={{ willChange: 'transform, opacity' }}
            >
                {/* Subtle gradient overlay for liquid depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 dark:from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

                {/* Close Button — matching AuthModal style */}
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 transition-all duration-300 z-10 flex items-center justify-center backdrop-blur-md hover:rotate-90 hover:scale-110"
                    style={{ width: '32px', height: '32px' }}
                >
                    <X size={14} strokeWidth={2.5} className="text-black/50 hover:text-black dark:text-white/60 dark:hover:text-white" />
                </button>

                {/* Header */}
                <div className="relative z-10 mb-6 pr-8">
                    <h2 className={`text-[22px] font-bold tracking-tight text-black dark:text-white mb-1.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        Select a Model
                    </h2>
                    <p className={`text-[13px] text-black/50 dark:text-white/40 font-medium transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        Choose a 3D scene to explore in the Editor.
                    </p>
                </div>

                {/* Body — Model Grid */}
                <div className={`relative z-10 overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MODEL_OPTIONS.map((model, i) => (
                            <button
                                key={model.id}
                                onClick={() => handleSelect(model.id)}
                                className={`group relative flex flex-col items-start p-4 bg-black/5 dark:bg-black/20 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-[#ccff00]/50 rounded-2xl transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 text-left cursor-pointer hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] shadow-inner transform ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                }`}
                                style={{ 
                                    transitionDelay: isVisible ? `${175 + i * 75}ms` : '0ms',
                                    willChange: 'transform, opacity'
                                }}
                            >
                                <div className="w-full h-40 bg-black/10 dark:bg-black/40 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                                    {model.thumbnail ?
                                        <BlurImage src={`/${model.thumbnail}`} alt={model.title} className="w-full h-full object-cover rounded-xl" />
                                        : <ImageIcon size={32} className="text-black/20 dark:text-white/20" />
                                    }
                                </div>
                                <h3 className="text-black dark:text-white font-semibold group-hover:text-[#88aa00] dark:group-hover:text-[#ccff00] transition-colors text-[15px]">{model.title}</h3>
                                <p className="text-xs text-black/50 dark:text-neutral-400 mt-1 line-clamp-2">{model.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
