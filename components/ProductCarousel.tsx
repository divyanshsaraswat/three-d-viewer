"use client";

import React, { useState, useEffect, useRef } from 'react';

const products = [
    {
        id: 1,
        name: 'Sustainable Sheet Set',
        price: 'From $120',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
        tag: 'Made from 12 recycled garments',
        badge: null,
        variants: 'King / Queen / Single',
    },
    {
        id: 2,
        name: 'Recycled Cotton Pillow Covers',
        price: '$45',
        image: 'https://images.unsplash.com/photo-1584063223005-592bbbaad434?q=80&w=800&auto=format&fit=crop',
        tag: 'Zero waste production',
        badge: null,
    },
    {
        id: 3,
        name: 'Duvet Cover Collection',
        price: 'From $150',
        image: 'https://images.unsplash.com/photo-1629948618342-921d279930f6?q=80&w=800&auto=format&fit=crop',
        tag: '100% Recycled Fibers',
        badge: null,
    },
    {
        id: 4,
        name: 'Bath Towel Series',
        price: '$60',
        image: 'https://images.unsplash.com/photo-1616627547584-bf2fccecefa8?q=80&w=800&auto=format&fit=crop',
        tag: 'Ultra-absorbent & Quick dry',
        badge: null,
    },
    {
        id: 5,
        name: 'Recycled Yoga Mats',
        price: 'TBA',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop',
        tag: 'Non-slip & Eco-friendly',
        badge: 'Coming Soon',
    },
    {
        id: 6,
        name: 'Kitchen Linens',
        price: 'TBA',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
        tag: 'Durable & Stain resistant',
        badge: 'Coming Soon',
    },
];

export default function ProductCarousel() {
    const [rotationY, setRotationY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const numItems = products.length;
    const anglePerItem = 360 / numItems;
    // Calculate radius to avoid overlapping items based on item width (320px) + gap
    const radius = Math.round((320 / 2) / Math.tan(Math.PI / numItems)) + 50;

    // Auto-rotate
    useEffect(() => {
        if (isDragging) return;
        const interval = setInterval(() => {
            // Rotate negative direction (clockwise viewing from top)
            setRotationY((prev) => prev - anglePerItem);
        }, 4000);
        return () => clearInterval(interval);
    }, [isDragging, anglePerItem]);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const diffX = e.clientX - startX;
        setCurrentX(diffX);
    };

    const handlePointerUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const sensitivity = 0.5;
        const totalRotationAdded = currentX * sensitivity;

        // Snap to nearest item
        const newRotation = rotationY + totalRotationAdded;
        const snappedRotation = Math.round(newRotation / anglePerItem) * anglePerItem;
        setRotationY(snappedRotation);
        setCurrentX(0);
    };

    const handlePointerLeave = () => {
        if (isDragging) handlePointerUp();
    };

    const currentRotation = rotationY + (isDragging ? currentX * 0.5 : 0);

    return (
        <section className="py-32 px-4 md:px-8 bg-gray-50 dark:bg-[#121212] overflow-hidden transition-colors duration-500">
            <div className="max-w-[1200px] mx-auto text-center mb-16 animate-section">
                <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4 text-black dark:text-white transition-colors">Product Showcase</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed transition-colors">
                    Explore our ecosystem of sustainable luxury. Each product is a commitment to regenerating our planet.
                </p>
            </div>

            <div
                className="w-full h-[700px] relative perspective-[1200px] flex items-center justify-center -mt-10"
                style={{ perspective: "1500px" }}
            >
                {/* Spot light effect */}
                <div className="absolute top-0 w-[800px] h-[800px] bg-black/5 dark:bg-white/5 rounded-full blur-[120px] pointer-events-none transform -translate-y-1/2 transition-colors"></div>

                {/* Carousel Stage */}
                <div
                    ref={containerRef}
                    className="relative w-[320px] h-[500px] cursor-grab active:cursor-grabbing z-10"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: `translateZ(-${radius}px) rotateY(${currentRotation}deg)`,
                        transition: isDragging ? 'none' : 'transform 1000ms cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerLeave}
                >
                    {products.map((product, index) => {
                        const angle = index * anglePerItem;
                        return (
                            <div
                                key={product.id}
                                className={`absolute top-0 left-0 w-full h-full bg-white dark:bg-[#1e1e1e] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl p-6 flex flex-col group hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(204,255,0,0.15)] transition-all duration-300`}
                                style={{
                                    transformStyle: "preserve-3d",
                                    backfaceVisibility: "hidden",
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                }}
                            >
                                <div className="relative w-full h-[220px] rounded-2xl overflow-hidden mb-6">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    {product.badge && (
                                        <div className="absolute top-3 right-3 bg-[#ccff00] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                            {product.badge}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col pointer-events-none">
                                    <p className="text-[#ccff00] text-xs font-bold uppercase tracking-widest mb-2">{product.tag}</p>
                                    <h3 className="text-2xl font-bold text-black dark:text-white mb-1 leading-snug transition-colors">{product.name}</h3>
                                    {product.variants && <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 font-medium transition-colors">{product.variants}</p>}
                                    <p className="text-black dark:text-white text-xl font-bold mt-auto mb-6 transition-colors">{product.price}</p>

                                    <div className="flex gap-2 w-full pointer-events-auto">
                                        <button className="flex-1 bg-black/5 dark:bg-white/10 hover:bg-black dark:hover:bg-white text-black dark:text-white hover:text-white dark:hover:text-black text-[10px] sm:text-xs font-bold uppercase px-2 sm:px-4 py-3 rounded-xl transition-colors backdrop-blur-md border border-black/10 dark:border-white/5">Details</button>
                                        <button className="flex-1 bg-[#ccff00] hover:bg-black dark:hover:bg-white text-black text-[10px] sm:text-xs font-bold uppercase px-2 sm:px-4 py-3 rounded-xl transition-colors shadow-lg shadow-[#ccff00]/20 hover:text-white dark:hover:text-black">Cart</button>
                                        <button className="w-12 shrink-0 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-black dark:hover:bg-white text-black dark:text-white hover:text-white dark:hover:text-black rounded-xl flex items-center justify-center transition-colors border border-black/10 dark:border-white/5 group-hover:border-black/20 dark:group-hover:border-white/20" title="Try in 3D">
                                            ⭐
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Runway Platform */}
                <div
                    className="absolute bottom-[-100px] w-[800px] h-[300px] rounded-[100%] border border-black/10 dark:border-white/10 pointer-events-none transition-colors"
                    style={{
                        transform: "rotateX(75deg) translateZ(-100px)",
                        background: "radial-gradient(circle at center, rgba(204,255,0,0.05) 0%, rgba(0,0,0,0) 70%)"
                    }}
                >
                    <div className="w-full h-full rounded-[100%] border border-black/5 dark:border-white/5 scale-95 transition-colors"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#ccff00] rounded-full blur-[4px]"></div>
                </div>
            </div>

            {/* Carousel navigation hints */}
            <div className="flex items-center justify-center gap-4 mt-8 text-gray-500 text-sm font-medium animate-section">
                <span>←</span>
                <span>Drag to explore</span>
                <span>→</span>
            </div>
        </section>
    );
}
