import { Canvas } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
// import { Environment } from "@react-three/drei";

import { vertexShader, fragmentShader } from "../utils.js/shaders";

interface BlobBackgroundPropsTypes {
};

export const BlobBackground = ({
}: BlobBackgroundPropsTypes) => {

    return (
        <div
            className='complex-background__wrapper'
        >
            <Canvas camera={{ position: [0.0, 0.0, 8.0] }}>
                <Blob />
                {/* <directionalLight
                    // position={[5, 3, 1]}
                    color='#ffffff'
                    intensity={0.25}
                />
                <hemisphereLight
                    color={'#FC1EFF'}
                    args={['#ffff00', '#0000ff']}
                    // position={[5, 5, 5]}
                    // groundColor={}
                    intensity={0.375}
                />
                <ambientLight
                    color='#ffffff'
                    intensity={0.5}
                /> */}
                {/* <Environment preset="city" /> */}
            </Canvas>
        </div>
    );
}

const Blob = () => {
    const meshRef = useRef<any>(null);

    useFrame((state) => {
        const { clock } = state;
        if (meshRef.current) {
            meshRef.current.material.uniforms.u_time.value =
                0.4 * clock.getElapsedTime();

            meshRef.current.material.uniforms.u_intensity.value = MathUtils.lerp(
                meshRef.current.material.uniforms.u_intensity.value,
                0.15,
                0.02
            );
        }
    });

    const uniforms = useMemo(() => {
        return {
            u_time: { value: 0 },
            u_intensity: { value: 0.3 },
        };
    }, []);

    return (
        <mesh
            ref={meshRef}
            scale={1.5}
            position={[0, 0, 0]}
        >
            <icosahedronGeometry args={[2, 20]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
            {/* <meshStandardMaterial /> */}
        </mesh>
    )
}