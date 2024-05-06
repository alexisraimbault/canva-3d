import { FC } from "react";
import React, { useState, useEffect } from 'react';

import { ThreeWrapper } from "./ThreeWrapper";
import { ILight, IGeometry, IInteraction, IMaterial } from "../utils.js/types";

type EditorBlockPropsTypes = {
    lights: ILight[];
    geometry: IGeometry;
    material: IInteraction;
    interaction: IMaterial;
    onUpdateGeometries: (g: string) => void;
    onUpdateMaterials: (m: string) => void;
    onUpdateInteraction: (i: string) => void;
};

export const EditorBlock = ({
    lights,
    geometry,
    material,
    interaction,
    onUpdateGeometries,
    onUpdateMaterials,
    onUpdateInteraction
}: EditorBlockPropsTypes) => {
    // const [lights, setLights] = useState([{type: 'ambient'}, {type: 'directional'}])
    // const [geometry, setGeometry] = useState({type: 'box'})
    // const [material, setMaterial] = useState({type: 'standard'})
    // const [interaction, setInteraction] = useState({type: 'mouse'})

    const geometries = [
        'box',
        'capsule',
        'dodecahedron',
        'icosahedron',
        'octahedron',
        'sphere',
        'torus',
        'torusKnot',
        'tube',
        'edges',
        'wireframe',
    ]

    const materials = [
        'basic',
        'depth',
        'lambert',
        'matcap',
        'normal',
        'phong',
        'physical',
        'standard',
        'toon',
    ]

    const interactions = [
        'mouse',
        'timer',
        'scroll'
    ]

    return (
        <div>
            {geometries.map(g => {

                return (
                    <div
                        onClick={() => onUpdateGeometries(g)}
                    >
                        {g}
                    </div>
                )
            })}
            {materials.map(m => {

                return (
                    <div
                        onClick={() => onUpdateMaterials(m)}
                    >
                        {m}
                    </div>
                )
            })}
            {interactions.map(i => {

                return (
                    <div
                        onClick={() => onUpdateInteraction(i)}
                    >
                        {i}
                    </div>
                )
            })}
            <ThreeWrapper
                geometry={geometry}
                material={material}
                interaction={interaction}
                lights={lights}
            />
        </div>
    );
}
