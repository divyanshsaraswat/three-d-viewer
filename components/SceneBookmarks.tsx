'use client';

import { useStore, CameraBookmark } from '@/store/useStore';
import { Html } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';

export default function SceneBookmarks() {
    const bookmarks = useStore(state => state.bookmarks);
    const mode = useStore(state => state.settings.tourMode);

    if (bookmarks.length === 0) return null;

    return (
        <group>
            {bookmarks.map((b) => (
                <BookmarkMarker key={b.id} bookmark={b} />
            ))}
        </group>
    );
}

function BookmarkMarker({ bookmark }: { bookmark: CameraBookmark }) {
    const [hovered, setHovered] = useState(false);

    // Position slightly in front of the camera position where it was taken?
    // Or exactly AT the camera position?
    // If it's AT the position, you can't see it unless you are outside.
    // The user said "Click to go section". Usually these are markers floating in the scene.
    // Let's render them at the position.

    const handleClick = () => {
        window.dispatchEvent(new CustomEvent('restore-bookmark', { detail: bookmark }));
    };

    return (
        <group position={bookmark.position}>
            {/* Visual Marker (Sphere) */}
            <mesh
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial
                    color={hovered ? "#3b82f6" : "#ffffff"}
                    emissive={hovered ? "#1d4ed8" : "#000000"}
                    emissiveIntensity={hovered ? 2 : 0}
                />
            </mesh>

            {/* Label */}
            <Html position={[0, 0.5, 0]} center distanceFactor={10}>
                <div
                    className="bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap border border-white/20 select-none cursor-pointer hover:bg-blue-600/80 transition-colors"
                    onClick={handleClick}
                >
                    {bookmark.name}
                    <div className="text-[9px] text-neutral-400">Click to Fly</div>
                </div>
            </Html>
        </group>
    );
}
