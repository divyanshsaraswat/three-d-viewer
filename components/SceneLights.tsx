import { useStore } from '@/store/useStore';

export default function SceneLights() {
    const lightIntensity = useStore(state => state.settings.lightIntensity);
    const lightColor = useStore(state => state.settings.lightColor);
    const lightX = useStore(state => state.settings.lightX);
    const lightY = useStore(state => state.settings.lightY);
    const lightZ = useStore(state => state.settings.lightZ);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight
                position={[lightX, lightY, lightZ]}
                intensity={lightIntensity}
                color={lightColor}
                castShadow
            />
            {/* Visual Helper for Light Source */}
            <mesh position={[lightX, lightY, lightZ]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshBasicMaterial color={lightColor} />
            </mesh>
        </>
    );
}
