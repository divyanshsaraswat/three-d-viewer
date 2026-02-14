'use client';

import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// @ts-ignore
import { KHRMaterialsPbrSpecularGlossinessExtension } from './extensions/KHR_materials_pbrSpecularGlossiness.js';
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
                console.log(`[Loader Request]: ${url}`); // Explicit log for every request

                // Simple filename extraction
                const fileName = url.split('/').pop();
                if (fileName && fileMap.has(fileName)) {
                    return fileMap.get(fileName)!;
                }

                // Also check if the URL is relative to the root or just a filename
                // Some loaders might pass "textures/foo.png"
                // We will try to match "foo.png" in our flat map
                // Normalize URL
                const normalizedUrl = decodeURIComponent(url);
                const pathParts = normalizedUrl.split('/');

                // Try matching the last part (filename)
                for (const part of pathParts.reverse()) {
                    if (fileMap.has(part)) {
                        console.log('Redirecting:', url, '->', part, '->', fileMap.get(part));
                        return fileMap.get(part)!;
                    }

                    // Case-insensitive fallback
                    const lowerPart = part.toLowerCase();
                    for (const [key, val] of Array.from(fileMap.entries())) {
                        if (key.toLowerCase() === lowerPart) {
                            console.log('Redirecting (case-insensitive):', url, '->', key, '->', val);
                            return val;
                        }
                    }

                    // Extension-agnostic fallback (e.g. request .png but have .jpg)
                    const basename = part.substring(0, part.lastIndexOf('.'));
                    if (basename.length > 3) { // Avoid matching short names excessively
                        const lowerBasename = basename.toLowerCase();
                        for (const [key, val] of Array.from(fileMap.entries())) {
                            const keyBasename = key.substring(0, key.lastIndexOf('.'));
                            if (keyBasename.toLowerCase() === lowerBasename) {
                                console.log('Redirecting (fuzzy/ext-mismatch):', url, '->', key, '->', val);
                                return val;
                            }
                        }
                    }
                }

                // Match failed.
                // If the URL is already a blob (likely the entry point model file itself),
                // just pass it through without warning.
                if (url.startsWith('blob:')) {
                    return url;
                }

                console.warn('Could not find mapping for:', url);
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
        loader.register((parser) => new KHRMaterialsPbrSpecularGlossinessExtension(parser));
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
