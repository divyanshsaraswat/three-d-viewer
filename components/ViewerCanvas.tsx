'use client';

import { useEffect, useRef } from 'react';
import * as pc from 'playcanvas';
import { useStore } from '@/store/useStore';
import { isMobile } from '@/utils/device';

export default function ViewerCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const appRef = useRef<pc.Application | null>(null);
    const models = useStore(state => state.models);
    const bgColor = useStore(state => state.settings.bgColor);
    const autoRotate = useStore(state => state.settings.autoRotate);
    const tourMode = useStore(state => state.settings.tourMode);
    const tourHeight = useStore(state => state.settings.tourHeight);

    // Light settings
    const lightIntensity = useStore(state => state.settings.lightIntensity);
    const lightColor = useStore(state => state.settings.lightColor);
    const lightX = useStore(state => state.settings.lightX);
    const lightY = useStore(state => state.settings.lightY);
    const lightZ = useStore(state => state.settings.lightZ);

    // Bookmarks actions
    const capturePending = useStore(state => state.capturePending);
    const addBookmark = useStore(state => state.addBookmark);
    const clearCapture = useStore(state => state.clearCapture);

    // Hold references to entities
    const pivotRef = useRef<pc.Entity | null>(null);
    const cameraRef = useRef<pc.Entity | null>(null);
    const modelContainerRef = useRef<pc.Entity | null>(null);

    // Orbit/Tour State
    const orbitDistance = useRef(5);
    const orbitPitch = useRef(0); // vertical
    const orbitYaw = useRef(0);   // horizontal

    // Tween State
    const tweenState = useRef<{
        active: boolean; t: number;
        startPos: pc.Vec3; endPos: pc.Vec3;
        startPitch: number; endPitch: number;
        startYaw: number; endYaw: number;
    } | null>(null);

    // Bookmark Capturing
    useEffect(() => {
        if (capturePending && pivotRef.current) {
            const p = pivotRef.current.getPosition();
            addBookmark({
                id: pc.math.random(0, 100000).toString(),
                name: `Saved View`,
                position: [p.x, p.y, p.z],
                rotation: [orbitPitch.current, orbitYaw.current, 0]
            });
            clearCapture();
        }
    }, [capturePending]);

    // Bookmark Restoration Listener
    useEffect(() => {
        const handleRestore = (e: any) => {
            if (!pivotRef.current) return;
            const b = e.detail;
            tweenState.current = {
                active: true,
                t: 0,
                startPos: pivotRef.current.getPosition().clone(),
                endPos: new pc.Vec3(b.position[0], b.position[1], b.position[2]),
                startPitch: orbitPitch.current,
                endPitch: b.rotation[0],
                startYaw: orbitYaw.current,
                endYaw: b.rotation[1]
            };
        };
        window.addEventListener('restore-bookmark', handleRestore);
        return () => window.removeEventListener('restore-bookmark', handleRestore);
    }, []);

    // Initialize PlayCanvas Engine
    useEffect(() => {
        if (!canvasRef.current) return;

        let app = appRef.current;
        if (!app) {
            // Configure Draco Decoder
            pc.WasmModule.setConfig('DracoDecoderModule', {
                glueUrl: '/draco/draco.wasm.js',
                wasmUrl: '/draco/draco.wasm.wasm',
                fallbackUrl: '/draco/draco.js'
            });

            app = new pc.Application(canvasRef.current, {
                mouse: new pc.Mouse(canvasRef.current),
                touch: new pc.TouchDevice(canvasRef.current),
                keyboard: new pc.Keyboard(window),
                graphicsDeviceOptions: {
                    antialias: !isMobile(),
                    alpha: false,
                    preserveDrawingBuffer: false,
                    powerPreference: 'high-performance',
                    preferWebGl2: true,
                }
            });

            app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            app.setCanvasResolution(pc.RESOLUTION_AUTO);
            app.graphicsDevice.maxPixelRatio = Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2);
            window.addEventListener('resize', () => app?.resizeCanvas());

            appRef.current = app;
            app.start();

            // Increase ambient light drastically since we don't have an HDRI skybox yet
            app.scene.ambientLight = new pc.Color(0.8, 0.8, 0.8);

            // 1. Pivot for Orbit/Movement
            const pivot = new pc.Entity('pivot');
            app.root.addChild(pivot);
            pivotRef.current = pivot;

            // 2. Camera
            const camera = new pc.Entity('camera');
            camera.addComponent('camera', {
                clearColor: new pc.Color(0.1, 0.1, 0.1, 1),
                fov: 50,
                nearClip: 0.1,
                farClip: 1000
            });
            pivot.addChild(camera);
            cameraRef.current = camera;

            // Container for models
            const container = new pc.Entity('models');
            app.root.addChild(container);
            modelContainerRef.current = container;

            // 3. Directional Light
            const light = new pc.Entity('light');
            light.addComponent('light', {
                type: 'directional',
                color: new pc.Color().fromString(useStore.getState().settings.lightColor),
                intensity: useStore.getState().settings.lightIntensity,
                castShadows: !isMobile(),
                shadowDistance: 20,
                shadowResolution: 2048
            });
            // We set the initial position, but actually a directional light uses rotation for direction.
            // When translating XYZ to rotation, it's easier if we treat XYZ as a position we want the light to look at 0,0,0 from.
            light.setLocalPosition(
                useStore.getState().settings.lightX,
                useStore.getState().settings.lightY,
                useStore.getState().settings.lightZ
            );
            light.lookAt(0, 0, 0);

            app.root.addChild(light);
            // We'll save the light reference on the app object to easily find it later
            (app as any)._dirLight = light;

            // Input handlers
            let isDragging = false;
            let lastMouseX = 0;
            let lastMouseY = 0;

            app.mouse?.on(pc.EVENT_MOUSEDOWN, (e: pc.MouseEvent) => {
                if (e.button === pc.MOUSEBUTTON_LEFT) {
                    isDragging = true;
                    lastMouseX = e.x;
                    lastMouseY = e.y;
                }
            });

            app.mouse?.on(pc.EVENT_MOUSEUP, () => { isDragging = false; });
            app.mouse?.on(pc.EVENT_MOUSEMOVE, (e: pc.MouseEvent) => {
                if (isDragging) {
                    const dx = e.x - lastMouseX;
                    const dy = e.y - lastMouseY;
                    orbitYaw.current -= dx * 0.2;
                    orbitPitch.current -= dy * 0.2;
                    orbitPitch.current = pc.math.clamp(orbitPitch.current, -89, 89);
                    lastMouseX = e.x;
                    lastMouseY = e.y;
                }
            });

            app.mouse?.on(pc.EVENT_MOUSEWHEEL, (e: pc.MouseEvent) => {
                orbitDistance.current += e.wheelDelta * 0.5;
                orbitDistance.current = pc.math.clamp(orbitDistance.current, 0.5, 50);
            });

            // Update Loop
            app.on('update', (dt: number) => {
                // Handle Bookmark Tweening
                if (tweenState.current && tweenState.current.active) {
                    const ts = tweenState.current;
                    ts.t += dt * 1.5; // 0.6s duration roughly
                    if (ts.t >= 1) {
                        ts.active = false;
                        ts.t = 1;
                    }
                    const ease = 1 - Math.pow(1 - ts.t, 3);

                    const newPos = new pc.Vec3().lerp(ts.startPos, ts.endPos, ease);
                    pivot.setPosition(newPos);
                    orbitPitch.current = pc.math.lerp(ts.startPitch, ts.endPitch, ease);
                    orbitYaw.current = pc.math.lerp(ts.startYaw, ts.endYaw, ease);
                }
                // Handle WASD Walkover (Tour Mode)
                else if (useStore.getState().settings.tourMode) {
                    const speed = 10;
                    const fwd = app!.keyboard?.isPressed(pc.KEY_W) ? 1 : (app!.keyboard?.isPressed(pc.KEY_S) ? -1 : 0);
                    const right = app!.keyboard?.isPressed(pc.KEY_D) ? 1 : (app!.keyboard?.isPressed(pc.KEY_A) ? -1 : 0);

                    if (fwd !== 0) pivot.translateLocal(0, 0, -fwd * speed * dt);
                    if (right !== 0) pivot.translateLocal(right * speed * dt, 0, 0);

                    const p = pivot.getLocalPosition();
                    p.y = useStore.getState().settings.tourHeight;
                    pivot.setLocalPosition(p);
                }

                // Apply current pitch & yaw to Pivot
                pivot.setLocalEulerAngles(orbitPitch.current, orbitYaw.current, 0);

                // Keep camera locked to distance 
                // (if TourMode active, orbitDistance implicitly becomes 0 to simulate walking)
                camera.setLocalPosition(0, 0, useStore.getState().settings.tourMode ? 0 : orbitDistance.current);
            });
        }

        return () => {
            if (appRef.current) {
                appRef.current.destroy();
                appRef.current = null;
            }
        };
    }, []);

    // Sync Background Color
    useEffect(() => {
        if (!appRef.current || !cameraRef.current) return;
        const temp = document.createElement('div');
        temp.style.color = bgColor;
        document.body.appendChild(temp);
        const style = getComputedStyle(temp).color;
        document.body.removeChild(temp);

        const m = style.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (m) {
            cameraRef.current.camera!.clearColor = new pc.Color(parseInt(m[1]) / 255, parseInt(m[2]) / 255, parseInt(m[3]) / 255, 1);
        }
    }, [bgColor]);

    // Handle Model Loading
    useEffect(() => {
        const app = appRef.current;
        const container = modelContainerRef.current;
        if (!app || !container) return;

        // Cleanup removed models
        const currentModelIds = new Set(models.map(m => m.id));
        // copy the children array with .slice() to safely iterate while removing
        const childrenToRemove = container.children.slice().filter(child => !currentModelIds.has(child.name));
        childrenToRemove.forEach(child => child.destroy());

        models.forEach(model => {
            const existing = container.findByName(model.id);
            if (!existing) {
                // Explicitly define the asset with its original filename 
                // so PlayCanvas can correctly deduce the parser (e.g. .glb parser) from Blob URLs
                const asset = new pc.Asset(model.filename, "container", {
                    url: model.url,
                    filename: model.filename
                });

                asset.ready((loadedAsset: pc.Asset) => {
                    if (loadedAsset.resource) {
                        const resource = loadedAsset.resource as any;
                        if (resource.instantiateRenderEntity) {
                            const entity = resource.instantiateRenderEntity();
                            entity.name = model.id;
                            container.addChild(entity);
                        }
                    }
                });

                asset.on('error', (err: any) => {
                    console.error("Failed to load model asset:", err);
                });

                app.assets.add(asset);
                app.assets.load(asset);
            }
        });
    }, [models]);

    // AutoRotate Sync
    useEffect(() => {
        if (!appRef.current) return;
        const app = appRef.current;
        const cb = (dt: number) => {
            if (autoRotate && !tourMode) {
                orbitYaw.current += 10 * dt;
            }
        };
        app.on('update', cb);
        return () => { app.off('update', cb); };
    }, [autoRotate, tourMode]);

    // Sync Light Settings dynamically when changed from the UI
    useEffect(() => {
        if (!appRef.current) return;
        const dirLight = (appRef.current as any)._dirLight as pc.Entity;
        if (dirLight && dirLight.light) {
            dirLight.light.intensity = lightIntensity;
            dirLight.light.color = new pc.Color().fromString(lightColor);
            dirLight.setLocalPosition(lightX, lightY, lightZ);
            dirLight.lookAt(0, 0, 0);
        }
    }, [lightIntensity, lightColor, lightX, lightY, lightZ]);

    return (
        <canvas ref={canvasRef} className="w-full h-full block" />
    );
}
