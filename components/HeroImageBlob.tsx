"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const BlobShaderMaterial = {
    uniforms: {
        uTex1: { value: null },
        uTex2: { value: null },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uRadius: { value: 0.2 },
        uSmoothing: { value: 0.05 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uRadius;
    uniform float uSmoothing;

    varying vec2 vUv;

    // Classic Perlin 2D Noise
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float cnoise(vec2 P){
      vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
      Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x,gy.x);
      vec2 g10 = vec2(gx.y,gy.y);
      vec2 g01 = vec2(gx.z,gy.z);
      vec2 g11 = vec2(gx.w,gy.w);
      vec4 norm = 1.79284291400159 - 0.85373472095314 * 
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
      g00 *= norm.x;
      g01 *= norm.y;
      g10 *= norm.z;
      g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
      return 2.3 * n_xy;
    }

    void main() {
      // Fix aspect ratio for the mouse calculation
      vec2 st = vUv;
      float aspect = uResolution.x / uResolution.y;
      vec2 mousePos = uMouse;
      
      vec2 diff = st - mousePos;
      diff.x *= aspect;

      // Add noise to the distance to create a blobby shape
      float noise = cnoise(st * 5.0 + uTime * 2.0) * 0.05;
      float dist = length(diff) + noise;

      // Smooth mask
      float mask = smoothstep(uRadius + uSmoothing, uRadius - uSmoothing, dist);

      vec4 tex1 = texture2D(uTex1, st);
      vec4 tex2 = texture2D(uTex2, st);

      gl_FragColor = mix(tex1, tex2, mask);
    }
  `
};

const BlobPlane = ({ img1, img2 }: { img1: string; img2: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size, viewport, gl } = useThree();

    // Load textures
    const textures = useTexture([img1, img2]);
    // Ensure we don't stretch weirdly by setting texture mapping
    // We'll rely on object-fit like behavior in the shader if needed, but for simplicity, 
    // we assume the images have similar aspect ratios to the screen.

    const uniforms = useMemo(
        () => {
            const t1 = textures[0].clone();
            const t2 = textures[1].clone();
            t1.colorSpace = THREE.SRGBColorSpace;
            t2.colorSpace = THREE.SRGBColorSpace;

            return {
                uTex1: { value: t1 },
                uTex2: { value: t2 },
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uResolution: { value: new THREE.Vector2(size.width, size.height) },
                uRadius: { value: 0.15 },
                uSmoothing: { value: 0.05 },
            };
        },
        [textures, size]
    );

    const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
    const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));

    React.useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            const rect = gl.domElement.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - ((e.clientY - rect.top) / rect.height);
            targetMouse.current.set(x, y);
        };
        window.addEventListener('pointermove', handlePointerMove);
        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, [gl]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

            // Interpolate mouse for smooth following
            currentMouse.current.lerp(targetMouse.current, 0.1);
            materialRef.current.uniforms.uMouse.value.copy(currentMouse.current);

            // Update resolution in case of resize
            materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                attach="material"
                args={[BlobShaderMaterial]}
                uniforms={uniforms}
            />
        </mesh>
    );
};

interface HeroImageBlobProps {
    imageOne: string;
    imageTwo: string;
}

export default function HeroImageBlob({ imageOne, imageTwo }: HeroImageBlobProps) {
    return (
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas style={{ width: '100%', height: '100%' }}>
                <BlobPlane img1={imageOne} img2={imageTwo} />
            </Canvas>
        </div>
    );
}
