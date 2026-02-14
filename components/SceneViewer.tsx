'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
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

export default function SceneViewer({ models, settings, fileMap }: SceneViewerProps) {
    return (
        <div className="w-full h-full relative" style={{ backgroundColor: settings.bgColor }}>
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
                <Suspense fallback={null}>
                    <SceneLights settings={settings} />
                    <ModelScene models={models} fileMap={fileMap} />
                </Suspense>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={2.0} />
                <gridHelper args={[20, 20, 0x444444, 0x222222]} />
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    );
}
