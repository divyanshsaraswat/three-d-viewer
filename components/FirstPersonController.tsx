import { PointerLockControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FirstPersonController() {
    const { camera } = useThree();
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);
    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    moveForward.current = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft.current = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward.current = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    moveRight.current = true;
                    break;
            }
        };

        const onKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    moveForward.current = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft.current = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward.current = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    moveRight.current = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        // Friction / Deceleration
        velocity.current.x -= velocity.current.x * 10.0 * delta;
        velocity.current.z -= velocity.current.z * 10.0 * delta;

        // Direction vector
        direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
        direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
        direction.current.normalize(); // Ensure consistent speed in all directions

        if (moveForward.current || moveBackward.current) {
            velocity.current.z -= direction.current.z * 150.0 * delta; // Speed
        }
        if (moveLeft.current || moveRight.current) {
            velocity.current.x -= direction.current.x * 150.0 * delta;
        }

        // Apply movement
        // We use moveRight/moveForward from PointerLockControls object structure implicitly 
        // by moving camera relative to its local axis

        // Side movement
        camera.translateX(-velocity.current.x * delta);
        // Forward/Back movement
        camera.translateZ(velocity.current.z * delta);

        // LOCK Y AXIS to simulate walking
        camera.position.y = 1.7; // Standard eye level height
    });

    return (
        <PointerLockControls
            minPolarAngle={Math.PI / 2} // Lock to horizon (90 degrees)
            maxPolarAngle={Math.PI / 2} // Lock to horizon (90 degrees)
        />
    );
}
