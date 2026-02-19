'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useStore, CameraBookmark } from '@/store/useStore';
import * as THREE from 'three';
import { MathUtils } from 'three';

export default function BookmarkManager() {
    const { camera, gl } = useThree();
    const capturePending = useStore(state => state.capturePending);
    const addBookmark = useStore(state => state.addBookmark);
    const clearCapture = useStore(state => state.clearCapture);

    // For smooth transition
    const targetPos = useRef<THREE.Vector3 | null>(null);
    const targetRot = useRef<THREE.Quaternion | null>(null);
    const transitionStartTime = useRef(0);
    const startPos = useRef(new THREE.Vector3());
    const startRot = useRef(new THREE.Quaternion());
    const DURATION = 1.0; // seconds

    // Capture Logic
    useEffect(() => {
        if (capturePending) {
            const id = MathUtils.generateUUID();
            const count = useStore.getState().bookmarks.length + 1;

            const position: [number, number, number] = [
                camera.position.x,
                camera.position.y,
                camera.position.z
            ];

            // For rotation, we might want quaternion for better interpolation, 
            // but the store defined it as [x,y,z] (Euler). Let's stick to Euler for storage but convert when needed.
            const rotation: [number, number, number] = [
                camera.rotation.x,
                camera.rotation.y,
                camera.rotation.z
            ];

            addBookmark({
                id,
                name: `View ${count}`,
                position,
                rotation
            });

            clearCapture();
        }
    }, [capturePending, camera, addBookmark, clearCapture]);

    // Restore Logic (Event Listener)
    useEffect(() => {
        const handleRestore = (e: Event) => {
            const customEvent = e as CustomEvent<CameraBookmark>;
            const b = customEvent.detail;

            // Setup transition
            targetPos.current = new THREE.Vector3(...b.position);
            targetRot.current = new THREE.Quaternion().setFromEuler(new THREE.Euler(...b.rotation));

            startPos.current.copy(camera.position);
            startRot.current.copy(camera.quaternion);
            transitionStartTime.current = performance.now();
        };

        window.addEventListener('restore-bookmark', handleRestore);
        return () => window.removeEventListener('restore-bookmark', handleRestore);
    }, [camera]);

    // Animation Loop
    useFrame(() => {
        if (targetPos.current && targetRot.current) {
            const now = performance.now();
            const elapsed = (now - transitionStartTime.current) / 1000;
            const t = Math.min(elapsed / DURATION, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - t, 3);

            camera.position.lerpVectors(startPos.current, targetPos.current, ease);
            camera.quaternion.slerpQuaternions(startRot.current, targetRot.current, ease);

            if (t >= 1) {
                targetPos.current = null;
                targetRot.current = null;
            }
        }
    });

    return null;
}
