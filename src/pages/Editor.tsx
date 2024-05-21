import { useState, useEffect } from 'react';
import {
    SignedIn,
    SignedOut,
    useAuth
} from "@kobbleio/react";
import { ref, push, set, get } from "firebase/database";
import { useParams } from 'react-router-dom'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
// import { getAnalytics, setUserId } from "firebase/analytics";

import { EditorBlock } from "../components/EditorBlock";
import { SidebarEditor } from '../components/SidebarEditor';
import { LoggedOutDisplay } from '../components/LoggedOutDisplay';
import { PaginationSidebar } from '../components/PaginationSidebar';

import { ITexts, ILight, IGeometry, IMaterial, IInteraction, IPublishStatus } from "../utils.js/types";
import { database } from '../utils.js/firebase';

type EditorPropsTypes = {};

export const Editor = ({ }: EditorPropsTypes) => {
    const { user } = useAuth();
    const { projectId: urlProjectId } = useParams()

    // const defaultLight: ILight[] = [{ type: 'ambient' }, { type: 'directional' }]
    const defaultLight: ILight[] = [{ type: 'hemisphere' }]
    const defaultGeometry: IGeometry = { type: 'box' }
    const defaultMaterial: IMaterial = { type: 'standard' }
    const defaultInteraction: IInteraction = { type: 'mouse' }
    const defaultTexts: ITexts = { title: '', subtitle: '', CTALabel: '' }
    const defaultPublishStatus: IPublishStatus = { name: '', published: false, publishTime: null }

    const [editingBlock, setEditingBlock] = useState(0)
    const [lights, setLights] = useState([[...defaultLight]])
    const [geometries, setGeometries] = useState([{ ...defaultGeometry }])
    const [materials, setMaterials] = useState([{ ...defaultMaterial }])
    const [interactions, setInteractions] = useState([{ ...defaultInteraction }])
    const [texts, setTexts] = useState([{ ...defaultTexts }])
    const [customDomain, setCustomDomain] = useState('')
    const [projectPublishData, setProjectPublishData] = useState(defaultPublishStatus)

    const [projectId, setProjectId] = useState<string | null>(urlProjectId ? urlProjectId : null)

    const [hasLoaded, setHasLoaded] = useState(urlProjectId ? false : true)

    const [isEmailGatherPopupVisible, setIsEmailGatherPopupVisible] = useState(false)
    const [emailGatherPopupInputText, setEmailGatherPopupInputText] = useState('')

    const [isNameAlreadyTaken, setIsNameAlreadyTaken] = useState(false)

    const [isProjectPublishPopupVisible, setIsProjectPublishPopupVisible] = useState(false)

    const updatePublishName = (newName: string) => {
        const newPublishData = { ...projectPublishData }
        newPublishData.name = newName
        setProjectPublishData(newPublishData)
    }

    const onPublish = async () => {
        const userId = user?.id || undefined
        if (!userId || !projectId) {
            return
        }
        setIsNameAlreadyTaken(false)

        // Checking name availability
        const projectsListRef = ref(database, `publishNames`)
        // TODO query with expression where key = input
        const snapshot = await get(projectsListRef)
        const snapshotData = snapshot.val()
        const allNames = Object.keys(snapshotData).map(item => item.toLowerCase())
        const isTaken = allNames.includes(projectPublishData.name.toLowerCase())
        console.log({ allNames, isTaken })

        if (isTaken) {
            setIsNameAlreadyTaken(true)
            return
        }


        const newPublishData = { ...projectPublishData }
        newPublishData.published = true
        newPublishData.publishTime = Date.now()
        setProjectPublishData(newPublishData)
        // TODO save data on publishNames map
        const projectPublishNameRef = ref(database, `publishNames/${newPublishData.name}`)
        const dataToWrite = {
            projectId,
            userId,
        }
        set(projectPublishNameRef, dataToWrite)
        setIsProjectPublishPopupVisible(false)
    }

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
        setLights(snapshotData?.lights || [...defaultLight])
        setGeometries(snapshotData?.geometries || [{ ...defaultGeometry }])
        setMaterials(snapshotData?.materials || [{ ...defaultMaterial }])
        setInteractions(snapshotData?.interactions || [{ ...defaultInteraction }])
        setTexts(snapshotData?.texts || [{ ...defaultTexts }])
        setCustomDomain(snapshotData?.customDomain || '')
        setProjectPublishData(snapshotData?.publishData || defaultPublishStatus)
        setHasLoaded(true)
    }

    useEffect(() => {
        if (!hasLoaded) {
            return
        }

        onSaveProject()
    }, [hasLoaded, lights, geometries, materials, interactions, texts, customDomain, projectPublishData])

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
            publishData: projectPublishData,
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

    const onAddEmail = () => {
        if (!projectId || !emailGatherPopupInputText || emailGatherPopupInputText.length <= 0) {
            return
        }

        pushEmailToProject(emailGatherPopupInputText, projectId)
    }

    const pushEmailToProject = (email: string, projectId: string) => {
        if (!user) {
            return
        }

        const userId = user.id
        const projectEmailRef = ref(database, `emails/${userId}/${projectId}/list`)
        const emailData = {
            email,
            createdAt: Date.now(),
        }
        push(projectEmailRef, emailData);
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

    const onUpdateCTALabel = (idx: number) => (textContent: string) => {
        const newTexts = [...texts]
        newTexts[idx].CTALabel = textContent
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
                        onUpdateCTALabel={onUpdateCTALabel(editingBlock)}
                    />
                </div>
                <div className='editor__feed-container'>
                    <EditorBlock
                        texts={texts[editingBlock]}
                        lights={lights[editingBlock]}
                        geometry={geometries[editingBlock]}
                        material={materials[editingBlock]}
                        interaction={interactions[editingBlock]}
                        openEmailPopup={() => setIsEmailGatherPopupVisible(true)}
                    />
                </div>
                <div className='editor__pagination-sidebar-container'>
                    <PaginationSidebar
                        lights={lights}
                        geometries={geometries}
                        materials={materials}
                        interactions={interactions}
                        texts={texts}
                        editingBlock={editingBlock}
                        setEditingBlock={setEditingBlock}
                        onAddBlock={onAddBlock}
                        userId={user?.id}
                        projectId={projectId}
                        projectPublishData={projectPublishData}
                        onPublishClick={() => setIsProjectPublishPopupVisible(true)}
                    />
                </div>
                <Dialog
                    header={"Publish project"}
                    visible={isProjectPublishPopupVisible}
                    style={{ width: '600px' }}
                    onHide={() => setIsProjectPublishPopupVisible(false)}
                >
                    <div className='editor__publish-popup-content'>
                        <div className='editor__publish-popup-text'>{"Enter your Project name (visible in url). Only use numbers and letters."}</div>
                        <InputText
                            value={projectPublishData.name || ''}
                            onChange={(e) => updatePublishName(e.target.value)}
                            placeholder="Project name"
                            className='editor__publish-popup-input'
                        />
                        {isNameAlreadyTaken && (
                            <div
                                className='editor__publish-popup-error-message'
                            >
                                {"This project name is already taken, please chose another one. You'll have the possibility to host it on a custom domain soon instead."}
                            </div>
                        )}
                        <Button
                            label="Publish"
                            onClick={onPublish}
                        />
                    </div>
                </Dialog>
                <Dialog
                    header={null}
                    visible={isEmailGatherPopupVisible}
                    style={{ width: '600px' }}
                    onHide={() => setIsEmailGatherPopupVisible(false)}
                >
                    <div className='editor__email-popup-content'>
                        <div className='editor__email-popup-inner'>
                            <div className='quantico-bold editor__email-popup-title'>{texts[editingBlock].CTALabel}</div>
                            <div className='editor__email-popup-text'>{"Enter your email to receive a private access link"}</div>
                            <InputText
                                value={emailGatherPopupInputText || ''}
                                onChange={(e) => setEmailGatherPopupInputText(e.target.value)}
                                placeholder="Email"
                                className='editor__email-popup-input'
                            />
                            <Button
                                label="Register"
                                onClick={onAddEmail}
                            />
                        </div>
                    </div>
                </Dialog>
            </SignedIn>
        </div>
    );
}
