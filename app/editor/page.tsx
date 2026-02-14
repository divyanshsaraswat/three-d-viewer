'use client';

import { useState, useEffect } from 'react';
import SceneViewer from '@/components/SceneViewer';
import Sidebar from '@/components/Sidebar';

export default function EditorPage() {
    interface LoadedModel {
        id: string;
        url: string;
        format: 'obj' | 'fbx' | 'gltf' | 'stl';
        filename: string;
    }

    const [models, setModels] = useState<LoadedModel[]>([]);

    // settings state remains same...
    const [settings, setSettings] = useState({
        bgColor: '#171717', // Neutral 900
        lightIntensity: 1,
        lightColor: '#ffffff',
        lightX: 10,
        lightY: 10,
        lightZ: 10
    });

    // Load settings from LocalStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('3d-viewer-settings');
            if (saved) {
                setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
            }
        } catch (e) {
            console.warn('Failed to access localStorage:', e);
        }
    }, []);

    // Save settings to LocalStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('3d-viewer-settings', JSON.stringify(settings));
        } catch (e) {
            // Ignore write errors (e.g. quota exceeded or access denied)
        }
    }, [settings]);

    const [fileMap, setFileMap] = useState<Map<string, string> | null>(null);

    const handleFileUpload = (files: FileList) => {
        const map = new Map<string, string>();
        const newModels: LoadedModel[] = [];

        // First pass: Create blobs for all files
        Array.from(files).forEach(file => {
            const path = file.name;
            const url = URL.createObjectURL(file);
            map.set(path, url);

            const name = file.name.toLowerCase();
            const isTexture = name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.webp') || name.endsWith('.tga') || name.endsWith('.bmp');

            if (isTexture) {
                console.log(`[Texture Added]: ${path} -> ${url}`);
            } else {
                console.log(`[File Mapped]: ${path} -> ${url}`);
            }

            let format: 'obj' | 'fbx' | 'gltf' | 'stl' | null = null;
            if (name.endsWith('.obj')) format = 'obj';
            else if (name.endsWith('.fbx')) format = 'fbx';
            else if (name.endsWith('.gltf') || name.endsWith('.glb')) format = 'gltf';
            else if (name.endsWith('.stl')) format = 'stl';

            if (format) {
                newModels.push({
                    id: crypto.randomUUID(),
                    url,
                    format,
                    filename: path
                });
            }
        });

        if (newModels.length > 0) {
            // Cleanup old blobs if we are replacing everything
            if (fileMap) {
                fileMap.forEach(url => URL.revokeObjectURL(url));
            }

            setFileMap(map);
            setModels(newModels);
        } else {
            alert('No supported 3D model file found in selection.');
        }
    };

    const handleCloseModel = () => {
        if (fileMap) {
            fileMap.forEach(url => URL.revokeObjectURL(url));
        }
        setFileMap(null);
        setModels([]);
    };

    return (
        <div className="w-screen h-screen overflow-hidden flex relative font-sans text-neutral-100">

            {/* Sidebar Overlay */}
            <Sidebar
                settings={settings}
                setSettings={setSettings}
                onCloseModel={handleCloseModel}
                onFileUpload={handleFileUpload}
                fileLoaded={models.length > 0}
            />

            {/* Main Scene Area */}
            <div className="flex-1 relative">
                <SceneViewer
                    models={models}
                    settings={settings}
                    fileMap={fileMap}
                />

                {models.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                            <h1 className="text-2xl font-light mb-2">Ready to View</h1>
                            <p className="text-neutral-400">Upload a 3D model from the sidebar to get started.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
