'use client';

import { useState, useEffect } from 'react';
import SceneViewer from '@/components/SceneViewer';
import Sidebar from '@/components/Sidebar';

export default function EditorPage() {
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [modelFormat, setModelFormat] = useState<'obj' | 'fbx' | 'gltf' | 'stl' | null>(null);

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
        const saved = localStorage.getItem('3d-viewer-settings');
        if (saved) {
            try {
                setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
    }, []);

    // Save settings to LocalStorage on change
    useEffect(() => {
        localStorage.setItem('3d-viewer-settings', JSON.stringify(settings));
    }, [settings]);

    const [fileMap, setFileMap] = useState<Map<string, string> | null>(null);

    const handleFileUpload = (files: FileList) => {
        const map = new Map<string, string>();
        let mainUrl: string | null = null;
        let mainFormat: 'obj' | 'fbx' | 'gltf' | 'stl' | null = null;

        // First pass: Create blobs for all files
        Array.from(files).forEach(file => {
            const path = file.name;
            const url = URL.createObjectURL(file);
            map.set(path, url);
            console.log('Mapped file:', path, '->', url); // Debug log

            const name = file.name.toLowerCase();
            if (name.endsWith('.obj') || name.endsWith('.fbx') || name.endsWith('.gltf') || name.endsWith('.glb') || name.endsWith('.stl')) {
                if (!mainUrl) { // Pick the first valid model file found
                    mainUrl = url;
                    if (name.endsWith('.obj')) mainFormat = 'obj';
                    else if (name.endsWith('.fbx')) mainFormat = 'fbx';
                    else if (name.endsWith('.gltf') || name.endsWith('.glb')) mainFormat = 'gltf';
                    else if (name.endsWith('.stl')) mainFormat = 'stl';
                }
            }
        });

        if (mainUrl && mainFormat) {
            if (fileMap) {
                fileMap.forEach(url => URL.revokeObjectURL(url));
            }

            setFileMap(map);
            setModelUrl(mainUrl);
            setModelFormat(mainFormat);
        } else {
            alert('No supported 3D model file found in selection.');
        }
    };

    const handleCloseModel = () => {
        if (fileMap) {
            fileMap.forEach(url => URL.revokeObjectURL(url));
        }
        setFileMap(null);
        setModelUrl(null);
        setModelFormat(null);
    };

    return (
        <div className="w-screen h-screen overflow-hidden flex relative font-sans text-neutral-100">

            {/* Sidebar Overlay */}
            <Sidebar
                settings={settings}
                setSettings={setSettings}
                onCloseModel={handleCloseModel}
                onFileUpload={handleFileUpload}
                fileLoaded={!!modelUrl}
            />

            {/* Main Scene Area */}
            <div className="flex-1 relative">
                <SceneViewer
                    modelUrl={modelUrl}
                    modelFormat={modelFormat}
                    settings={settings}
                    fileMap={fileMap}
                />

                {!modelUrl && (
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
