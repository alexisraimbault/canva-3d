import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { ref, push, get } from "firebase/database";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';

import { EditorV2ItemRenderer } from '../components/EditorV2ItemRenderer';
import { BubblesBackground } from '../components/BubblesBackground';
import { NeuralNetworkBackground } from '../components/NeuralNetworkBackground';
import { GradientButton } from '../components/GradientButton';

import { database } from '../utils.js/firebase';
import { defaultPopupButton, defaultProject } from '../utils.js/statics';
import { ButtonType, ProjectV2Type } from "../utils.js/types";
import { responsiveTextSize } from '../utils.js/functions';

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

    const [isItemHovered, setIsItemHovered] = useState(false)

    const toggleDetectOver = (isOvered: boolean) => {
        setIsItemHovered(isOvered)
    }

    const [clickedButtonData, setClickedButtonData] = useState<ButtonType>(defaultPopupButton)

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

    const renderPopupButton = () => {
        const buttonType = clickedButtonData?.type || 'gradient'
        if (buttonType === 'gradient') {
            return (
                <GradientButton
                    className="project-view__email-popup-btn"
                    label={clickedButtonData?.content || ''}
                    onClick={onAddEmail}
                    gradientColors={[
                        clickedButtonData?.backgroundColor,
                        clickedButtonData?.hoverBackgroundColor
                    ]}
                    textColor={clickedButtonData?.textColor}
                    borderRadius={clickedButtonData?.borderRadius || 6}
                    isBold={clickedButtonData?.textWeight === 'bold'}
                    fontSize={responsiveTextSize(1.5)}
                />
            )
        }
        return (
            <button
                className="project-view__email-popup-btn"
                style={{
                    fontFamily: clickedButtonData?.textWeight === 'bold' ? "visby_heavy" : "visby_regular",
                    fontSize: `${responsiveTextSize(1.5)}em`,
                    color: `#${!isItemHovered ?
                        (clickedButtonData?.textColor) :
                        (clickedButtonData?.hoverTextColor)
                        }`,
                    backgroundColor: `#${!isItemHovered ?
                        (clickedButtonData?.backgroundColor) :
                        (clickedButtonData?.hoverBackgroundColor)
                        }`,
                    borderRadius: `${clickedButtonData?.borderRadius || 0}px`,
                }}
                onMouseEnter={() => toggleDetectOver(true)}
                onMouseLeave={() => toggleDetectOver(false)}
                onClick={onAddEmail}
            >
                {clickedButtonData?.content || ''}
            </button>
        )
    }

    return hasLoaded ? (
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
                                    setClickedButtonData={setClickedButtonData}
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
                        {renderPopupButton()}
                    </div>
                </div>
            </Dialog>
        </div>
    ) : (
        <div className="loader-container">
            <ProgressSpinner
                style={{ width: '500px', height: '500px' }}
                strokeWidth="4"
                animationDuration="1s"
            />
        </div>
    );
}
