import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { ref, push, get } from "firebase/database";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { EditorBlock } from "../components/EditorBlock";

import { database } from '../utils.js/firebase';
import { ITexts, ILight, IGeometry, IMaterial, IInteraction, IPublishStatus } from "../utils.js/types";

type IProjectProps = {
    projectNameProps?: string;
};

export const Project = ({ projectNameProps }: IProjectProps) => {
    const { projectId: urlProjectId, userId: urlUserId, projectName } = useParams()

    const defaultLight: ILight[] = [{ type: 'ambient' }, { type: 'directional' }]
    const defaultGeometry: IGeometry = { type: 'box' }
    const defaultMaterial: IMaterial = { type: 'standard' }
    const defaultInteraction: IInteraction = { type: 'timer' }
    const defaultTexts: ITexts = { title: '', subtitle: '', CTALabel: '' }
    const defaultPublishStatus: IPublishStatus = { name: '', published: false, publishTime: null }

    // const [editingBlock, setEditingBlock] = useState(0)
    const [lights, setLights] = useState([[...defaultLight]])
    const [geometries, setGeometries] = useState([{ ...defaultGeometry }])
    const [materials, setMaterials] = useState([{ ...defaultMaterial }])
    const [interactions, setInteractions] = useState([{ ...defaultInteraction }])
    const [texts, setTexts] = useState([{ ...defaultTexts }])
    const [projectPublishData, setProjectPublishData] = useState(defaultPublishStatus)
    // const [customDomain, setCustomDomain] = useState('')    
    const [hasLoaded, setHasLoaded] = useState(false)

    const [emailPopupTexts, setEmailPopupTexts] = useState(defaultTexts)
    const [isEmailGatherPopupVisible, setIsEmailGatherPopupVisible] = useState(false)
    const [emailGatherPopupInputText, setEmailGatherPopupInputText] = useState('')

    useEffect(() => {
        fetchInitialData()

    }, [urlProjectId, urlUserId])

    const fetchInitialData = async () => {
        if (!projectName && !urlProjectId && !projectNameProps) {
            return
        }
        if (!projectName && !urlUserId && !projectNameProps) {
            return
        }
        if (!urlProjectId && !urlProjectId && !projectName && !projectNameProps) {
            return
        }

        let tmpUrlUserId = urlUserId
        let tmpUrlProjectId = urlProjectId

        if (projectName) {
            const projectBasicInfoRef = ref(database, `publishNames/${projectName}`)
            const snapshotBasicInfo = await get(projectBasicInfoRef)
            const snapshotBasicInfoData = snapshotBasicInfo.val()
            tmpUrlUserId = snapshotBasicInfoData?.userId
            tmpUrlProjectId = snapshotBasicInfoData?.projectId
        }

        if (projectNameProps) {
            const projectBasicInfoRef = ref(database, `publishNames/${projectNameProps}`)
            const snapshotBasicInfo = await get(projectBasicInfoRef)
            const snapshotBasicInfoData = snapshotBasicInfo.val()
            tmpUrlUserId = snapshotBasicInfoData?.userId
            tmpUrlProjectId = snapshotBasicInfoData?.projectId
        }

        const projectRef = ref(database, `users/${tmpUrlUserId}/projects/${tmpUrlProjectId}`)
        const snapshot = await get(projectRef)
        const snapshotData = snapshot.val()
        setLights(snapshotData?.lights || [...defaultLight])
        setGeometries(snapshotData?.geometries || [{ ...defaultGeometry }])
        setMaterials(snapshotData?.materials || [{ ...defaultMaterial }])
        setInteractions(snapshotData?.interactions || [{ ...defaultInteraction }])
        setTexts(snapshotData?.texts || [{ ...defaultTexts }])
        setProjectPublishData(snapshotData?.publishData || defaultPublishStatus)
        // setCustomDomain(snapshotData?.customDomain || '')
        setHasLoaded(true)
    }

    const onAddEmail = () => {
        if (!hasLoaded) {
            return
        }

        if (!urlProjectId || !emailGatherPopupInputText || emailGatherPopupInputText.length <= 0) {
            return
        }

        pushEmailToProject(emailGatherPopupInputText, urlProjectId)
    }

    const pushEmailToProject = (email: string, urlProjectId: string) => {
        if (!urlUserId) {
            return
        }

        const projectEmailRef = ref(database, `emails/${urlUserId}/${urlProjectId}/list`)
        const emailData = {
            email,
            createdAt: Date.now(),
        }
        push(projectEmailRef, emailData);
        // const newEmail = push(projectEmailRef, emailData);
        // const newEmailId = newEmail.key
        // console.log({ newEmailId })
    }

    const isPublished = projectPublishData.name &&
        projectPublishData.name.length > 0 &&
        projectPublishData.published

    return (
        <div className='project-view__wrapper'>
            {isPublished && (
                <div className='project-view__feed-container'>
                    {geometries && geometries.map((geometry, geometryIndex) => {

                        return (
                            <EditorBlock
                                key={`bl-${geometryIndex}`}
                                texts={texts[geometryIndex]}
                                lights={lights[geometryIndex]}
                                geometry={geometry}
                                material={materials[geometryIndex]}
                                interaction={interactions[geometryIndex]}
                                openEmailPopup={() => {
                                    setIsEmailGatherPopupVisible(true)
                                    setEmailPopupTexts(texts[geometryIndex])
                                }}
                                mode="full"
                            />
                        )
                    })}
                </div>
            )}
            {!isPublished && (
                <div className="project-view__unpublished-container">
                    {"This project is not published yet. \n If you are the project owner, you can log in to your account and publish the project \n If you just published the project, wait a few minutes \n"}
                </div>
            )}
            <Dialog
                header={null}
                visible={isEmailGatherPopupVisible}
                style={{ width: '600px' }}
                onHide={() => setIsEmailGatherPopupVisible(false)}
            >
                <div className='project-view__email-popup-content'>
                    <div className='project-view__email-popup-inner'>
                        <div className='quantico-bold project-view__email-popup-title'>{emailPopupTexts.CTALabel}</div>
                        <div className='project-view__email-popup-text'>{"Enter your email to receive a private access link"}</div>
                        <InputText
                            value={emailGatherPopupInputText || ''}
                            onChange={(e) => setEmailGatherPopupInputText(e.target.value)}
                            placeholder="Email"
                            className='project-view__email-popup-input'
                        />
                        <Button
                            label="Register"
                            onClick={onAddEmail}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
