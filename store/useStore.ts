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
}

interface StoreState {
    models: LoadedModel[];
    settings: Settings;
    fileMap: Map<string, string> | null;

    setModels: (models: LoadedModel[]) => void;
    setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
    updateSetting: (key: keyof Settings, value: any) => void;
    setFileMap: (fileMap: Map<string, string> | null) => void;
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
    tourHeight: 1.7
};

export const useStore = create<StoreState>((set) => ({
    models: [],
    settings: defaultSettings,
    fileMap: null,

    setModels: (models) => set({ models }),
    setSettings: (settings) => set((state) => ({
        settings: typeof settings === 'function' ? settings(state.settings) : settings
    })),
    updateSetting: (key, value) => set((state) => ({
        settings: { ...state.settings, [key]: value }
    })),
    setFileMap: (fileMap) => set({ fileMap }),
    reset: () => set({ models: [], fileMap: null })
}));
