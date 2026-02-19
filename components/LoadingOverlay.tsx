import { Html, useProgress } from '@react-three/drei';

export default function LoadingOverlay() {
    return (
        <Html center zIndexRange={[100, 100]}>
            <div className="flex flex-col items-center justify-center bg-black/80 text-white p-6 rounded-xl backdrop-blur-md shadow-2xl border border-white/10">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <div className="text-lg font-bold">Loading Model...</div>
                <div className="text-sm text-neutral-400 mt-2">Parsing 3D geometry</div>
            </div>
        </Html>
    );
}
