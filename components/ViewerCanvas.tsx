'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, AdaptiveDpr, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, memo, useMemo } from 'react';
import ModelLoader from './ModelLoader';
import ErrorBoundary from './ErrorBoundary';
import AdaptiveQuality from './AdaptiveQuality';
import { isMobile } from '@/utils/device';
import FirstPersonController from './FirstPersonController';
import { useStore } from '@/store/useStore';
import SceneLights from './SceneLights';
import BookmarkManager from './BookmarkManager';
import SceneBookmarks from './SceneBookmarks';

interface LoadedModel {
    id: string;
    url: string;
    format: 'obj' | 'fbx' | 'gltf' | 'stl';
}

// Memoized component for the heavy model scene
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

function ViewerCanvasComponent() {
    const models = useStore(state => state.models);
    const fileMap = useStore(state => state.fileMap);
    const dynamicFocus = useStore(state => state.settings.dynamicFocus);
    const tourMode = useStore(state => state.settings.tourMode);
    const autoRotate = useStore(state => state.settings.autoRotate);

    const mobile = isMobile();

    const glConfig = useMemo(() => ({
        powerPreference: "high-performance" as const,
        antialias: !mobile,
        stencil: false,
        depth: true,
        precision: mobile ? 'mediump' as const : 'highp' as const
    }), [mobile]);

    const cameraConfig = useMemo(() => ({
        position: [0, 0, 5] as [number, number, number],
        fov: 50
    }), []);

    return (
        <Canvas
            shadows={!mobile}
            dpr={mobile ? 1 : [1, 2]}
            camera={cameraConfig}
            gl={glConfig}
            performance={{ min: 0.5 }}
        >
            <AdaptiveQuality />
            {dynamicFocus && <AdaptiveDpr pixelated />}

            <Suspense fallback={null}>
                <SceneLights />
                <BookmarkManager />
                <SceneBookmarks />
                <ModelScene models={models} fileMap={fileMap} />
            </Suspense>

            {tourMode ? (
                <FirstPersonController />
            ) : (
                <OrbitControls
                    makeDefault
                    autoRotate={autoRotate}
                    autoRotateSpeed={2.0}
                    // @ts-ignore
                    regresses={dynamicFocus}
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
    );
}

// Memoize the entire Canvas wrapper to prevent re-renders from parent (SceneViewer)
const ViewerCanvas = memo(ViewerCanvasComponent);
ViewerCanvas.displayName = 'ViewerCanvas';

export default ViewerCanvas;
