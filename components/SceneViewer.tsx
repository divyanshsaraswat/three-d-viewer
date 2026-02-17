'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, AdaptiveDpr, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, memo } from 'react';
import ModelLoader from './ModelLoader';
import ErrorBoundary from './ErrorBoundary';

interface LoadedModel {
    id: string;
    url: string;
    format: 'obj' | 'fbx' | 'gltf' | 'stl';
}

interface SceneViewerProps {
    models: LoadedModel[];
    settings: {
        bgColor: string;
        lightIntensity: number;
        lightColor: string;
        lightX: number;
        lightY: number;
        lightZ: number;
        dynamicFocus: boolean;
        tourMode: boolean;
    };
    fileMap?: Map<string, string> | null;
}

// Separate component for lights to isolate re-renders when settings change
const SceneLights = ({ settings }: { settings: SceneViewerProps['settings'] }) => {
    return (
        <>
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
        </>
    );
};

// Memoized component for the heavy model scene
// This will NOT re-render when light settings change, preventing lag
const ModelScene = memo(({ models, fileMap }: { models: LoadedModel[], fileMap?: Map<string, string> | null }) => {
    return (
        <>
            {models.length > 0 && (
                <Stage environment="city" intensity={0.6}>
                    {models.map((model) => (
                        <ErrorBoundary key={model.id}>
                            <ModelLoader url={model.url} format={model.format} fileMap={fileMap} />
                        </ErrorBoundary>
                    ))}
                </Stage>
            )}
        </>
    );
});

ModelScene.displayName = 'ModelScene';

import AdaptiveQuality from './AdaptiveQuality';

import { isMobile } from '@/utils/device';

import FirstPersonController from './FirstPersonController';

// ...

export default function SceneViewer({ models, settings, fileMap }: SceneViewerProps) {
    const mobile = isMobile();

    return (
        <div className="w-full h-full relative" style={{ backgroundColor: settings.bgColor }}>
            <Canvas
                shadows={!mobile}
                dpr={mobile ? 1 : [1, 2]}
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{
                    powerPreference: "high-performance",
                    antialias: !mobile,
                    stencil: false,
                    depth: true,
                    precision: mobile ? 'mediump' : 'highp'
                }}
                performance={{ min: 0.5 }}
            >
                <AdaptiveQuality />
                {settings.dynamicFocus && <AdaptiveDpr pixelated />}

                <Suspense fallback={null}>
                    <SceneLights settings={settings} />
                    <ModelScene models={models} fileMap={fileMap} />
                </Suspense>

                {settings.tourMode ? (
                    <FirstPersonController />
                ) : (
                    <OrbitControls
                        makeDefault
                        autoRotate
                        autoRotateSpeed={2.0}
                        // @ts-ignore
                        regresses={settings.dynamicFocus}
                    />
                )}

                <Grid
                    position={[0, -0.01, 0]}
                    args={[10.5, 10.5]}
                    cellSize={0.6}
                    cellThickness={0.6}
                    cellColor={new THREE.Color('#6f6f6f')}
                    sectionSize={3.3}
                    sectionThickness={1.5}
                    sectionColor={new THREE.Color('#9d4b4b')}
                    fadeDistance={30}
                    infiniteGrid
                    fadeStrength={5}
                />
                <axesHelper args={[5]} />
            </Canvas>

            {/* Tour Mode Instructions Overlay */}
            {settings.tourMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur pointer-events-none">
                    Click to Start • WASD to Move • ESC to Exit
                </div>
            )}
        </div>
    );
}
