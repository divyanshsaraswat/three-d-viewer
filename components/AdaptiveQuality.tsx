import { PerformanceMonitor } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState, useEffect } from 'react';

export default function AdaptiveQuality() {
    const gl = useThree((state) => state.gl);
    const [dpr, setDpr] = useState(1.5);

    useEffect(() => {
        // Initial hardware capability check
        // If device has high pixel ratio (e.g. mobile with 3.0), clamp it to 2.0 max to save GPU
        const initialDpr = Math.min(window.devicePixelRatio, 2);
        setDpr(initialDpr);
        gl.setPixelRatio(initialDpr);
    }, [gl]);

    return (
        <PerformanceMonitor
            // When performance is bad (FPS drops), lower the quality
            onDecline={() => {
                const newDpr = Math.max(0.5, dpr * 0.9); // Reduce by 10%, min 0.5
                setDpr(newDpr);
                gl.setPixelRatio(newDpr);
                console.log('📉 Performance decline detected. Lowering DPR to:', newDpr.toFixed(2));
            }}
            // When performance is good, restore quality (up to max 2)
            onIncline={() => {
                const maxDpr = Math.min(window.devicePixelRatio, 2);
                if (dpr < maxDpr) {
                    const newDpr = Math.min(maxDpr, dpr * 1.1); // Increase by 10%
                    setDpr(newDpr);
                    gl.setPixelRatio(newDpr);
                    console.log('📈 Performance stable. Increasing DPR to:', newDpr.toFixed(2));
                }
            }}
        // Flip usage: rendering only when necessary is handled by Frameloop in Canvas, 
        // but PerformanceMonitor helps us measure the "stress".
        />
    );
}
