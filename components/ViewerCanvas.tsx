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

    // Track the boundary limits of the model for collision bounds handling
    const modelExtents = useRef<{ x: number, z: number } | null>(null);

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

            let hoveredMeshInfo: {
                instance: pc.MeshInstance,
                originalMaterial: pc.Material,
                highlightMaterial: pc.Material
            } | null = null;

            // Framebuffer Picker (hardware accelerated color-picking)
            const picker = new pc.Picker(app, 1024, 1024);

            const handlePicking = (x: number, y: number) => {
                // Resize picker to match canvas scale just in case
                const canvasW = canvasRef.current!.clientWidth;
                const canvasH = canvasRef.current!.clientHeight;
                if (picker.width !== canvasW || picker.height !== canvasH) {
                    picker.resize(canvasW, canvasH);
                }

                picker.prepare(camera.camera!, app!.scene);
                const selection = picker.getSelection(x, y);

                if (selection.length > 0) {
                    const pickedMeshInstance = selection[0] as pc.MeshInstance;

                    // If we clicked the same mesh, do nothing
                    if (hoveredMeshInfo && hoveredMeshInfo.instance === pickedMeshInstance) return;

                    // Restore previous mesh
                    if (hoveredMeshInfo) {
                        hoveredMeshInfo.instance.material = hoveredMeshInfo.originalMaterial;
                        // Clean up previous dynamically generated material to avoid memory leaks
                        if (hoveredMeshInfo.highlightMaterial) {
                            hoveredMeshInfo.highlightMaterial.destroy();
                        }
                    }

                    // Dynamically clone the exact material to preserve its textures and colors
                    const originalMaterial = pickedMeshInstance.material as pc.StandardMaterial;

                    // Backup the true original state before we ever apply custom textures to it
                    if (!(pickedMeshInstance as any)._hasBaseDiffuseMap) {
                        (pickedMeshInstance as any)._hasBaseDiffuseMap = true;
                        (pickedMeshInstance as any)._baseDiffuseMap = originalMaterial.diffuseMap;
                        if (originalMaterial.diffuseMapTiling) {
                            (pickedMeshInstance as any)._baseTiling = originalMaterial.diffuseMapTiling.clone();
                        }
                    }

                    const highlightMaterial = originalMaterial.clone();

                    // Boost the emissive property of the new clone to create a "glowing" overlay effect
                    // without washing out the actual diffuse textures/colors
                    highlightMaterial.emissive = new pc.Color(0.8, 1, 0); // Neon Yellow Glow
                    highlightMaterial.emissiveIntensity = 0.6; // Subtle blending glow

                    // If it has an emissive map already, we just tint it. If not, this adds a solid glow outline.
                    highlightMaterial.update();

                    // Highlight new mesh
                    hoveredMeshInfo = {
                        instance: pickedMeshInstance,
                        originalMaterial: originalMaterial,
                        highlightMaterial: highlightMaterial
                    };
                    pickedMeshInstance.material = highlightMaterial;
                    // Expose selection to the React side so we can apply textures to it
                    (app as any)._selectedMeshInstance = pickedMeshInstance;
                    // Note: _activeHoverInfo directly refers to hoveredMeshInfo, so modifying its properties modifies hoveredMeshInfo.
                    // If we set activeHover.highlightMaterial to null elsewhere, hoveredMeshInfo.highlightMaterial becomes null.
                    (app as any)._activeHoverInfo = hoveredMeshInfo;

                    // Trigger Zustand store so the Sidebar UI updates
                    useStore.getState().setSelectedMesh(pickedMeshInstance.node?.name || 'Unnamed Mesh');

                } else {
                    // Clicked empty space
                    if (hoveredMeshInfo) {
                        hoveredMeshInfo.instance.material = hoveredMeshInfo.originalMaterial;
                        if (hoveredMeshInfo.highlightMaterial) {
                            hoveredMeshInfo.highlightMaterial.destroy();
                        }
                        hoveredMeshInfo = null;

                        (app as any)._selectedMeshInstance = null;
                        (app as any)._activeHoverInfo = null;

                        useStore.getState().setSelectedMesh(null);
                    }
                }
            };

            // Listen for external deselect (e.g. TextureCarousel close button)
            const handleDeselectMesh = () => {
                if (hoveredMeshInfo) {
                    hoveredMeshInfo.instance.material = hoveredMeshInfo.originalMaterial;
                    if (hoveredMeshInfo.highlightMaterial) {
                        hoveredMeshInfo.highlightMaterial.destroy();
                    }
                    hoveredMeshInfo = null;
                    (app as any)._selectedMeshInstance = null;
                    (app as any)._activeHoverInfo = null;
                }
            };
            window.addEventListener('deselect-mesh', handleDeselectMesh);

            // Input handlers
            let isDragging = false;
            let lastMouseX = 0;
            let lastMouseY = 0;
            let dragDistance = 0;

            app.mouse?.on(pc.EVENT_MOUSEDOWN, (e: pc.MouseEvent) => {
                if (e.button === pc.MOUSEBUTTON_LEFT) {
                    isDragging = true;
                    lastMouseX = e.x;
                    lastMouseY = e.y;
                    dragDistance = 0;
                }
            });

            app.mouse?.on(pc.EVENT_MOUSEUP, (e: pc.MouseEvent) => {
                isDragging = false;
                // Ignore clicks that happened on the UI overlaid on top of the canvas
                if (e.event.target !== canvasRef.current) return;

                // If it was a click and not a drag, perform picking
                if (dragDistance < 5) {
                    handlePicking(e.x, e.y);
                }
            });

            app.mouse?.on(pc.EVENT_MOUSEMOVE, (e: pc.MouseEvent) => {
                if (isDragging) {
                    const dx = e.x - lastMouseX;
                    const dy = e.y - lastMouseY;
                    dragDistance += Math.abs(dx) + Math.abs(dy);
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

            // Touch Input Handlers
            if (pc.TouchDevice) {
                app.touch = new pc.TouchDevice(canvasRef.current!);
                let lastTouchX = 0;
                let lastTouchY = 0;
                let lastPinchDist = 0;
                let touchDragDistance = 0;

                app.touch.on(pc.EVENT_TOUCHSTART, (e: pc.TouchEvent) => {
                    if (e.touches.length === 1) {
                        lastTouchX = e.touches[0].x;
                        lastTouchY = e.touches[0].y;
                        touchDragDistance = 0;
                    } else if (e.touches.length === 2) {
                        const dx = e.touches[0].x - e.touches[1].x;
                        const dy = e.touches[0].y - e.touches[1].y;
                        lastPinchDist = Math.sqrt(dx * dx + dy * dy);
                    }
                    e.event.preventDefault();
                });

                app.touch.on(pc.EVENT_TOUCHEND, (e: pc.TouchEvent) => {
                    // Ignore clicks on UI elements
                    if ((e.event as Event).target !== canvasRef.current) return;

                    // Pick on tap
                    if (e.changedTouches.length === 1 && touchDragDistance < 10) {
                        const touch = e.changedTouches[0] as any;
                        const rect = canvasRef.current!.getBoundingClientRect();
                        const x = touch.x !== undefined ? touch.x : (touch.clientX - rect.left);
                        const y = touch.y !== undefined ? touch.y : (touch.clientY - rect.top);
                        handlePicking(x, y);
                    }
                });

                app.touch.on(pc.EVENT_TOUCHMOVE, (e: pc.TouchEvent) => {
                    if (e.touches.length === 1) {
                        const dx = e.touches[0].x - lastTouchX;
                        const dy = e.touches[0].y - lastTouchY;
                        touchDragDistance += Math.abs(dx) + Math.abs(dy);
                        orbitYaw.current -= dx * 0.3;
                        orbitPitch.current -= dy * 0.3;
                        orbitPitch.current = pc.math.clamp(orbitPitch.current, -89, 89);
                        lastTouchX = e.touches[0].x;
                        lastTouchY = e.touches[0].y;
                    } else if (e.touches.length === 2) {
                        if (!isMobile()) {
                            const dx = e.touches[0].x - e.touches[1].x;
                            const dy = e.touches[0].y - e.touches[1].y;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            // Pinch to zoom logic
                            const delta = lastPinchDist - dist;
                            orbitDistance.current += delta * 0.05;
                            orbitDistance.current = pc.math.clamp(orbitDistance.current, 0.5, 50);
                            lastPinchDist = dist;
                        }
                    }
                    e.event.preventDefault();
                });
            }

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
                // Handle WASD Walkover & Joystick (Tour Mode)
                else if (useStore.getState().settings.tourMode) {
                    const speed = 5; // Reduced by 50% from 10

                    // Keyboard input (WASD + Arrows)
                    let fwd = 0;
                    if (app!.keyboard?.isPressed(pc.KEY_W) || app!.keyboard?.isPressed(pc.KEY_UP)) fwd = 1;
                    else if (app!.keyboard?.isPressed(pc.KEY_S) || app!.keyboard?.isPressed(pc.KEY_DOWN)) fwd = -1;

                    let right = 0;
                    if (app!.keyboard?.isPressed(pc.KEY_D) || app!.keyboard?.isPressed(pc.KEY_RIGHT)) right = 1;
                    else if (app!.keyboard?.isPressed(pc.KEY_A) || app!.keyboard?.isPressed(pc.KEY_LEFT)) right = -1;

                    // Add joystick input
                    // Joy Y negative = pushed UP = forward (+1)
                    // Joy X positive = pushed RIGHT = right (+1)
                    const joy = useStore.getState().joystickInput;
                    fwd -= joy.y * 0.35;
                    right += joy.x * 0.35;

                    if (fwd !== 0) pivot.translateLocal(0, 0, -fwd * speed * dt);
                    if (right !== 0) pivot.translateLocal(right * speed * dt, 0, 0);

                    const p = pivot.getLocalPosition();

                    // Simple Bounding Box Collision
                    if (useStore.getState().settings.collisionEnabled && modelExtents.current) {
                        const pad = 0.5; // keep camera safely inside limits
                        const maxX = Math.max(0, modelExtents.current.x - pad);
                        const maxZ = Math.max(0, modelExtents.current.z - pad);
                        p.x = pc.math.clamp(p.x, -maxX, maxX);
                        p.z = pc.math.clamp(p.z, -maxZ, maxZ);
                    }

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
                            const entity = resource.instantiateRenderEntity() as pc.Entity;
                            entity.name = model.id;
                            container.addChild(entity);

                            // Calculate total bounding box to perfectly center the model
                            // and auto-adjust the orbit camera distance.
                            let aabb: pc.BoundingBox | null = null;
                            const renders = entity.findComponents('render') as any[];
                            renders.forEach(render => {
                                if (render.meshInstances) {
                                    render.meshInstances.forEach((mi: any) => {
                                        if (mi.aabb) {
                                            if (!aabb) {
                                                aabb = new pc.BoundingBox();
                                                aabb.copy(mi.aabb);
                                            } else {
                                                aabb.add(mi.aabb);
                                            }
                                        }
                                    });
                                }
                            });

                            if (aabb) {
                                const box = aabb as pc.BoundingBox;
                                // Move entity so that its geometric center becomes (0,0,0)
                                entity.translate(-box.center.x, -box.center.y, -box.center.z);

                                // Save bounds for collision handling
                                modelExtents.current = { x: box.halfExtents.x, z: box.halfExtents.z };

                                // Adjust camera distance based on model size
                                const maxDim = Math.max(box.halfExtents.x, box.halfExtents.y, box.halfExtents.z);
                                orbitDistance.current = Math.max(5, maxDim * 2.5);
                            }

                            // Model is now fully loaded and rendered — dismiss loading overlay
                            useStore.getState().setIsModelLoading(false);
                        }
                    }
                });

                asset.on('error', (err: any) => {
                    console.error("Failed to load model asset:", err);
                    useStore.getState().setIsModelLoading(false);
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

    // Handle Screenshot functionality
    useEffect(() => {
        const handleScreenshot = () => {
            if (!appRef.current) return;
            const app = appRef.current;
            app.on('postrender', function takeScreenshot() {
                app.off('postrender', takeScreenshot);

                const webglCanvas = app.graphicsDevice.canvas;
                const width = webglCanvas.width;
                const height = webglCanvas.height;
                const dpr = width / webglCanvas.clientWidth;

                // Temporary 2D Canvas
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const ctx = tempCanvas.getContext('2d');
                if (!ctx) return;

                // Draw WebGL Output
                ctx.drawImage(webglCanvas, 0, 0);

                // Draw Watermark
                const bottom = 32 * dpr;
                const left = 32 * dpr;

                const titleSize = 36 * dpr;
                const subSize = 12 * dpr;
                const gap = 4 * dpr;

                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';

                // Drop shadow to match UI
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 10 * dpr;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4 * dpr;

                const startY = height - bottom - titleSize - gap - subSize;

                // "WEINIX"
                ctx.font = `900 ${titleSize}px system-ui, -apple-system, sans-serif`;
                if ('letterSpacing' in ctx) {
                    (ctx as any).letterSpacing = '-2px';
                }
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillText('WEINIX', left, startY);

                // "A 3D EXPERIENCE"
                ctx.font = `bold ${subSize}px system-ui, -apple-system, sans-serif`;
                if ('letterSpacing' in ctx) {
                    (ctx as any).letterSpacing = '0.3em';
                }
                ctx.fillStyle = '#ccff00';
                ctx.fillText('A 3D EXPERIENCE', left, startY + titleSize + gap);

                // Export and Download
                const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `WEINIX_3D_Screenshot_${new Date().getTime()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Notify UI that the process is finished
                window.dispatchEvent(new CustomEvent('screenshot-complete'));
            });
            app.renderNextFrame = true;
        };

        window.addEventListener('take-screenshot', handleScreenshot);
        return () => window.removeEventListener('take-screenshot', handleScreenshot);
    }, []);

    // Handle Texture Application
    const pendingTexture = useStore(state => state.pendingTexture);
    const clearPendingTexture = useStore(state => state.clearPendingTexture);

    useEffect(() => {
        if (!pendingTexture || !appRef.current) return;

        const app = appRef.current;
        const targetMesh = (app as any)._selectedMeshInstance as pc.MeshInstance;

        if (!targetMesh) {
            console.warn("No mesh selected to apply texture to.");
            clearPendingTexture();
            return;
        }

        if (pendingTexture.url === 'RESET') {
            const baseMap = (targetMesh as any)._baseDiffuseMap;
            const baseTiling = (targetMesh as any)._baseTiling;

            const material = targetMesh.material as pc.StandardMaterial;
            material.diffuseMap = baseMap || null;
            if (baseTiling) {
                material.diffuseMapTiling.copy(baseTiling);
            } else {
                material.diffuseMapTiling.set(1, 1);
            }
            material.update();

            const activeHover = (app as any)._activeHoverInfo;
            if (activeHover && activeHover.instance === targetMesh) {
                activeHover.originalMaterial.diffuseMap = baseMap || null;
                if (baseTiling) {
                    activeHover.originalMaterial.diffuseMapTiling.copy(baseTiling);
                } else {
                    activeHover.originalMaterial.diffuseMapTiling.set(1, 1);
                }
                activeHover.originalMaterial.update();
            }

            clearPendingTexture();
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            // Create a PlayCanvas Texture directly from the loaded HTMLImageElement
            // This bypasses PlayCanvas's strict Asset loader which fails on extensionless blob:// URLs
            const texture = new pc.Texture(app.graphicsDevice, {
                width: img.width,
                height: img.height,
                format: pc.PIXELFORMAT_R8_G8_B8_A8
            });
            texture.setSource(img);

            // Ensure tile repeating instead of stretching
            texture.addressU = pc.ADDRESS_REPEAT;
            texture.addressV = pc.ADDRESS_REPEAT;

            // The currently active target mesh material is the yellow highlight glow.
            // We want to clone the original unhighlighted material instead.
            let sourceMaterial = targetMesh.material as pc.StandardMaterial;
            const activeHover = (app as any)._activeHoverInfo;
            if (activeHover && activeHover.instance === targetMesh) {
                sourceMaterial = activeHover.originalMaterial;
            }

            if (!(targetMesh as any)._hasCustomMaterial) {
                // Clone the base material, not the highlight
                sourceMaterial = sourceMaterial.clone();
                (targetMesh as any)._hasCustomMaterial = true;

                // Update the original active hover material reference to our new isolated clone
                if (activeHover && activeHover.instance === targetMesh) {
                    activeHover.originalMaterial = sourceMaterial;
                }
            }

            const material = sourceMaterial;
            material.diffuseMap = texture;
            material.diffuseMapTiling.set(5, 5); // Tile 5x5 by default
            material.update();

            // Also update the originalMaterial reference so the picker doesn't wipe it
            if (activeHover && activeHover.instance === targetMesh) {
                // If the hover state is holding the old shared material, we need to update its reference
                activeHover.originalMaterial = material;

                // User Request: Remove the yellow highlight glow immediately after applying texture
                // but keep it technically "selected" in the UI.
                activeHover.instance.material = material;
                if (activeHover.highlightMaterial) {
                    activeHover.highlightMaterial.destroy();
                    activeHover.highlightMaterial = null;
                }
            }

            clearPendingTexture();
        };

        img.onerror = (err) => {
            console.error("Failed to load local texture blob via Image tag:", err);
            clearPendingTexture();
        };

        img.src = pendingTexture.url;

    }, [pendingTexture, clearPendingTexture]);

    const pendingTextureOptions = useStore(state => state.pendingTextureOptions);
    const clearPendingTextureOptions = useStore(state => state.clearPendingTextureOptions);

    useEffect(() => {
        if (!pendingTextureOptions || !appRef.current) return;
        const app = appRef.current;
        const targetMesh = (app as any)._selectedMeshInstance as pc.MeshInstance;

        if (targetMesh && targetMesh.material) {
            let sourceMaterial = targetMesh.material as pc.StandardMaterial;
            const currentActiveHover = (app as any)._activeHoverInfo;
            if (currentActiveHover && currentActiveHover.instance === targetMesh) {
                sourceMaterial = currentActiveHover.originalMaterial;
            }

            // Clone if not already custom so tiling changes don't affect shared instances
            if (!(targetMesh as any)._hasCustomMaterial) {
                sourceMaterial = sourceMaterial.clone();
                (targetMesh as any)._hasCustomMaterial = true;

                if (currentActiveHover && currentActiveHover.instance === targetMesh) {
                    currentActiveHover.originalMaterial = sourceMaterial;
                }
            }

            const material = sourceMaterial;

            if (pendingTextureOptions.tiling) {
                material.diffuseMapTiling.set(pendingTextureOptions.tiling[0], pendingTextureOptions.tiling[1]);
            }
            if (pendingTextureOptions.offset) {
                material.diffuseMapOffset.set(pendingTextureOptions.offset[0], pendingTextureOptions.offset[1]);
            }
            material.update();

            if (currentActiveHover && currentActiveHover.instance === targetMesh) {
                // Update original material reference if the picking hover is active
                currentActiveHover.originalMaterial = material;
                currentActiveHover.instance.material = material; // Ensure the instance uses the updated material

                if (currentActiveHover.highlightMaterial) {
                    currentActiveHover.highlightMaterial.destroy();
                    currentActiveHover.highlightMaterial = null;
                }
            } else {
                targetMesh.material = material;
            }
        }
        clearPendingTextureOptions();
    }, [pendingTextureOptions, clearPendingTextureOptions]);

    return (
        <canvas ref={canvasRef} className="w-full h-full block" />
    );
}
