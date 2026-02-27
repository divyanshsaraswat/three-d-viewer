import { create } from 'zustand';

export interface LoadedModel {
    id: string;
    url: string;
    format: 'obj' | 'fbx' | 'gltf' | 'stl';
    filename: string;
}

interface Settings {
    bgColor: string;
    lightIntensity: number;
    lightColor: string;
    lightX: number;
    lightY: number;
    lightZ: number;
    dynamicFocus: boolean;
    tourMode: boolean;
    tourHeight: number;
    autoRotate: boolean;
    collisionEnabled: boolean;
}

export interface CameraBookmark {
    id: string;
    name: string;
    position: [number, number, number];
    rotation: [number, number, number];
}

interface StoreState {
    models: LoadedModel[];
    settings: Settings;
    editorMode: 'dev' | 'prod';
    isModelLoading: boolean;
    fileMap: Map<string, string> | null;
    bookmarks: CameraBookmark[];
    capturePending: boolean; // Signal to capture camera state

    selectedMeshId: string | null;
    pendingTexture: { meshId: string, url: string } | null;
    pendingTextureOptions: { tiling?: [number, number], offset?: [number, number] } | null;
    joystickInput: { x: number, y: number };

    setModels: (models: LoadedModel[]) => void;
    setIsModelLoading: (loading: boolean) => void;
    setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
    updateSetting: (key: keyof Settings, value: any) => void;
    setEditorMode: (mode: 'dev' | 'prod') => void;
    setFileMap: (fileMap: Map<string, string> | null) => void;

    addBookmark: (bookmark: CameraBookmark) => void;
    removeBookmark: (id: string) => void;
    updateBookmark: (id: string, name: string) => void;
    setBookmarks: (bookmarks: CameraBookmark[]) => void;
    triggerCapture: () => void;
    clearCapture: () => void;

    setSelectedMesh: (id: string | null) => void;
    applyTexture: (meshId: string, url: string) => void;
    applyTextureOptions: (options: { tiling?: [number, number], offset?: [number, number] }) => void;
    clearPendingTexture: () => void;

    setJoystickInput: (x: number, y: number) => void;

    reset: () => void;
}

export const defaultSettings: Settings = {
    bgColor: '#171717',
    lightIntensity: 1,
    lightColor: '#ffffff',
    lightX: 10,
    lightY: 10,
    lightZ: 10,
    dynamicFocus: true,
    tourMode: false,
    tourHeight: 1.7,
    autoRotate: true,
    collisionEnabled: true
};

export const useStore = create<StoreState>((set) => ({
    models: [],
    settings: defaultSettings,
    editorMode: 'dev',
    isModelLoading: false,
    fileMap: null,
    bookmarks: [],
    capturePending: false,
    selectedMeshId: null,
    pendingTexture: null,
    pendingTextureOptions: null,
    joystickInput: { x: 0, y: 0 },

    setModels: (models) => set({ models }),
    setIsModelLoading: (loading) => set({ isModelLoading: loading }),
    setSettings: (settings) => set((state) => {
        const newSettings = typeof settings === 'function' ? settings(state.settings) : settings;
        if (state.editorMode === 'prod') {
            return {
                settings: {
                    ...newSettings,
                    dynamicFocus: true,
                    tourMode: true,
                    tourHeight: 0.2,
                    collisionEnabled: true
                }
            };
        }
        return { settings: newSettings };
    }),
    updateSetting: (key, value) => set((state) => {
        const newSettings = { ...state.settings, [key]: value };
        if (state.editorMode === 'prod') {
            return {
                settings: {
                    ...newSettings,
                    dynamicFocus: true,
                    tourMode: true,
                    tourHeight: 0.2,
                    collisionEnabled: true
                }
            };
        }
        return { settings: newSettings };
    }),
    setEditorMode: (mode) => set((state) => {
        if (mode === 'prod') {
            return {
                editorMode: mode,
                settings: {
                    ...state.settings,
                    dynamicFocus: true,
                    tourMode: true,
                    tourHeight: 0.2,
                    collisionEnabled: true
                }
            };
        }
        return { editorMode: mode };
    }),
    setFileMap: (fileMap) => set({ fileMap }),

    addBookmark: (bookmark) => set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
    removeBookmark: (id) => set((state) => ({ bookmarks: state.bookmarks.filter(b => b.id !== id) })),
    updateBookmark: (id, name) => set((state) => ({ bookmarks: state.bookmarks.map(b => b.id === id ? { ...b, name } : b) })),
    setBookmarks: (bookmarks) => set({ bookmarks }),
    triggerCapture: () => set({ capturePending: true }),
    clearCapture: () => set({ capturePending: false }),

    setSelectedMesh: (id) => set({ selectedMeshId: id }),
    applyTexture: (meshId, url) => set({ pendingTexture: { meshId, url } }),
    applyTextureOptions: (options) => set({ pendingTextureOptions: options }),
    clearPendingTexture: () => set({ pendingTexture: null, pendingTextureOptions: null }),

    setJoystickInput: (x, y) => set({ joystickInput: { x, y } }),

    reset: () => set({ models: [], fileMap: null, bookmarks: [], capturePending: false, selectedMeshId: null, pendingTexture: null, joystickInput: { x: 0, y: 0 } })
}));
