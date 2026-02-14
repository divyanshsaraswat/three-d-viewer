'use client';

import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { useMemo } from 'react';

interface ModelLoaderProps {
    url: string;
    format: 'obj' | 'fbx' | 'gltf' | 'stl';
    fileMap?: Map<string, string> | null;
}

function useLoadingManager(fileMap?: Map<string, string> | null) {
    return useMemo(() => {
        const manager = new THREE.LoadingManager();
        if (fileMap) {
            manager.setURLModifier((url) => {
                // Simple filename extraction
                const fileName = url.split('/').pop();
                if (fileName && fileMap.has(fileName)) {
                    return fileMap.get(fileName)!;
                }

                // Also check if the URL is relative to the root or just a filename
                // Some loaders might pass "textures/foo.png"
                // We will try to match "foo.png" in our flat map
                const pathParts = url.split('/');
                // Try exact match first (unlikely with blob urls involved in base)
                if (fileMap.has(url)) return fileMap.get(url)!;

                // Try matching the last part (filename)
                // This assumes a flat structure in our map which is what we built in page.tsx
                for (const part of pathParts.reverse()) {
                    if (fileMap.has(part)) {
                        console.log('Redirecting:', url, '->', part, '->', fileMap.get(part)); // Debug log
                        return fileMap.get(part)!;
                    }
                }

                console.warn('Could not find mapping for:', url); // Debug log
                return url;
            });
        }
        return manager;
    }, [fileMap]);
}

function OBJModel({ url, manager }: { url: string, manager?: THREE.LoadingManager }) {
    const obj = useLoader(OBJLoader, url, (loader) => {
        if (manager) loader.manager = manager;
    });
    const scene = useMemo(() => obj.clone(), [obj]);
    return <primitive object={scene} />;
}

function FBXModel({ url, manager }: { url: string, manager?: THREE.LoadingManager }) {
    const fbx = useLoader(FBXLoader, url, (loader) => {
        if (manager) loader.manager = manager;
    });
    const scene = useMemo(() => fbx.clone(), [fbx]);
    return <primitive object={scene} />;
}

function GLTFModel({ url, manager }: { url: string, manager?: THREE.LoadingManager }) {
    const gltf = useLoader(GLTFLoader, url, (loader) => {
        if (manager) loader.manager = manager;
    });
    const scene = useMemo(() => gltf.scene.clone(), [gltf]);
    return <primitive object={scene} />;
}

function STLModel({ url, manager }: { url: string, manager?: THREE.LoadingManager }) {
    const stl = useLoader(STLLoader, url, (loader) => {
        if (manager) loader.manager = manager;
    });

    // Wrap geometry in a mesh for rendering
    const mesh = useMemo(() => {
        const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        return new THREE.Mesh(stl, material);
    }, [stl]);

    return <primitive object={mesh} />;
}

export default function ModelLoader({ url, format, fileMap }: ModelLoaderProps) {
    if (!url) return null;

    const manager = useLoadingManager(fileMap);

    switch (format) {
        case 'obj':
            return <OBJModel url={url} manager={manager} />;
        case 'fbx':
            return <FBXModel url={url} manager={manager} />;
        case 'gltf':
            return <GLTFModel url={url} manager={manager} />;
        case 'stl':
            return <STLModel url={url} manager={manager} />;
        default:
            return null;
    }
}
