import { useState } from 'react';

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

import { ITexts, ILight, IGeometry, IMaterial, IInteraction } from "../utils.js/types";

type SidebarEditorPropsTypes = {
    lights: ILight[];
    geometry: IGeometry;
    material: IInteraction;
    interaction: IMaterial;
    texts: ITexts;
    customDomain: string;
    projectId: string | null;
    onUpdateGeometries: (g: string) => void;
    onUpdateMaterials: (m: string) => void;
    onUpdateInteraction: (i: string) => void;
    onUpdateTitle: (i: string) => void;
    onUpdateSubtitle: (i: string) => void;
    onEditCustomDomain: (i: string) => void;
};

export const SidebarEditor = ({
    // lights,
    geometry,
    material,
    interaction,
    texts,
    projectId,
    customDomain,
    onUpdateGeometries,
    onUpdateMaterials,
    onUpdateInteraction,
    onUpdateTitle,
    onUpdateSubtitle,
    // onEditCustomDomain
}: SidebarEditorPropsTypes) => {

    const [isCustomDomainPopupVisible, setIsCustomDomainPopupVisible] = useState(false)
    const [customDomainPopupInputText, setCustomDomainPopupInputText] = useState(customDomain)

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

    const onAddDomain = async () => {

        // var xhr = new XMLHttpRequest();
        // xhr.open("POST", url, true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.setRequestHeader('Accept', 'application/json');
        // xhr.setRequestHeader('api-key', import.meta.env.VITE_DOMAIN_API_KEY);
        // xhr.send(JSON.stringify(data));

        const url = 'https://cloud.approximated.app/api/vhosts'
        const data = {
            incoming_address: customDomainPopupInputText,
            target_address: `canva-3d.com/project/${projectId}`,
            target_ports: "443"
        }

        const approximatedApiRes = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': import.meta.env.VITE_DOMAIN_API_KEY
            },
            mode: "no-cors",
            body: JSON.stringify(data)
        })
        console.log({ approximatedApiRes })
        const response = await approximatedApiRes.json()
        console.log({ response })
    }


    return (
        <div className='sidebar-editor__wrapper'>
            {projectId && customDomain && customDomain.length > 0 && (
                <div>
                    <div>{"Custom Domain"}</div>
                    <div>{customDomain}</div>
                    <div>{"Edit Custom Domain"}</div>
                </div>
            )}
            {projectId && (!customDomain || customDomain.length <= 0) && (
                <>
                    <div onClick={() => setIsCustomDomainPopupVisible(true)}>{"Add custom Domain"}</div>
                    <Dialog header="Setup Custom Domain" visible={isCustomDomainPopupVisible} style={{ width: '50vw' }} onHide={() => setIsCustomDomainPopupVisible(false)}>
                        <div>
                            <InputText
                                value={customDomainPopupInputText || ''}
                                onChange={(e) => setCustomDomainPopupInputText(e.target.value)}
                                placeholder="Custom Domain"
                                className='sidebar-editor__form-input-container'
                            />
                            <div
                                onClick={onAddDomain}
                            >
                                {"Add custom domain"}
                            </div>
                        </div>
                    </Dialog>
                </>
            )}
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
