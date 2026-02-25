'use client';

import { useState, useRef } from 'react';
import { Search, Plus, X, ChevronLeft, ChevronRight, MoreHorizontal, Package } from 'lucide-react';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Mock texture packs library
const mockTexturePacks = [
    {
        id: 'pack_glass_ice',
        title: 'Glass & Ice',
        description: 'Shattered ice, frosted glass, and crystal patterns.',
        thumb: 'https://images.unsplash.com/photo-1549416878-b9ca95e26903?w=200&h=200&fit=crop',
        textures: [
            {
                id: 'tex_glass_1',
                title: 'Shattered Ice',
                thumb: 'https://images.unsplash.com/photo-1549416878-b9ca95e26903?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1549416878-b9ca95e26903?w=1024&h=1024&fit=crop'
            },
            {
                id: 'tex_glass_2',
                title: 'Frost Texture',
                thumb: 'https://images.unsplash.com/photo-1488812690757-9ece99f7d455?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1488812690757-9ece99f7d455?w=1024&h=1024&fit=crop'
            },
            {
                id: 'tex_glass_3',
                title: 'Water Droplets',
                thumb: 'https://images.unsplash.com/photo-1518428882575-bcf234c9caba?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1518428882575-bcf234c9caba?w=1024&h=1024&fit=crop'
            },
            {
                id: 'tex_glass_4',
                title: 'Frozen Lake',
                thumb: 'https://images.unsplash.com/photo-1517436073-3b1b1115b93d?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1517436073-3b1b1115b93d?w=1024&h=1024&fit=crop'
            },
            {
                id: 'tex_glass_5',
                title: 'Cracked Mirror',
                thumb: 'https://images.unsplash.com/photo-1502444330042-d1a1df2da1f9?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1502444330042-d1a1df2da1f9?w=1024&h=1024&fit=crop'
            },
            {
                id: 'tex_glass_6',
                title: 'Ice Crystals',
                thumb: 'https://images.unsplash.com/photo-1548344933-2895fbebeea1?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1548344933-2895fbebeea1?w=1024&h=1024&fit=crop'
            }
        ]
    },
    {
        id: 'pack_wood',
        title: 'Premium Woods',
        description: 'Dark walnut, oak, and rustic pine woodgrains.',
        thumb: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=200&h=200&fit=crop',
        textures: [
            {
                id: 'tex_wood_1',
                title: 'Dark Walnut',
                thumb: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1024&h=1024&fit=crop'
            },
            {
                id: 'tex_wood_2',
                title: 'Light Oak',
                thumb: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=1024&h=1024&fit=crop'
            },
            {
                id: 'tex_wood_3',
                title: 'Rustic Pine',
                thumb: 'https://images.unsplash.com/photo-1574311145802-120de80eebbc?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1574311145802-120de80eebbc?w=1024&h=1024&fit=crop'
            }
        ]
    },
    {
        id: 'pack_stone_concrete',
        title: 'Stone & Concrete',
        description: 'Classic Italian marble, concrete, and red brick walls.',
        thumb: 'https://images.unsplash.com/photo-1596547609652-9fc5d8d428ce?w=200&h=200&fit=crop',
        textures: [
            {
                id: 'tex_marble_1',
                title: 'Carrara Marble',
                thumb: 'https://images.unsplash.com/photo-1596547609652-9fc5d8d428ce?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1596547609652-9fc5d8d428ce?w=1024&h=1024&fit=crop'
            },
            {
                id: 'tex_concrete_1',
                title: 'Polished Concrete',
                thumb: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1024&h=1024&fit=crop'
            },
            {
                id: 'tex_brick_1',
                title: 'Exposed Red Brick',
                thumb: 'https://images.unsplash.com/photo-1511649475669-e288648b233a?w=200&h=200&fit=crop',
                full: 'https://images.unsplash.com/photo-1511649475669-e288648b233a?w=1024&h=1024&fit=crop'
            }
        ]
    }
];

