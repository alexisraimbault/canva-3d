import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
// import { ref, push, get } from "firebase/database";
import { ref, get } from "firebase/database";
// import { Dialog } from 'primereact/dialog';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';

import { database } from '../utils.js/firebase';
import { defaultProject } from '../utils.js/statics';
import { ProjectV2Type } from "../utils.js/types";
import { EditorV2ItemRenderer } from '../components/EditorV2ItemRenderer';

type IProjectProps = {
    projectNameProps?: string;
};

export const Project = ({ projectNameProps }: IProjectProps) => {
    const { projectId: urlProjectId, userId: urlUserId, projectName } = useParams()

    const [projectData, setProjectData] = useState<ProjectV2Type>(defaultProject)
    const [hasLoaded, setHasLoaded] = useState(false)
    console.log({ hasLoaded })

    // const [isEmailGatherPopupVisible, setIsEmailGatherPopupVisible] = useState(false)
    // const [emailGatherPopupInputText, setEmailGatherPopupInputText] = useState('')

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
        setProjectData(snapshotData)
        setHasLoaded(true)
    }

    // const onAddEmail = () => {
    //     if (!hasLoaded) {
    //         return
    //     }

    //     if (!urlProjectId || !emailGatherPopupInputText || emailGatherPopupInputText.length <= 0) {
    //         return
    //     }

    //     pushEmailToProject(emailGatherPopupInputText, urlProjectId)
    // }

    // const pushEmailToProject = (email: string, urlProjectId: string) => {
    //     if (!urlUserId) {
    //         return
    //     }

    //     const projectEmailRef = ref(database, `emails/${urlUserId}/${urlProjectId}/list`)
    //     const emailData = {
    //         email,
    //         createdAt: Date.now(),
    //     }
    //     push(projectEmailRef, emailData);
    // }

    const isPublished = projectData.name &&
        projectData.name.length > 0 &&
        projectData.published

    return (
        <div className='project-view__wrapper'>
            {isPublished && (
                <div
                    className='project-view__page-content fullpage-wrapper'
                    style={{
                        backgroundColor: `#${projectData.globalBgColor}`,
                    }}
                >
                    {projectData.items.map((projectItem, projectItemIndex) => {
                        return (
                            <EditorV2ItemRenderer
                                key={`item-${projectItemIndex}`}
                                item={projectItem}
                                isLive
                            />
                        )
                    })}
                </div>
            )}
            {!isPublished && (
                <div className="project-view__unpublished-container">
                    <p>{"This project is not published yet."}</p>
                    <br />
                    <p>{"If you are the project owner, you can log in to your account and publish the project."}</p>
                    <br />
                    <p>{"If you just published the project, wait a few minutes."}</p>
                </div>
            )}
            {/* TODO email popup gathering */}
            {/* <Dialog
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
            </Dialog> */}
        </div>
    );
}
