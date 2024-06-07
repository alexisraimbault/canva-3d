import { ReactNode, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Mesh } from 'three'


import { darkColor_10, darkColor_60 } from "../utils.js/colors";


interface MeshWrapperPropsTypes {
    geometryObject: ReactNode | undefined,
    materialObject: ReactNode | undefined,
};

const MeshWrapper = ({
    geometryObject, materialObject
}: MeshWrapperPropsTypes) => {
    const meshRef = useRef<Mesh>(null)

    useFrame(({ clock }) => {
        if (meshRef && meshRef.current) {
            meshRef.current.rotation.x = clock.getElapsedTime()
        }
    })

    // const envMap = useEnvironment({ files: '/envmaps/env_map_simple_sky.hdr' })

    return (
        <mesh
            ref={meshRef}
        >
            <Environment preset="park" />
            {geometryObject && geometryObject}
            {materialObject && materialObject}
        </mesh>
    )
}

type HomepageShapeTypes = {
};

export const HomepageShape = ({
}: HomepageShapeTypes) => {

    // const geometryObject = (
    //     <dodecahedronGeometry />
    // )

    const geometryObject = (
        <torusGeometry
            args={[1, 0.4, 400, 60]}
        />
    )

    const materialObject = (
        <meshStandardMaterial
            roughness={0}
            metalness={1}
            color={`#${darkColor_60}`}
            emissive={`#${darkColor_10}`}
        // emissive={`#A53F2B`}
        // envMap={envMap}
        />
    )


    return (
        <Canvas
            shadows
            className="three-d-item-renderer__canvas"
            camera={{
                near: 1,
                position: [-2, 2, 2],
                aspect: 1,
            }}
        >
            <ambientLight
                intensity={1}
                color='#FC1EFF'
            />
            <MeshWrapper
                geometryObject={geometryObject}
                materialObject={materialObject}
            />
        </Canvas>
    );
}
