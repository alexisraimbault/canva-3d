import { FC } from "react";
import React, { useState, useEffect } from 'react';

import { EditorBlock } from "../components/EditorBlock";

import { ILight, IGeometry, IMaterial, IInteraction } from "../utils.js/types";

type EditorPropsTypes = {};

export const Editor = ({ }: EditorPropsTypes) => {
    // export const Editor = (props) => {
    const defaultLight: ILight[] = [{ type: 'ambient' }, { type: 'directional' }]
    const defaultGeometry: IGeometry = { type: 'box' }
    const defaultMaterial: IMaterial = { type: 'standard' }
    const defaultInteraction: IInteraction = { type: 'mouse' }

    const [lights, setLights] = useState([defaultLight])
    const [geometries, setGeometries] = useState([defaultGeometry])
    const [materials, setMaterials] = useState([defaultMaterial])
    const [interactions, setInteractions] = useState([defaultInteraction])

    const onUpdateGeometries = (idx: number) => (g: string) => {
        const newGeometries = [...geometries]
        newGeometries[idx] = { type: g }
        setGeometries(newGeometries)
    }

    const onUpdateMaterials = (idx: number) => (m: string) => {
        const newMaterials = [...materials]
        newMaterials[idx] = { type: m }
        setMaterials(newMaterials)
    }

    const onUpdateInteraction = (idx: number) => (i: string) => {
        const newInteractions = [...interactions]
        newInteractions[idx] = { type: i }
        setInteractions(newInteractions)
    }

    const onAddBlock = (insertionIndex: number | undefined) => {
        console.log('TESTTT')
        const newLights = [...lights]
        const newGeometries = [...geometries]
        const newMaterials = [...materials]
        const newInteractions = [...interactions]

        if (insertionIndex && insertionIndex !== undefined) {
            newLights.splice(insertionIndex, 0, defaultLight)
            newGeometries.splice(insertionIndex, 0, defaultGeometry)
            newMaterials.splice(insertionIndex, 0, defaultMaterial)
            newInteractions.splice(insertionIndex, 0, defaultInteraction)
        } else {
            newLights.push(defaultLight)
            newGeometries.push(defaultGeometry)
            newMaterials.push(defaultMaterial)
            newInteractions.push(defaultInteraction)
        }

        setLights(newLights)
        setGeometries(newGeometries)
        setMaterials(newMaterials)
        setInteractions(newInteractions)
    }

    return (
        <div>
            {geometries.map((_geometry, geometryIdx) => (
                <EditorBlock
                    lights={lights[geometryIdx]}
                    geometry={geometries[geometryIdx]}
                    material={materials[geometryIdx]}
                    interaction={interactions[geometryIdx]}
                    onUpdateGeometries={onUpdateGeometries(geometryIdx)}
                    onUpdateMaterials={onUpdateMaterials(geometryIdx)}
                    onUpdateInteraction={onUpdateInteraction(geometryIdx)}
                />
            ))}
            <div
                onClick={() => onAddBlock(undefined)}
            >
                Add a block
            </div>
            {/* <div
                onClick={onSaveLanding}
            >
                Save landing page
            </div> */}
        </div>
    );
}
