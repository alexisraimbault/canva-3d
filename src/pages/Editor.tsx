import { useState, useEffect } from 'react';
import {
    SignedIn,
    SignedOut,
    useAuth
} from "@kobbleio/react";
import { ref, push, set, get } from "firebase/database";
import { useParams } from 'react-router-dom'
// import { getAnalytics, setUserId } from "firebase/analytics";

import { EditorBlock } from "../components/EditorBlock";
import { SidebarEditor } from '../components/SidebarEditor';
import { LoggedOutDisplay } from '../components/LoggedOutDisplay';

import { ITexts, ILight, IGeometry, IMaterial, IInteraction } from "../utils.js/types";
import { database } from '../utils.js/firebase';

type EditorPropsTypes = {};

export const Editor = ({ }: EditorPropsTypes) => {
    const { user } = useAuth();
    const { projectId: urlProjectId } = useParams()

    const defaultLight: ILight[] = [{ type: 'ambient' }, { type: 'directional' }]
    const defaultGeometry: IGeometry = { type: 'box' }
    const defaultMaterial: IMaterial = { type: 'standard' }
    const defaultInteraction: IInteraction = { type: 'mouse' }
    const defaultTexts: ITexts = { title: '', subtitle: '' }

    const [editingBlock, setEditingBlock] = useState(0)
    const [lights, setLights] = useState([[...defaultLight]])
    const [geometries, setGeometries] = useState([{ ...defaultGeometry }])
    const [materials, setMaterials] = useState([{ ...defaultMaterial }])
    const [interactions, setInteractions] = useState([{ ...defaultInteraction }])
    const [texts, setTexts] = useState([{ ...defaultTexts }])
    const [customDomain, setCustomDomain] = useState('')

    const [projectId, setProjectId] = useState<string | null>(urlProjectId ? urlProjectId : null)

    useEffect(() => {
        fetchInitialData()

    }, [urlProjectId, user])

    const fetchInitialData = async () => {
        if (!user) {
            return
        }
        if (!urlProjectId) {
            return
        }

        const userId = user.id
        const projectRef = ref(database, `users/${userId}/projects/${urlProjectId}`)
        const snapshot = await get(projectRef)
        const snapshotData = snapshot.val()
        setLights(snapshotData.lights)
        setGeometries(snapshotData.geometries)
        setMaterials(snapshotData.materials)
        setInteractions(snapshotData.interactions)
        setTexts(snapshotData.texts)
        setCustomDomain(snapshotData.customDomain)
    }

    const onSaveProject = () => {
        if (!user) {
            return
        }

        const userId = user.id
        // const analytics = getAnalytics();
        // setUserId(analytics, userId);

        const userProjectsPagesListRef = ref(database, `users/${userId}/projects`)
        const projectData = {
            lights,
            geometries,
            materials,
            interactions,
            texts,
            customDomain,
        }

        const isFirstSave = !projectId

        if (isFirstSave) {
            const newProjectRef = push(userProjectsPagesListRef, projectData);
            const newProjectId = newProjectRef.key
            console.log({ newProjectId })
            setProjectId(newProjectId)
        } else {
            const projectRef = ref(database, `users/${userId}/projects/${projectId}`)
            set(projectRef, projectData)
        }
    }

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

    const onUpdateTitle = (idx: number) => (textContent: string) => {
        const newTexts = [...texts]
        newTexts[idx].title = textContent
        console.log('Updating title', JSON.stringify({ idx, texts, newTexts }))
        setTexts(newTexts)
    }

    const onUpdateSubtitle = (idx: number) => (textContent: string) => {
        const newTexts = [...texts]
        newTexts[idx].subtitle = textContent
        setTexts(newTexts)
    }

    const onAddBlock = (insertionIndex: number | undefined) => {
        const newLights = [...lights]
        const newGeometries = [...geometries]
        const newMaterials = [...materials]
        const newInteractions = [...interactions]
        const newTexts = [...texts]

        if (insertionIndex && insertionIndex !== undefined) {
            newLights.splice(insertionIndex, 0, [...defaultLight])
            newGeometries.splice(insertionIndex, 0, { ...defaultGeometry })
            newMaterials.splice(insertionIndex, 0, { ...defaultMaterial })
            newInteractions.splice(insertionIndex, 0, { ...defaultInteraction })
            newTexts.splice(insertionIndex, 0, { ...defaultTexts })
        } else {
            newLights.push([...defaultLight])
            newGeometries.push({ ...defaultGeometry })
            newMaterials.push({ ...defaultMaterial })
            newInteractions.push({ ...defaultInteraction })
            newTexts.push({ ...defaultTexts })
        }

        setLights(newLights)
        setGeometries(newGeometries)
        setMaterials(newMaterials)
        setInteractions(newInteractions)
        setTexts(newTexts)
        setEditingBlock(
            insertionIndex && insertionIndex !== undefined ?
                insertionIndex :
                newInteractions.length - 1
        )
    }

    return (
        <div className='editor__wrapper'>
            <SignedOut>
                <LoggedOutDisplay />
            </SignedOut>
            <SignedIn>
                <div className='editor__sidebar-container'>
                    <SidebarEditor
                        projectId={projectId}
                        texts={texts[editingBlock]}
                        lights={lights[editingBlock]}
                        geometry={geometries[editingBlock]}
                        material={materials[editingBlock]}
                        interaction={interactions[editingBlock]}
                        customDomain={customDomain}
                        onEditCustomDomain={setCustomDomain}
                        onUpdateGeometries={onUpdateGeometries(editingBlock)}
                        onUpdateMaterials={onUpdateMaterials(editingBlock)}
                        onUpdateInteraction={onUpdateInteraction(editingBlock)}
                        onUpdateTitle={onUpdateTitle(editingBlock)}
                        onUpdateSubtitle={onUpdateSubtitle(editingBlock)}
                    />
                </div>
                <div className='editor__feed-container'>
                    {geometries.map((_geometry, geometryIdx) => (
                        <div
                            onClick={() => setEditingBlock(geometryIdx)}
                        >
                            <EditorBlock
                                texts={texts[geometryIdx]}
                                lights={lights[geometryIdx]}
                                geometry={geometries[geometryIdx]}
                                material={materials[geometryIdx]}
                                interaction={interactions[geometryIdx]}
                                onUpdateGeometries={onUpdateGeometries(geometryIdx)}
                                onUpdateMaterials={onUpdateMaterials(geometryIdx)}
                                onUpdateInteraction={onUpdateInteraction(geometryIdx)}
                            />
                        </div>
                    ))}
                    <div
                        onClick={() => onAddBlock(undefined)}
                    >
                        Add a block
                    </div>
                    <div
                        onClick={onSaveProject}
                    >
                        {"Save"}
                    </div>
                </div>
            </SignedIn>
        </div>
    );
}
