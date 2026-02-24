import { X, ChevronLeft, ChevronRight, Upload, ZoomIn, ZoomOut, Move, RotateCw, Trash2 } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { useStore, LoadedModel } from '@/store/useStore';

function DraggableNumberInput({ value, onChange, step = 0.5 }: { value: number, onChange: (val: number) => void, step?: number }) {
    const [displayValue, setDisplayValue] = useState(value);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startValueRef = useRef(0);
    const currentValueRef = useRef(value);

    // Sync local display value if external value changes (and not dragging)
    if (!isDraggingRef.current && displayValue !== value) {
        setDisplayValue(value);
    }

    const handleMouseMoveRef = useCallback((e: MouseEvent) => {
        if (!isDraggingRef.current) return;

        const delta = e.clientX - startXRef.current;
        const currentStep = step;
        const change = Math.round(delta / 5) * currentStep;

        const newValue = parseFloat((startValueRef.current + change).toFixed(1));
        setDisplayValue(newValue);
        currentValueRef.current = newValue;
    }, [step]);

    const handleMouseUpRef = useCallback(() => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            document.body.style.cursor = 'default';
            document.removeEventListener('mousemove', handleMouseMoveRef);
            document.removeEventListener('mouseup', handleMouseUpRef);

            onChange(currentValueRef.current); // Commit change
        }
    }, [handleMouseMoveRef, onChange]);


    const handleMouseDown = (e: React.MouseEvent) => {
        isDraggingRef.current = true;
        startXRef.current = e.clientX;
        startValueRef.current = value;
        currentValueRef.current = value; // Reset current value tracking
        document.body.style.cursor = 'ew-resize';

        document.addEventListener('mousemove', handleMouseMoveRef);
        document.addEventListener('mouseup', handleMouseUpRef);
    };

    return (
        <div
            className="w-full bg-neutral-800 rounded px-2 py-1 text-xs text-center cursor-ew-resize select-none hover:bg-neutral-700 transition-colors"
            onMouseDown={handleMouseDown}
        >
            {displayValue}
        </div>
    );
}

