'use client';

import { MousePointerClick, Hand, ZoomIn } from 'lucide-react';

export default function LoadingGestures() {
    return (
        <div className="flex flex-row items-end justify-center gap-10 opacity-80 transition-opacity duration-1000 w-full text-center pb-2">
            {/* Rotate Hint */}
            <div className="flex flex-col items-center justify-end gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 shadow-[0_4px_20px_rgba(204,255,0,0.02)] flex items-center justify-center animate-[slideLeftRight_2s_ease-in-out_infinite]">
                    <MousePointerClick className="w-3.5 h-3.5 text-[#ccff00]" />
                </div>
                <div className="flex flex-col items-center mt-1">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/90 font-bold mb-[1px]">Rotate</p>
                    <p className="text-[8px] text-[#ccff00]/60 font-medium">Drag</p>
                </div>
            </div>

            {/* Pan Hint */}
            <div className="flex flex-col items-center justify-end gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 shadow-[0_4px_20px_rgba(204,255,0,0.02)] flex items-center justify-center animate-[slideUpDown_2s_ease-in-out_infinite] [animation-delay:0.3s]">
                    <Hand className="w-3.5 h-3.5 text-[#ccff00]" />
                </div>
                <div className="flex flex-col items-center mt-1">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/90 font-bold mb-[1px]">Tap</p>
                    <p className="text-[8px] text-[#ccff00]/60 font-medium">1 Finger</p>
                </div>
            </div>
        </div>
    );
}
