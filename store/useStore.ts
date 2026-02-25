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
    fileMap: Map<string, string> | null;
    bookmarks: CameraBookmark[];
    capturePending: boolean; // Signal to capture camera state

    selectedMeshId: string | null;
    pendingTexture: { meshId: string, url: string } | null;
    pendingTextureOptions: { tiling?: [number, number], offset?: [number, number] } | null;

    setModels: (models: LoadedModel[]) => void;
    setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
    updateSetting: (key: keyof Settings, value: any) => void;
    setFileMap: (fileMap: Map<string, string> | null) => void;

    addBookmark: (bookmark: CameraBookmark) => void;
    removeBookmark: (id: string) => void;
    setBookmarks: (bookmarks: CameraBookmark[]) => void;
    triggerCapture: () => void;
    clearCapture: () => void;

    setSelectedMesh: (id: string | null) => void;
    applyTexture: (meshId: string, url: string) => void;
    applyTextureOptions: (options: { tiling?: [number, number], offset?: [number, number] }) => void;
    clearPendingTexture: () => void;

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
    fileMap: null,
    bookmarks: [],
    capturePending: false,
    selectedMeshId: null,
    pendingTexture: null,
    pendingTextureOptions: null,

    setModels: (models) => set({ models }),
    setSettings: (settings) => set((state) => ({
        settings: typeof settings === 'function' ? settings(state.settings) : settings
    })),
    updateSetting: (key, value) => set((state) => ({
        settings: { ...state.settings, [key]: value }
    })),
    setFileMap: (fileMap) => set({ fileMap }),

    addBookmark: (bookmark) => set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
    removeBookmark: (id) => set((state) => ({ bookmarks: state.bookmarks.filter(b => b.id !== id) })),
    setBookmarks: (bookmarks) => set({ bookmarks }),
    triggerCapture: () => set({ capturePending: true }),
    clearCapture: () => set({ capturePending: false }),

    setSelectedMesh: (id) => set({ selectedMeshId: id }),
    applyTexture: (meshId, url) => set({ pendingTexture: { meshId, url } }),
    applyTextureOptions: (options) => set({ pendingTextureOptions: options }),
    clearPendingTexture: () => set({ pendingTexture: null, pendingTextureOptions: null }),

    reset: () => set({ models: [], fileMap: null, bookmarks: [], capturePending: false, selectedMeshId: null, pendingTexture: null })
}));