export default function Sidebar() {
    const settings = useStore(state => state.settings);
    const updateSetting = useStore(state => state.updateSetting);
    const models = useStore(state => state.models);
    const setModels = useStore(state => state.setModels);
    const setFileMap = useStore(state => state.setFileMap);

    const fileLoaded = models.length > 0;
    const [collapsed, setCollapsed] = useState(false);

    const selectedMeshId = useStore(state => state.selectedMeshId);
    const applyTexture = useStore(state => state.applyTexture);

    const handleTextureUpload = (files: FileList) => {
        if (files.length > 0 && selectedMeshId) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            applyTexture(selectedMeshId, url);
        }
    };

    const handleCloseModel = () => {
        const currentFileMap = useStore.getState().fileMap;
        if (currentFileMap) {
            currentFileMap.forEach(url => URL.revokeObjectURL(url));
        }
        setFileMap(null);
        setModels([]);
    };

    const handleFileUpload = (files: FileList) => {
        const map = new Map<string, string>();
        const newModels: LoadedModel[] = [];

        // Cleanup old blobs
        const currentFileMap = useStore.getState().fileMap;
        if (currentFileMap) {
            currentFileMap.forEach(url => URL.revokeObjectURL(url));
        }

        // Create blobs
        Array.from(files).forEach(file => {
            const path = file.name;
            const url = URL.createObjectURL(file);
            map.set(path, url);

            const name = file.name.toLowerCase();
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
            setFileMap(map);
            setModels(newModels);
        } else {
            alert('No supported 3D model file found in selection.');
        }
    };

    const [downloading, setDownloading] = useState<{ name: string; progress: number } | null>(null);

    const handleExampleLoad = (filename: string, url: string) => {
        handleCloseModel();

        // Determine format based on url or filename
        const determineFormat = (path: string): 'obj' | 'fbx' | 'gltf' | 'stl' => {
            const name = path.toLowerCase();
            if (name.endsWith('.obj')) return 'obj';
            if (name.endsWith('.fbx')) return 'fbx';
            if (name.endsWith('.gltf') || name.endsWith('.glb')) return 'gltf';
            if (name.endsWith('.stl')) return 'stl';
            return 'gltf'; // default
        };
        const format = determineFormat(url);

        // Check if remote URL
        if (url.startsWith('http')) {
            setDownloading({ name: filename, progress: 0 });

            (async () => {
                try {
                    // Caching disabled for now as per user request to avoid quota issues
                    // const cacheName = '3d-model-cache-v1';
                    // const cache = await caches.open(cacheName);
                    // let response = await cache.match(url);
                    let response = null;

                    if (response) {
                        console.log('Serving from cache:', filename);
                        setDownloading({ name: filename, progress: 100 });
                    } else {
                        // Not in cache, fetch from proxy
                        console.log('Downloading:', filename);
                        const proxyUrl = `/api/proxy-model?url=${encodeURIComponent(url)}`;
                        const fetchResponse = await fetch(proxyUrl);

                        if (!fetchResponse.body) throw new Error('No body');

                        const contentLength = fetchResponse.headers.get('content-length') || fetchResponse.headers.get('x-content-length');
                        const total = Number(contentLength) || 0;
                        let loaded = 0;

                        const stream = new ReadableStream({
                            start(controller) {
                                const reader = fetchResponse.body!.getReader();
                                function read() {
                                    reader.read().then(({ done, value }) => {
                                        if (done) {
                                            try { controller.close(); } catch (e) {
                                                console.error('Failed to close stream controller', e);
                                            }
                                            return;
                                        }
                                        loaded += value.length;
                                        if (total > 0) {
                                            setDownloading({ name: filename, progress: (loaded / total) * 100 });
                                        }
                                        try {
                                            controller.enqueue(value);
                                            read();
                                        } catch (e) {
                                            console.warn('Stream controller enqueue failed, likely cancelled', e);
                                            return;
                                        }
                                    }).catch(err => {
                                        console.error('Stream read error', err);
                                        try { controller.error(err); } catch (e) { }
                                    });
                                }
                                read();
                            }
                        });

                        const newResponse = new Response(stream);
                        const blob = await newResponse.blob();
                        response = new Response(blob);
                    }

                    const blob = await response.blob();

                    // Create object URL with explicit extension hints for PlayCanvas if needed, but standard createObjectURL doesn't allow extensions. 
                    // Extension is handled by the viewer app manually.
                    const objectUrl = URL.createObjectURL(blob);
                    const newModel: LoadedModel = {
                        id: crypto.randomUUID(),
                        url: objectUrl,
                        format: format,
                        filename: filename
                    };
                    setModels([newModel]);
                    setDownloading(null);

                } catch (err) {
                    console.error('Failed to load example', err);
                    setDownloading(null);
                    alert(`Failed to load example model: ${(err as Error).message}`);
                }
            })();
            return;
        }

        const newModel: LoadedModel = {
            id: crypto.randomUUID(),
            url: url,
            format: format,
            filename: filename
        };

        setModels([newModel]);
    };

    return (
        <div
            className={`absolute top-0 left-0 h-full bg-neutral-900/90 text-white transition-all duration-300 z-10 flex flex-col ${collapsed ? 'w-4' : 'w-80'}`}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
        >
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-4 bg-neutral-700 rounded-full p-1 hover:bg-neutral-600"
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0" style={{ scrollbarWidth: 'none' }}>
                {collapsed ? (
                    <div className="flex flex-col items-center gap-4 mt-8">
                        {collapsed ? null : <Upload size={20} />}
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: settings.bgColor }}></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">3D Viewer</h2>

                        {/* File Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium mb-1">Load Model</label>

                            {/* Examples */}
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <button
                                    onClick={() => handleExampleLoad('Apartment', '/examples/apartment_optimized.glb')}
                                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-left transition-colors border border-neutral-700 hover:border-neutral-500"
                                >
                                    🏠 Apartment
                                </button>
                                <button
                                    onClick={() => handleExampleLoad('Sword', '/examples/sword-volcano_optimized.glb')}
                                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-left transition-colors border border-neutral-700 hover:border-neutral-500"
                                >
                                    ⚔️ Sword
                                </button>
                                <button
                                    onClick={() => {
                                        const isMobile = typeof window !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);
                                        const url = isMobile ? '/examples/apartment-interior_optimized.glb' : '/examples/apartment-interior.glb';
                                        handleExampleLoad('Interior', url);
                                    }}
                                    disabled={!!downloading}
                                    className="col-span-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-left transition-colors border border-neutral-700 hover:border-neutral-500 flex flex-col justify-center disabled:opacity-50 disabled:cursor-wait relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between w-full z-10">
                                        <span>🛋️ Interior</span>
                                        {downloading?.name === 'Interior' && (
                                            <span className="text-[10px]">
                                                {downloading.progress > 0 ? `${Math.round(downloading.progress)}%` : '...'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Progress Bar Background */}
                                    {downloading?.name === 'Interior' && (
                                        <div
                                            className="absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-200"
                                            style={{ width: downloading.progress > 0 ? `${downloading.progress}%` : '100%', opacity: downloading.progress > 0 ? 1 : 0.3 }}
                                        />
                                    )}
                                </button>
                            </div>

                            <div className="relative border-2 border-dashed border-neutral-600 rounded-lg p-4 hover:border-neutral-400 text-center cursor-pointer transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept=".obj,.fbx,.gltf,.glb,.stl,.bin,.png,.jpg,.jpeg,.webp,.tga,.bmp"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            handleFileUpload(e.target.files);
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="mx-auto mb-2" size={24} />
                                <span className="text-xs text-neutral-400 block">Click to upload</span>
                                <span className="text-[10px] text-neutral-500 block">OBJ, FBX, GLTF, STL</span>
                            </div>
                        </div>

                        {/* Main Controls - only show if file loaded */}
                        {fileLoaded && (
                            <button
                                onClick={handleCloseModel}
                                className="w-full py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded flex items-center justify-center gap-2 text-sm transition-colors"
                            >
                                <Trash2 size={16} /> Close Model
                            </button>
                        )}

                        <div className="border-t border-neutral-700 my-4"></div>

                        {/* Texture Customization - Show when mesh selected */}
                        {selectedMeshId && (
                            <div className="space-y-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg animate-in slide-in-from-left-4 fade-in">
                                <h3 className="text-sm font-semibold text-blue-200">Selected Mesh</h3>
                                <div className="text-[10px] font-mono text-neutral-400 break-all bg-black/30 p-1 rounded">
                                    {selectedMeshId}
                                </div>
                                <label className="block text-xs font-medium text-blue-300 mt-2 mb-1">Apply Texture</label>
                                <div className="relative border border-dashed border-blue-500/50 rounded p-2 hover:bg-blue-500/10 cursor-pointer transition-colors text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files) handleTextureUpload(e.target.files);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <span className="text-xs text-blue-200">Upload Image</span>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-neutral-700 my-4"></div>

                        {/* Settings */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-neutral-300">Scene Settings</h3>

                            <div className="space-y-1">
                                <label className="text-xs text-neutral-400">Background Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={settings.bgColor}
                                        onChange={(e) => updateSetting('bgColor', e.target.value)}
                                        className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs font-mono">{settings.bgColor}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-neutral-400 flex justify-between">
                                    Light Intensity <span>{settings.lightIntensity}</span>
                                </label>
                                <input
                                    type="range"
                                    min="0" max="5" step="0.1"
                                    value={settings.lightIntensity}
                                    onChange={(e) => updateSetting('lightIntensity', parseFloat(e.target.value))}
                                    className="w-full accent-blue-500 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-neutral-400">Light Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={settings.lightColor}
                                        onChange={(e) => updateSetting('lightColor', e.target.value)}
                                        className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs font-mono">{settings.lightColor}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-neutral-400">Light Position</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="text-[10px] text-neutral-500 block text-center">X</label>
                                        <DraggableNumberInput
                                            value={settings.lightX}
                                            onChange={(val) => updateSetting('lightX', val)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-neutral-500 block text-center">Y</label>
                                        <DraggableNumberInput
                                            value={settings.lightY}
                                            onChange={(val) => updateSetting('lightY', val)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-neutral-500 block text-center">Z</label>
                                        <DraggableNumberInput
                                            value={settings.lightZ}
                                            onChange={(val) => updateSetting('lightZ', val)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 border-t border-neutral-700 pt-4">
                                <label className="text-xs text-neutral-400">Dynamic Focus</label>
                                <button
                                    onClick={() => updateSetting('dynamicFocus', !settings.dynamicFocus)}
                                    className={`w-8 h-4 rounded-full relative transition-colors ${settings.dynamicFocus ? 'bg-blue-500' : 'bg-neutral-600'}`}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings.dynamicFocus ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-t border-neutral-700 pt-4">
                                <label className="text-xs text-neutral-400">Auto Rotate</label>
                                <button
                                    onClick={() => updateSetting('autoRotate', !settings.autoRotate)}
                                    className={`w-8 h-4 rounded-full relative transition-colors ${settings.autoRotate ? 'bg-blue-500' : 'bg-neutral-600'}`}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings.autoRotate ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>



                            <div className="flex items-center justify-between border-t border-neutral-700 pt-4">
                                <label className="text-xs text-neutral-400">
                                    Tour Mode
                                    <span className="block text-[10px] text-neutral-500">WASD + Mouse</span>
                                </label>
                                <button
                                    onClick={() => updateSetting('tourMode', !settings.tourMode)}
                                    className={`w-8 h-4 rounded-full relative transition-colors ${settings.tourMode ? 'bg-green-500' : 'bg-neutral-600'}`}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings.tourMode ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <div className={`flex items-center justify-between border-t border-neutral-700 pt-4 ${!settings.tourMode ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label className="text-xs text-neutral-400">
                                    Wall Collision
                                    <span className="block text-[10px] text-neutral-500">Requires Tour Mode</span>
                                </label>
                                <button
                                    onClick={() => updateSetting('collisionEnabled', !settings.collisionEnabled)}
                                    className={`w-8 h-4 rounded-full relative transition-colors ${settings.collisionEnabled ? 'bg-blue-500' : 'bg-neutral-600'}`}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings.collisionEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {settings.tourMode && (
                                <div className="mt-4 border-t border-neutral-700 pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs text-neutral-400">Eye Level (Y-Axis)</label>
                                        <span className="text-xs text-neutral-500">{settings.tourHeight}m</span>
                                    </div>
                                    <DraggableNumberInput
                                        value={settings.tourHeight}
                                        onChange={(v) => updateSetting('tourHeight', v)}
                                        step={0.1}
                                    />


                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Toolbox hint */}
            {!collapsed && (
                <div className="p-4 border-t border-neutral-700 text-xs text-neutral-500">
                    <div className="flex items-center gap-2 mb-1"><Move size={12} /> Left Click: Rotate</div>
                    <div className="flex items-center gap-2 mb-1"><ZoomIn size={12} /> Scroll: Zoom</div>
                    <div className="flex items-center gap-2"><RotateCw size={12} /> Right Click: Pan</div>
                </div>
            )}
        </div>
    );
}
