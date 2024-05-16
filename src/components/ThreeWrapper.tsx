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

// export const TreeWrapper: FC<ITreeWrapperProps> = (props) => {
export const ThreeWrapper = ({
    lights = [{ type: 'ambient' }, { type: 'directional' }],
    geometry = { type: 'box' },
    material = { type: 'standard' },
    interaction = { type: 'mouse' },
    mode
}: ITreeWrapperProps) => {
    // const {user, googleSignIn, logOut} = UserAuth()

    // const handleSignIn = async () => {
    //     try{
    //         await googleSignIn()
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    const isSmallMode = mode === "small"

    const getLight = (light: ILight) => {
        const ligtsTypeMap: {
            [id: string]: ReactNode
        } = {
            ambient: <ambientLight intensity={0.1} />,
            directional: <directionalLight position={[5, 5, 1]} />,
            hemisphere: <hemisphereLight />,
            point: <pointLight />,
            rect: <rectAreaLight />,
            spot: <spotLight />
        }

        return ligtsTypeMap[light?.type]
    }

    const lightsArray = lights.map(light => getLight(light))

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
