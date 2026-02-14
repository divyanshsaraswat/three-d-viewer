'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import ModelLoader from './ModelLoader';
import ErrorBoundary from './ErrorBoundary';

interface SceneViewerProps {
    modelUrl: string | null;
    modelFormat: 'obj' | 'fbx' | 'gltf' | 'stl' | null;
    settings: {
        bgColor: string;
        lightIntensity: number;
        lightColor: string;
        lightX: number;
        lightY: number;
        lightZ: number;
    };
    fileMap?: Map<string, string> | null;
}

export default function SceneViewer({ modelUrl, modelFormat, settings, fileMap }: SceneViewerProps) {
    return (
        <div className="w-full h-full relative" style={{ backgroundColor: settings.bgColor }}>
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight
                        position={[settings.lightX, settings.lightY, settings.lightZ]}
                        intensity={settings.lightIntensity}
                        color={settings.lightColor}
                        castShadow
                    />
                    {/* Visual Helper for Light Source */}
                    <mesh position={[settings.lightX, settings.lightY, settings.lightZ]}>
                        <sphereGeometry args={[0.5, 32, 32]} />
                        <meshBasicMaterial color={settings.lightColor} />
                    </mesh>
                    {modelUrl && modelFormat && (
                        <Stage environment="city" intensity={0.6}>
                            <ErrorBoundary>
                                <ModelLoader url={modelUrl} format={modelFormat} fileMap={fileMap} />
                            </ErrorBoundary>
                        </Stage>
                    )}
                </Suspense>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={2.0} />
                <gridHelper args={[20, 20, 0x444444, 0x222222]} />
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    );
}
