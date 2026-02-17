'use client';

import { X, ChevronLeft, ChevronRight, Upload, ZoomIn, ZoomOut, Move, RotateCw, Trash2 } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

interface SidebarProps {
    settings: {
        bgColor: string;
        lightIntensity: number;
        lightColor: string;
        lightX: number;
        lightY: number;
        lightZ: number;
        dynamicFocus: boolean;
    };
    setSettings: (settings: any) => void;
    onCloseModel: () => void;
    onFileUpload: (files: FileList) => void;
    onExampleLoad: (name: string, url: string) => void;
    fileLoaded: boolean;
}

function DraggableNumberInput({ value, onChange, step = 0.5 }: { value: number, onChange: (val: number) => void, step?: number }) {
    const [displayValue, setDisplayValue] = useState(value);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startValueRef = useRef(0);

    // Sync local display value if external value changes (and not dragging)
    if (!isDraggingRef.current && displayValue !== value) {
        setDisplayValue(value);
    }

    // We need a way to pass the final value to handleMouseUp without stale closures.
    // Let's use a ref to track the "current" calculated value during drag.
    const currentValueRef = useRef(value);

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

export default function Sidebar({ settings, setSettings, onCloseModel, onFileUpload, onExampleLoad, fileLoaded }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);



    const updateSetting = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    return (
        <div className={`absolute top-0 left-0 h-full bg-neutral-900/90 text-white transition-all duration-300 z-10 flex flex-col ${collapsed ? 'w-12' : 'w-80'}`}>
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-4 bg-neutral-700 rounded-full p-1 hover:bg-neutral-600"
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
                {collapsed ? (
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <Upload size={20} />
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
                                    onClick={() => onExampleLoad('Apartment', '/examples/apartment.glb')}
                                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-left transition-colors border border-neutral-700 hover:border-neutral-500"
                                >
                                    🏠 Apartment
                                </button>
                                <button
                                    onClick={() => onExampleLoad('Sword', '/examples/sword-volcano.glb')}
                                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-left transition-colors border border-neutral-700 hover:border-neutral-500"
                                >
                                    ⚔️ Sword
                                </button>
                            </div>

                            <div className="relative border-2 border-dashed border-neutral-600 rounded-lg p-4 hover:border-neutral-400 text-center cursor-pointer transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept=".obj,.fbx,.gltf,.glb,.stl,.bin,.png,.jpg,.jpeg,.webp,.tga,.bmp"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            onFileUpload(e.target.files);
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
                                onClick={onCloseModel}
                                className="w-full py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded flex items-center justify-center gap-2 text-sm transition-colors"
                            >
                                <Trash2 size={16} /> Close Model
                            </button>
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
