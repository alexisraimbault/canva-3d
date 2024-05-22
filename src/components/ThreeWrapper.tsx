import { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

import { MeshWrapper } from "./MeshWrapper";

import { ILight, IGeometry, IInteraction, IMaterial } from "../utils.js/types";

type ITreeWrapperProps = {
    lights: ILight[];
    geometry: IGeometry;
    material: IInteraction;
    interaction: IMaterial;
    mode?: string;
};

export const ThreeWrapper = ({
    lights = [{ type: 'ambient' }, { type: 'directional' }],
    geometry = { type: 'box' },
    material = { type: 'standard' },
    interaction = { type: 'mouse' },
    mode
}: ITreeWrapperProps) => {
    const isSmallMode = mode === "small"

    const getLight = (light: ILight, index: number) => {
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

    const lightsArray = lights.map((light, index) => getLight(light, index))

    return (
        <div className={`three-wrapper__scene${isSmallMode ? ' three-wrapper__scene--small' : ''}`}>
            <Canvas
                shadows
                className="three-wrapper__canvas"
                camera={{
                    position: [-6, 7, 7],
                }}
            >
                {/* 
                        AmbientLight: illuminates the scene globally, no direction + no shadow
                        DirectionalLight: from a point, seems infinitely far (all rays are parallel)
                        HemisphereLight: above, and fading. No shadows
                        PointLight: from a point to all directions (lamp)
                        RectAreaLight: light from a rectangle (window)
                        SpotLight: from a single point, in one direction, along a come that increases. For shadows
                    */}
                {lightsArray && lightsArray}
                <MeshWrapper
                    geometry={geometry}
                    material={material}
                    interaction={interaction}
                />
            </Canvas>
        </div>
    );
}
