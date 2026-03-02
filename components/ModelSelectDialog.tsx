'use client';

import { useState } from 'react';
import { Box, Image as ImageIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface ModelOption {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
    {
        id: 'interior-2',
        title: 'Interior 2',
        description: 'Modern residential interior space.',
        thumbnail: '/placeholder-interior.jpg', // You can replace this with an actual screenshot
        url: '/examples/scene_optimized.glb'
    },
    {
        id: 'modern-mansion',
        title: 'Modern Mansion',
        description: 'SHC Modern Mansion Assets Complete Pack.',
        thumbnail: '/examples/SHC Modern Mansion Assets Complete Pack/background.jpeg',
        url: '/examples/SHC Modern Mansion Assets Complete Pack/SHC Modern Mansion Assets Complete Pack_optimized.glb'
    }
];

export default function ModelSelectDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleSelect = (id: string) => {
        onClose();
        router.push(`/editor/${id}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog Box */}
            <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col max-h-[80vh] m-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h2 className="text-xl font-medium text-white">Select a Model</h2>
                        <p className="text-sm text-neutral-400 mt-1">Choose a 3D scene to load into the Editor.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Grid Grid Grid Grid Grid */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MODEL_OPTIONS.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => handleSelect(model.id)}
                                className="group relative flex flex-col items-start p-4 bg-white/5 border border-white/10 hover:border-[#ccff00]/50 rounded-xl transition-all hover:bg-white/10 text-left"
                            >
                                <div className="w-full h-40 bg-black/40 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                                    {/* Fallback Icon */}
                                    <Box size={32} className="text-white/20" />
                                </div>
                                <h3 className="text-white font-medium group-hover:text-[#ccff00] transition-colors">{model.title}</h3>
                                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{model.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
