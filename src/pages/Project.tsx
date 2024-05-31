import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { ref, push, get } from "firebase/database";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { database } from '../utils.js/firebase';
import { defaultProject } from '../utils.js/statics';
import { ProjectV2Type } from "../utils.js/types";
import { EditorV2ItemRenderer } from '../components/EditorV2ItemRenderer';
import { BubblesBackground } from '../components/BubblesBackground';
import { NeuralNetworkBackground } from '../components/NeuralNetworkBackground';

type IProjectProps = {
    projectNameProps?: string;
};

export const Project = ({ projectNameProps }: IProjectProps) => {
    const { projectId: urlProjectId, userId: urlUserId, projectName } = useParams()

    const [projectData, setProjectData] = useState<ProjectV2Type>(defaultProject)
    const [hasLoaded, setHasLoaded] = useState(false)

    const [isEmailGatherPopupVisible, setIsEmailGatherPopupVisible] = useState(false)
    const [emailGatherPopupInputText, setEmailGatherPopupInputText] = useState('')
    const [isEmailRegistered, setIsEmailRegistered] = useState(false)

    useEffect(() => {
        fetchInitialData()

    }, [urlProjectId, urlUserId])

    useEffect(() => {
        setIsEmailRegistered(false)

    }, [emailGatherPopupInputText])

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
        setProjectData(snapshotData)
        setHasLoaded(true)
    }

    const onAddEmail = async () => {
        if (!hasLoaded) {
            return
        }

        if (!projectName && !urlProjectId && !projectNameProps) {
            return
        }
        if (!projectName && !urlUserId && !projectNameProps) {
            return
        }
        if (!urlProjectId && !urlProjectId && !projectName && !projectNameProps) {
            return
        }

        if (!emailGatherPopupInputText || emailGatherPopupInputText.length <= 0) {
            return
        }

        if (isEmailRegistered) {
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

        await pushEmailToProject(emailGatherPopupInputText, tmpUrlProjectId, tmpUrlUserId)
        setIsEmailRegistered(true)
    }

    const pushEmailToProject = async (email: string, emailProjectId: string | undefined, emailUserId: string | undefined) => {
        if (!emailProjectId || !emailUserId) {
            return
        }

        const projectEmailRef = ref(database, `emails/${emailUserId}/${emailProjectId}/list`)
        const emailData = {
            email,
            createdAt: Date.now(),
        }
        await push(projectEmailRef, emailData);
    }

    const isPublished = projectData?.name &&
        projectData.name.length > 0 &&
        projectData.published

    const defaultPopupTexts = {
        title: "Early access"
    }

    const renderSpecialBackground = () => {
        if (projectData?.globalBgSpecialSettings?.type === 'bubbles') {
            return (
                <BubblesBackground
                    settings={projectData?.globalBgSpecialSettings}
                    globalBgColor={projectData.globalBgColor}
                />
            )
        }
        if (projectData?.globalBgSpecialSettings?.type === 'network') {
            return (
                <NeuralNetworkBackground
                    settings={projectData?.globalBgSpecialSettings}
                    globalBgColor={projectData.globalBgColor}
                />
            )
        }

        return
    }

    return (
        <div className='project-view__wrapper'>
            {isPublished && (
                <div
                    className='project-view__page-content'
                >
                    <div className="project-view__page-content-inner">
                        {projectData?.items?.map((projectItem, projectItemIndex) => {
                            return (
                                <EditorV2ItemRenderer
                                    key={`item-${projectItemIndex}`}
                                    item={projectItem}
                                    isLive
                                    toggleEmailPopup={() => setIsEmailGatherPopupVisible(true)}
                                />
                            )
                        })}
                    </div>
                    {renderSpecialBackground()}
                </div>
            )}
            {!isPublished && (
                <div className="project-view__unpublished-container">
                    <p>{"This project is not published yet."}</p>
                    <p>{"If you are the project owner, you can log in to your account and publish the project."}</p>
                    <p>{"If you just published the project, wait a few minutes or contact support."}</p>
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
                        <div className='quantico-bold project-view__email-popup-title'>{defaultPopupTexts.title}</div>
                        <div className='project-view__email-popup-text'>{"Enter your email to receive a private access link"}</div>
                        <InputText
                            value={emailGatherPopupInputText || ''}
                            onChange={(e) => setEmailGatherPopupInputText(e.target.value)}
                            placeholder="Email"
                            className='project-view__email-popup-input'
                        />
                        {isEmailRegistered && (
                            <div className='project-view__email-popup-confirm'>
                                {"Your email is registered, we will contact you shortly !"}
                            </div>
                        )}
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
