import { FC, ReactNode, useRef } from "react";

import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Mesh } from 'three'

import { IGeometry, IMaterial, IInteraction } from "../utils.js/types";

type IMeshWrapperProps = {
    geometry: IGeometry,
    material: IMaterial,
    interaction: IInteraction,
};

export const MeshWrapper = (
    { geometry, material, interaction }: IMeshWrapperProps
) => {
    // export const MeshWrapper = ({ geometry, material, interaction }) => {
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
            const a = clock.getElapsedTime()
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

    const getGeometry = (g: IGeometry) => {
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

    const getMaterial = (m: IMaterial) => {
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

    const geometryObject = getGeometry(geometry)
    const materialObject = getMaterial(material)

    return (
        <mesh
            ref={meshRef}
        >
            {geometryObject && geometryObject}
            {/* 
                boxGeometry : 'width', 'height', and 'depth'
                CapsuleGeometry : radius, length, segments on top/bottom, and segments around
                DodecahedronGeometry : ressemble à une sphere avec des triangles bizarres
                IcosahedronGeometry : sphère avec des coins, mieux que DodecahedronGeometry (radius + detail)
                OctahedronGeometry : pareil sphère
                SphereGeometry : radius, widthSegments, heightSegments
                TorusGeometry : donut => radius total, épaisseur du donut, niveau détail axe 1, niveau de détail axe 2
                TorusKnotGeometry : lacets => radius du total, radius du tube, detail1, detail1, complexité du noeud 1, complexité du noeud 2
                TubeGeometry : tube qui suit une courbe => détail du tracé, épaisseur du tube, détail du tube
                EdgesGeometry : pour voir les côtés d'une géométrie (peut être stylé)
                WireframeGeometry : pour voir les cotés d'une géométrie (peut être stylé)
            */}
            {materialObject && materialObject}
            {/* <meshStandardMaterial /> */}
            {/* 
                MeshBasicMaterial : plain
                MeshDepthMaterial : for geometry, far = darker and close = lighter
                MeshLambertMaterial : some minor reflexion but not shiny
                MeshMatcapMaterial : shadows on itself but nor reacting to light or other elments
                MeshNormalMaterial : ?colored?
                MeshPhongMaterial : shiny
                MeshPhysicalMaterial : realistic, can be shiny
                MeshStandardMaterial : more realistic, more computation
                MeshToonMaterial : cartoon shade
            */}
        </mesh>
    );
}
