import React, { useState, useEffect } from 'react';

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';


import { ITexts, ILight, IGeometry, IMaterial, IInteraction } from "../utils.js/types";

type SidebarEditorPropsTypes = {
    lights: ILight[];
    geometry: IGeometry;
    material: IInteraction;
    interaction: IMaterial;
    texts: ITexts;
    onUpdateGeometries: (g: string) => void;
    onUpdateMaterials: (m: string) => void;
    onUpdateInteraction: (i: string) => void;
    onUpdateTitle: (i: string) => void;
    onUpdateSubtitle: (i: string) => void;
};

export const SidebarEditor = ({
    lights,
    geometry,
    material,
    interaction,
    texts,
    onUpdateGeometries,
    onUpdateMaterials,
    onUpdateInteraction,
    onUpdateTitle,
    onUpdateSubtitle
}: SidebarEditorPropsTypes) => {

    const geometries = [
        {
            label: 'Box',
            value: 'box'
        },
        {
            label: 'Capsule',
            value: 'capsule'
        },
        {
            label: 'Dodecahedron',
            value: 'dodecahedron'
        },
        {
            label: 'Icosahedron',
            value: 'icosahedron'
        },
        {
            label: 'Octahedron',
            value: 'octahedron'
        },
        {
            label: 'Sphere',
            value: 'sphere'
        },
        {
            label: 'Torus',
            value: 'torus'
        },
        {
            label: 'TorusKnot',
            value: 'torusKnot'
        },
        {
            label: 'Tube',
            value: 'tube'
        },
        {
            label: 'Edges',
            value: 'edges'
        },
        {
            label: 'Wireframe',
            value: 'wireframe'
        },
    ]

    const materials = [
        {
            label: 'Basic',
            value: 'basic',
        },
        {
            label: 'Depth',
            value: 'depth',
        },
        {
            label: 'Lambert',
            value: 'lambert',
        },
        {
            label: 'Matcap',
            value: 'matcap',
        },
        {
            label: 'Normal',
            value: 'normal',
        },
        {
            label: 'Phong',
            value: 'phong',
        },
        {
            label: 'Physical',
            value: 'physical',
        },
        {
            label: 'Standard',
            value: 'standard',
        },
        {
            label: 'Toon',
            value: 'toon',
        },
    ]

    const interactions = [
        {
            label: 'Mouse',
            value: 'mouse',
        },
        {
            label: 'Timer',
            value: 'timer',
        },
        {
            label: 'Scroll',
            value: 'scroll',
        },
    ]

    const onGeometryChange = (e: DropdownChangeEvent) => {
        onUpdateGeometries(e.target.value)
    }

    const onMaterialChange = (e: DropdownChangeEvent) => {
        onUpdateMaterials(e.target.value)
    }

    const onInteractionChange = (e: DropdownChangeEvent) => {
        onUpdateInteraction(e.target.value)
    }

    return (
        <div className='sidebar-editor__wrapper'>
            <Dropdown
                value={geometry.type}
                onChange={onGeometryChange}
                options={geometries}
                placeholder="Select a Geometry"
                className='sidebar-editor__form-input-container'
            />
            <Dropdown
                value={material.type}
                onChange={onMaterialChange}
                options={materials}
                placeholder="Select a Material"
                className='sidebar-editor__form-input-container'
            />
            <Dropdown
                value={interaction.type}
                onChange={onInteractionChange}
                options={interactions}
                placeholder="Select an interaction"
                className='sidebar-editor__form-input-container'
            />
            <InputText
                value={texts?.title || ''}
                onChange={(e) => onUpdateTitle(e.target.value)}
                placeholder="Title"
                className='sidebar-editor__form-input-container'
            />
            <InputText
                value={texts?.subtitle || ''}
                onChange={(e) => onUpdateSubtitle(e.target.value)}
                placeholder="Subtitle"
                className='sidebar-editor__form-input-container'
            />
        </div>
    );
}