export default function TextureCarousel() {
    const selectedMeshId = useStore(state => state.selectedMeshId);
    const applyTexture = useStore(state => state.applyTexture);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTextureId, setActiveTextureId] = useState<string | null>(null);
    const [activePackId, setActivePackId] = useState<string>(mockTexturePacks[0].id);
    const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
    const [popoverLeft, setPopoverLeft] = useState<number>(0);
    const applyTextureOptions = useStore(state => state.applyTextureOptions);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const trayRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Animate the main bottom tray entering
    useGSAP(() => {
        if (!trayRef.current) return;
        const tl = gsap.timeline();

        tl.fromTo(trayRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
        );

        tl.fromTo(".gsap-static-btn",
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" },
            "-=0.6"
        );
    }, { scope: trayRef });

    // Animate the thumbnails sliding staggered (re-runs when pack changes)
    useGSAP(() => {
        if (!trayRef.current) return;
        gsap.fromTo(".gsap-thumb-btn",
            { scale: 0.5, opacity: 0, x: 20 },
            { scale: 1, opacity: 1, x: 0, duration: 0.5, stagger: 0.04, ease: "back.out(1.5)" }
        );
    }, { dependencies: [activePackId], scope: trayRef });

    // Animate the "More Packs" Modal when it opens
    useGSAP(() => {
        if (isMenuOpen && modalRef.current) {
            gsap.fromTo(modalRef.current,
                { scale: 0.95, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
            );

            gsap.fromTo(".gsap-pack-card",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", delay: 0.1 }
            );
        }
    }, { dependencies: [isMenuOpen] });

    const navigateTexture = (direction: 'left' | 'right') => {
        if (!packTextures.length) return;

        let currentIndex = packTextures.findIndex(t => t.id === activeTextureId);
        if (currentIndex === -1) currentIndex = 0;
        else {
            if (direction === 'left') {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : packTextures.length - 1;
            } else {
                currentIndex = currentIndex < packTextures.length - 1 ? currentIndex + 1 : 0;
            }
        }

        const nextTex = packTextures[currentIndex];
        handleApply(nextTex, true);

        // Ensure newly selected thumbnail is visible
        setTimeout(() => {
            const el = document.getElementById(`thumb-${nextTex.id}`);
            if (el) {
                // Determine block and inline arguments based on typical scroll container usage
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }, 50);
    };

    // If no mesh is selected, we completely hide the UI
    if (!selectedMeshId) return null;

    const activePack = mockTexturePacks.find(p => p.id === activePackId) || mockTexturePacks[0];
    const packTextures = activePack.textures;

    const filteredPacks = mockTexturePacks.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleApply = async (tex: any, forceApply = false, event?: React.MouseEvent) => {
        // If clicking the currently active texture, toggle the options menu
        if (!forceApply && activeTextureId === tex.id) {
            if (showOptionsId === tex.id) {
                setShowOptionsId(null);
            } else {
                setShowOptionsId(tex.id);
                if (event?.currentTarget) {
                    const btn = event.currentTarget as HTMLElement;
                    const tray = btn.closest('.bg-\\[\\#1f1f23\\]') as HTMLElement;
                    if (tray) {
                        const btnRect = btn.getBoundingClientRect();
                        const trayRect = tray.getBoundingClientRect();
                        // 14px is for padding offset inside the tray
                        const left = btnRect.left - trayRect.left + (btnRect.width / 2);
                        setPopoverLeft(left);
                    }
                }
            }
            return;
        }

        setActiveTextureId(tex.id);
        setShowOptionsId(null);

        try {
            const res = await fetch(tex.full);
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            applyTexture(selectedMeshId, objectUrl);
        } catch (e) {
            console.error("Failed to load Texture from URL", e);
        }
    };

    const handleSelectPack = (packId: string) => {
        setActivePackId(packId);
        setIsMenuOpen(false); // Close dialog to reveal the new quick picks
    };

    return (
        <>
            {/* FLOATING BOTTOM TRAY (Quick Carousel) */}
            <div ref={trayRef} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
                <div className="bg-[#1f1f23] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-3.5 flex items-center gap-2 border border-white/5 relative">

                    {/* Left Scroll Button */}
                    <button
                        onClick={() => navigateTexture('left')}
                        className="gsap-static-btn w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors shrink-0"
                    >
                        <ChevronLeft size={20} className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    {/* Pack Title Mini Badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3f3f46] border border-white/10 text-white/80 text-[9px] md:text-[10px] uppercase font-bold tracking-wider px-2 md:px-3 py-0.5 rounded-full shadow-md whitespace-nowrap overflow-hidden z-10">
                        {activePack.title} Pack
                    </div>

                    {/* Global Options Popover (Dynamic horizontal position above tray) */}
                    {showOptionsId && (
                        <div
                            className="absolute bottom-[calc(100%+8px)] -translate-x-1/2 bg-[#27272a] rounded-xl border border-white/10 shadow-xl p-1.5 flex flex-col gap-1 w-32 animate-in fade-in zoom-in-95 duration-200 z-50 transition-all"
                            style={{ left: popoverLeft > 0 ? `${popoverLeft}px` : '50%' }}
                        >
                            <button
                                onClick={() => { applyTextureOptions({ tiling: [5, 5] }); setShowOptionsId(null); }}
                                className="text-xs text-left text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                                <span className="font-semibold block">Tiled</span>
                                <span className="text-[10px] text-white/40 font-normal">Default (5x5)</span>
                            </button>
                            <button
                                onClick={() => { applyTextureOptions({ tiling: [10, 10] }); setShowOptionsId(null); }}
                                className="text-xs text-left text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                                <span className="font-semibold block">Fine</span>
                                <span className="text-[10px] text-white/40 font-normal">Dense (10x10)</span>
                            </button>
                            <button
                                onClick={() => { applyTextureOptions({ tiling: [1, 1] }); setShowOptionsId(null); }}
                                className="text-xs text-left text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                                <span className="font-semibold block">Fit / Fill</span>
                                <span className="text-[10px] text-white/40 font-normal">Stretched (1x1)</span>
                            </button>
                        </div>
                    )}

                    {/* Quick Pick Thumbnails from Active Pack */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={() => setShowOptionsId(null)}
                        className="flex items-center gap-2 px-1 py-1 md:p-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth max-w-[130px] sm:max-w-[200px] md:max-w-[240px]"
                    >
                        {packTextures.map(tex => (
                            <div key={tex.id} className="gsap-thumb-btn relative">
                                <button
                                    id={`thumb-${tex.id}`}
                                    onClick={(e) => handleApply(tex, false, e)}
                                    className={`group relative w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-xl overflow-hidden shrink-0 transition-transform hover:scale-105 active:scale-95 ${activeTextureId === tex.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1f1f23]' : ''}`}
                                >
                                    <img src={tex.thumb} alt={tex.title} className="w-full h-full object-cover" />

                                    {/* Overlay icon on hover/active */}
                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-col gap-1 ${activeTextureId === tex.id ? '!opacity-100' : ''}`}>
                                        <div className="bg-black/60 rounded-lg p-1.5 backdrop-blur-sm">
                                            {activeTextureId === tex.id ? (
                                                <MoreHorizontal size={16} className="text-white" />
                                            ) : (
                                                <Plus size={16} className="text-white" />
                                            )}
                                        </div>
                                        <span className="text-[9px] text-white font-medium text-center leading-tight px-1 drop-shadow-md relative z-10 hidden group-hover:block transition-all">{activeTextureId === tex.id ? 'Options' : tex.title}</span>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* "More" Packs Button */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="gsap-static-btn w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-xl bg-[#3f3f46] hover:bg-[#52525b] flex flex-col items-center justify-center gap-1 md:gap-1.5 shrink-0 transition-colors border border-white/5 text-white shadow-inner"
                    >
                        <Package size={20} className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-[9px] md:text-[10px] font-semibold tracking-wide uppercase">Packs</span>
                    </button>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => navigateTexture('right')}
                        className="gsap-static-btn w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors shrink-0"
                    >
                        <ChevronRight size={20} className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    <div className="gsap-static-btn w-px h-10 bg-white/10 mx-1"></div>

                    {/* Reset & Close */}
                    <button
                        onClick={() => {
                            applyTexture(selectedMeshId, 'RESET');
                            setActiveTextureId(null);
                            useStore.getState().setSelectedMesh(null);
                        }}
                        className="gsap-static-btn w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-xl bg-red-500/10 hover:bg-red-500/20 flex flex-col items-center justify-center gap-1 md:gap-1.5 shrink-0 transition-colors border border-red-500/20 text-red-400"
                    >
                        <X size={20} className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-[10px] md:text-[11px] font-medium tracking-wide">Close</span>
                    </button>

                </div>
            </div>

            {/* FULL "MORE PACKS" MODAL DIALOG */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div ref={modalRef} className="bg-[#1f1f23] w-full max-w-4xl max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">

                        {/* Header & Search */}
                        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-[#18181b]">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search texture packs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#27272a] text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow placeholder:text-white/30"
                                />
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Texture Packs Grid */}
                        <div className="p-6 overflow-y-auto">
                            {filteredPacks.length === 0 ? (
                                <div className="text-center py-20 text-white/40">No texture packs found matching "{searchQuery}"</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredPacks.map(pack => (
                                        <button
                                            key={pack.id}
                                            onClick={() => handleSelectPack(pack.id)}
                                            className={`gsap-pack-card relative group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border transition-all text-left overflow-hidden ${activePackId === pack.id ? 'border-blue-500/50 bg-blue-500/5 ring-1 ring-blue-500/50 hover:bg-blue-500/10' : 'border-white/5 hover:border-white/20'}`}
                                        >
                                            {/* Preview Grid inside Pack Card */}
                                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 shadow-inner grid grid-cols-2 grid-rows-2 gap-[1px] bg-black/40">
                                                {pack.textures.slice(0, 4).map((t, i) => (
                                                    <img key={i} src={t.thumb} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${i === 0 ? 'col-span-2 row-span-1' : ''}`} />
                                                ))}
                                            </div>
                                            <div className="flex-1 py-1 z-10 relative">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">{pack.title}</h4>
                                                    {activePackId === pack.id && (
                                                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">Active</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-white/50 line-clamp-2 leading-relaxed tracking-wide mb-3">{pack.description}</p>
                                                <div className="text-xs font-medium text-white/30 flex items-center gap-1.5">
                                                    <Package size={14} />
                                                    {pack.textures.length} Textures
                                                </div>
                                            </div>

                                            {/* Subtle gradient overlay to make text more readable */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1f1f23]/50 to-[#1f1f23] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
