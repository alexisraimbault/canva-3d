import { ReactNode, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Mesh } from 'three'


import { ThreeDItemType, ILight, IGeometry, IMaterial, IInteraction } from "../utils.js/types";

type MeshWrapperProps = {
    geometryObject: ReactNode | undefined,
    materialObject: ReactNode | undefined,
    interaction: IInteraction | undefined,
};

const MeshWrapper = ({
    geometryObject, materialObject, interaction
}: MeshWrapperProps) => {
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

    return (
        <mesh
            ref={meshRef}
        >
            {geometryObject && geometryObject}
            {materialObject && materialObject}
        </mesh>
    )
}

type ThreeDItemRendererTypes = {
    item: ThreeDItemType | undefined
};

export const ThreeDItemRenderer = ({
    item
}: ThreeDItemRendererTypes) => {
    const renderLight = (light: ILight, index: number) => {
        const ligtsTypeMap: {
            [id: string]: ReactNode
        } = {
            ambient: (
                <ambientLight
                    key={`l-${index}`}
                    intensity={1}
                    color='#FC1EFF'
                />),
            directional: (
                <directionalLight
                    key={`l-${index}`}
                    position={[5, 3, 1]}
                // color='#FC1EFF'
                />
            ),
            hemisphere: (
                <hemisphereLight
                    key={`l-${index}`}
                    color={'#FC1EFF'}
                    // position={[5, 5, 5]}
                    // groundColor={}
                    intensity={1}
                />
            ),
            point: (
                <pointLight
                    key={`l-${index}`}
                />
            ),
            rect: (
                <rectAreaLight
                    key={`l-${index}`}
                />
            ),
            spot: (
                <spotLight
                    key={`l-${index}`}
                />
            )
        }

        return ligtsTypeMap[light?.type]
    }

    const renderGeometry = (g: IGeometry | undefined) => {
        if (!g) {
            return;
        }
        const geometryTypeMap: {
            [id: string]: ReactNode
        } = {
            box: <boxGeometry args={[2, 2, 2]} />,
            capsule: <capsuleGeometry />,
            dodecahedron: <dodecahedronGeometry />,
            icosahedron: <icosahedronGeometry />,
            octahedron: <octahedronGeometry />,
            sphere: <sphereGeometry />,
            torus: <torusGeometry />,
            torusKnot: <torusKnotGeometry />,
            tube: <tubeGeometry />,
            edges: <edgesGeometry />,
            wireframe: <wireframeGeometry />
        }

        return geometryTypeMap[g?.type]
    }

    const renderMaterial = (m: IMaterial | undefined) => {
        if (!m) {
            return;
        }
        const materialTypeMap: {
            [id: string]: ReactNode
        } = {
            basic: <meshBasicMaterial />,
            depth: <meshDepthMaterial />,
            lambert: <meshLambertMaterial />,
            matcap: <meshMatcapMaterial />,
            normal: <meshNormalMaterial />,
            phong: <meshPhongMaterial />,
            physical: <meshPhysicalMaterial />,
            standard: <meshStandardMaterial />,
            toon: <meshToonMaterial />,
        }

        return materialTypeMap[m?.type]
    }

    const geometryObject = renderGeometry(item?.geometry)
    const materialObject = renderMaterial(item?.material)


    return (
        <div
            className="three-d-item-renderer__wrapper"
            style={{
                width: `${item?.size || 20}vw`,
                height: `${item?.size || 20}vw`,
            }}
        >
            <Canvas
                shadows
                className="three-d-item-renderer__canvas"
                camera={{
                    near: 1,
                    position: [-2, 2, 2],
                    aspect: 1,
                }}
            >
                {item?.lights?.map((light, lightIndex) => renderLight(light, lightIndex))}
                <MeshWrapper
                    geometryObject={geometryObject}
                    materialObject={materialObject}
                    interaction={item?.interaction}
                />
            </Canvas>
        </div>
    );
}
