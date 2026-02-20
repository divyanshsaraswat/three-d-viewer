import { PointerLockControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';

// Module-level variables to persist state across re-mounts
let savedPosition: THREE.Vector3 | null = null;
let savedRotation: THREE.Euler | null = null;

import { useStore } from '@/store/useStore';

const FirstPersonController = memo(() => {
    const height = useStore(state => state.settings.tourHeight);
    const collisionEnabled = useStore(state => state.settings.collisionEnabled);
    const { camera, scene } = useThree();
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);
    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());
    const raycaster = useRef(new THREE.Raycaster());

    // Restore camera state on mount
    useEffect(() => {
        if (savedPosition) {
            camera.position.copy(savedPosition);
        }
        if (savedRotation) {
            camera.rotation.copy(savedRotation);
        }

        return () => {
            if (!savedPosition) savedPosition = new THREE.Vector3();
            if (!savedRotation) savedRotation = new THREE.Euler();
            savedPosition.copy(camera.position);
            savedRotation.copy(camera.rotation);
        };
    }, [camera]);

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

    const checkCollision = (directionVec: THREE.Vector3) => {
        // Transform local direction to world for raycasting
        const worldDir = directionVec.clone().applyQuaternion(camera.quaternion).normalize();

        // Raycast from camera position
        raycaster.current.set(camera.position, worldDir);
        raycaster.current.far = 1.0; // Collision distance threshold

        // Intersect with everything in scene
        // We filter for Meshes to avoid colliding with Helpers/Lines
        const intersects = raycaster.current.intersectObjects(scene.children, true);

        for (const hit of intersects) {
            if (hit.object instanceof THREE.Mesh && hit.object.visible) {
                // Check if it's not a helper (often helpers are LineSegments, but sometimes Meshes with specific names)
                // Simple check: if it has geometry
                // Also ignore the grid if it's a mesh
                if (hit.object.userData?.isGrid) continue;
                return true;
            }
        }
        return false;
    };

    useFrame((state, delta) => {
        // Friction / Deceleration
        velocity.current.x -= velocity.current.x * 10.0 * delta;
        velocity.current.z -= velocity.current.z * 10.0 * delta;

        // Direction vector
        direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
        direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
        direction.current.normalize(); // Ensure consistent speed in all directions

        // Update velocity (acceleration)
        if (moveForward.current || moveBackward.current) {
            velocity.current.z -= direction.current.z * 150.0 * delta;
        }
        if (moveLeft.current || moveRight.current) {
            velocity.current.x -= direction.current.x * 150.0 * delta;
        }

        // --- Collision Checks ---
        // We check intended movement direction. 
        // If moving Forward (negative local Z), check forward vector.
        // It's simpler to check the specific 4 directions if keys are pressed.

        // Forward (Local Z: -1)
        if (moveForward.current && collisionEnabled && checkCollision(new THREE.Vector3(0, 0, -1))) {
            velocity.current.z = Math.max(0, velocity.current.z); // Stop forward movement (allow particles of backward speed)
        }
        // Backward (Local Z: 1)
        if (moveBackward.current && collisionEnabled && checkCollision(new THREE.Vector3(0, 0, 1))) {
            velocity.current.z = Math.min(0, velocity.current.z);
        }
        // Left (Local X: -1)
        if (moveLeft.current && collisionEnabled && checkCollision(new THREE.Vector3(-1, 0, 0))) {
            velocity.current.x = Math.max(0, velocity.current.x);
        }
        // Right (Local X: 1)
        if (moveRight.current && collisionEnabled && checkCollision(new THREE.Vector3(1, 0, 0))) {
            velocity.current.x = Math.min(0, velocity.current.x);
        }

        // Apply movement
        camera.translateX(-velocity.current.x * delta);
        camera.translateZ(velocity.current.z * delta);

        // LOCK Y AXIS to simulate walking at specified height
        camera.position.y = height;

        // Persist state continuously
        if (!savedPosition) savedPosition = new THREE.Vector3();
        if (!savedRotation) savedRotation = new THREE.Euler();
        savedPosition.copy(camera.position);
        savedRotation.copy(camera.rotation);
    });

    return (
        <PointerLockControls
            minPolarAngle={Math.PI / 2} // Lock to horizon (90 degrees)
            maxPolarAngle={Math.PI / 2} // Lock to horizon (90 degrees)
        />
    );
});

export default FirstPersonController;
