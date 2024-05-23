import { ReactNode, useRef } from "react";

import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Mesh } from 'three'

import { IInteraction, IGeometry, IMaterial } from "../utils.js/types";

type IMeshWrapperV2Props = {
    geometry: ReactNode | undefined,
    material: ReactNode | undefined,
    interaction: IInteraction | undefined,
};

export const MeshWrapperV2 = (
    { geometry, material, interaction }: IMeshWrapperV2Props
) => {
    // export const MeshWrapperV2 = ({ geometry, material, interaction }) => {
    const vec = new Vector3()
    const meshRef = useRef<Mesh>(null)
    const { camera, mouse } = useThree()

    useFrame(({ clock }) => {
        const isMouseInteraction = interaction?.type === 'mouse'
        const isScrollInteraction = interaction?.type === 'scroll'
        const isTimerInteraction = interaction?.type === 'timer'

        // console.log(mouse.x)
        // console.log(mouse.y)
        if (isTimerInteraction) {
            // const a = clock.getElapsedTime()
            if (meshRef && meshRef.current) {
                meshRef.current.rotation.x = clock.getElapsedTime()
            }
        }

        if (isScrollInteraction) {
            if (meshRef && meshRef.current) {
                const { scrollY } = window;

                meshRef.current.rotation.y = scrollY / 200
            }
        }

        if (isMouseInteraction) {
            camera.position.lerp(vec.set(mouse.x * 4, mouse.y * 4, camera.position.z), 1)
            camera.lookAt(0, 0, 0)
        }

        // console.log(a) // the value will be 0 at scene initialization and grow each frame
    })

    // const renderGeometry = (g: IGeometry | undefined) => {
    //     if (!g) {
    //         return;
    //     }
    //     const geometryTypeMap: {
    //         [id: string]: ReactNode
    //     } = {
    //         box: <boxGeometry args={[2, 2, 2]} />,
    //         capsule: <capsuleGeometry />,
    //         dodecahedron: <dodecahedronGeometry />,
    //         icosahedron: <icosahedronGeometry />,
    //         octahedron: <octahedronGeometry />,
    //         sphere: <sphereGeometry />,
    //         torus: <torusGeometry />,
    //         torusKnot: <torusKnotGeometry />,
    //         tube: <tubeGeometry />,
    //         edges: <edgesGeometry />,
    //         wireframe: <wireframeGeometry />
    //     }

    //     return geometryTypeMap[g?.type]
    // }

    // const renderMaterial = (m: IMaterial | undefined) => {
    //     if (!m) {
    //         return;
    //     }
    //     const materialTypeMap: {
    //         [id: string]: ReactNode
    //     } = {
    //         basic: <meshBasicMaterial />,
    //         depth: <meshDepthMaterial />,
    //         lambert: <meshLambertMaterial />,
    //         matcap: <meshMatcapMaterial />,
    //         normal: <meshNormalMaterial />,
    //         phong: <meshPhongMaterial />,
    //         physical: <meshPhysicalMaterial />,
    //         standard: <meshStandardMaterial />,
    //         toon: <meshToonMaterial />,
    //     }

    //     return materialTypeMap[m?.type]
    // }

    // const geometryObject = renderGeometry(geometry)
    // const materialObject = renderMaterial(material)

    return (
        <mesh
            ref={meshRef}
        >
            {geometry && geometry}
            {material && material}
        </mesh>
    );
}
