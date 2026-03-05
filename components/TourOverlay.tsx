'use client';

import { useOnboarding } from '@onboardjs/react';
import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Check, MousePointerClick } from 'lucide-react';
import { tourSteps } from '@/config/tour';
import { useStore } from '@/store/useStore';

export default function TourOverlay() {
    const onboarding = useOnboarding();
    const { state, next, previous } = onboarding;
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const isModelLoading = useStore(s => s.isModelLoading);

    const updateRect = useCallback(() => {
        if (!state?.currentStep) return;

        const targetId = state.currentStep.payload?.targetId;
        if (!targetId) return;

        if (targetId === 'tour-canvas-center') {
            const size = 120;
            setTargetRect(new DOMRect(window.innerWidth / 2 - size / 2, window.innerHeight / 2 - size / 2, size, size));
            return;
        }

        let actualTargetId = targetId;

        // If it's the movement step, target the Joystick on mobile screens, otherwise keep canvas area
        if (targetId === 'tour-canvas-area' && window.innerWidth < 1280) {
            actualTargetId = 'tour-joystick';
        }

        let el = document.getElementById(actualTargetId);
        let rect = el?.getBoundingClientRect();

        // If not found or hidden, check for desktop/mobile variants
        if (!el || rect?.width === 0 || rect?.height === 0) {
            const desktopEl = document.getElementById(`${actualTargetId}-desktop`);
            const mobileEl = document.getElementById(`${actualTargetId}-mobile`);

            const desktopRect = desktopEl?.getBoundingClientRect();
            const mobileRect = mobileEl?.getBoundingClientRect();

            if (desktopRect && desktopRect.width > 0 && desktopRect.height > 0) {
                el = desktopEl;
                rect = desktopRect;
            } else if (mobileRect && mobileRect.width > 0 && mobileRect.height > 0) {
                el = mobileEl;
                rect = mobileRect;
            }
        }

        if (el && rect && rect.width > 0 && rect.height > 0) {
            setTargetRect(rect);
        }
    }, [state?.currentStep]);

    useEffect(() => {
        updateRect();
        window.addEventListener('resize', updateRect);
        const interval = setInterval(updateRect, 500);
        return () => {
            window.removeEventListener('resize', updateRect);
            clearInterval(interval);
        };
    }, [updateRect]);

    // Dispatch the custom event to close the Texture Carousel when moving 
    // to the "Saved Views" or subsequent steps, to assure the scene view is fully visible.
    useEffect(() => {
        if (state?.currentStep?.id === 'step-views') {
            window.dispatchEvent(new CustomEvent('tour-force-close-carousel'));
        }
    }, [state?.currentStep?.id]);

    const [forceHide, setForceHide] = useState(false);

    if (forceHide || isModelLoading || !state || !state.currentStep || state.isCompleted || state.currentStep.id === 'completed') return null;

    const { title, description, targetId } = state.currentStep.payload as any;
    const isFirst = state.isFirstStep;
    const isLast = state.isLastStep;

    const handleSkip = async () => {
        try {
            // Because the headless engine's finish/skip bindings are occasionally
            // detached in this beta react wrapper, we force completion locally
            // and write to the persistence key directly so it doesn't show again.
            localStorage.setItem('tour-completed-v1', 'true');

            setForceHide(true);

            // Also attempt to notify the engine
            const anyOnboarding = onboarding as any;
            if (anyOnboarding.finish) {
                await anyOnboarding.finish();
            } else if (anyOnboarding.engine && anyOnboarding.engine.reset) {
                await anyOnboarding.engine.reset({ initialStepId: 'completed' });
            }

            // Tell EditorPage to nuke the OnboardingProvider completely
            window.dispatchEvent(new CustomEvent('tour-fully-completed'));
        } catch (e) {
            console.error(e);
            setForceHide(true);
        }
    };

    return (
        <div id="tour-overlay-active" className="fixed inset-0 z-[100] pointer-events-none fade-in">
            {/* SVG mask for spotlight effect */}
            <svg className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id="spotlight-mask">
                        <rect width="100%" height="100%" fill="white" opacity="0.85" />
                        {targetRect && (
                            <rect
                                x={targetRect.left - (targetId === 'tour-canvas-center' ? 0 : 8)}
                                y={targetRect.top - (targetId === 'tour-canvas-center' ? 0 : 8)}
                                width={targetRect.width + (targetId === 'tour-canvas-center' ? 0 : 16)}
                                height={targetRect.height + (targetId === 'tour-canvas-center' ? 0 : 16)}
                                rx={targetId === 'tour-canvas-center' ? targetRect.width / 2 : 12}
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect width="100%" height="100%" fill="black" mask="url(#spotlight-mask)" />
            </svg>

            {/* Custom overlay when selecting Canvas Center */}
            {targetId === 'tour-canvas-center' && targetRect && (
                <div
                    className="absolute z-10 flex flex-col items-center justify-center animate-pulse"
                    style={{
                        top: targetRect.top,
                        left: targetRect.left,
                        width: targetRect.width,
                        height: targetRect.height,
                    }}
                >
                    <MousePointerClick size={40} className="text-[#ccff00] mb-2" />
                    <span className="text-[#ccff00] text-xs font-bold uppercase tracking-widest text-center leading-tight">Tap<br />Here</span>
                </div>
            )}

            {/* Tooltip Card */}
            {targetRect && (
                <div
                    className="absolute pointer-events-auto bg-[#121212]/70 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-5 w-80 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{
                        // Position safely within window
                        top: Math.max(20, Math.min(window.innerHeight - 200, targetRect.bottom + 20 + 200 > window.innerHeight ? targetRect.top - 20 - 180 : targetRect.bottom + 20)),
                        left: Math.max(20, Math.min(window.innerWidth - 340, targetRect.left + (targetRect.width / 2) - 160))
                    }}
                >
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-[#ccff00] font-bold text-sm uppercase tracking-wider">{title}</h3>
                        <button
                            onClick={handleSkip}
                            className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed mb-6 font-medium">{description}</p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-1.5">
                            {[0, 1, 2, 3, 4, 5].map(idx => (
                                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${state.currentStep?.id === tourSteps[idx].id ? 'w-4 bg-[#ccff00]' : 'w-1.5 bg-white/20'}`} />
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={async () => await previous()}
                                disabled={isFirst}
                                className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors font-semibold ${isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white/80'}`}
                            >
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button
                                onClick={async () => {
                                    if (isLast) await handleSkip();
                                    else await next();
                                }}
                                className="flex items-center gap-1 text-xs px-4 py-1.5 rounded-lg bg-[#ccff00] text-black font-bold hover:bg-[#ccff00]/90 transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                            >
                                {isLast ? <><Check size={16} className="mr-0.5" /> Finish</> : <>Next <ChevronRight size={16} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
