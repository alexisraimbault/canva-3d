import { FC, useState } from "react";
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { ref, get } from "firebase/database";

import { EditorBlock } from "./EditorBlock";

import { ILight, IGeometry, IInteraction, IMaterial, ITexts } from "../utils.js/types";
import { database } from '../utils.js/firebase';

type IPaginationSidebarProps = {
    lights: ILight[][];
    geometries: IGeometry[];
    materials: IMaterial[];
    interactions: IInteraction[];
    texts: ITexts[];
    editingBlock: number;
    setEditingBlock: (n: number) => void;
    onAddBlock: (n: number | undefined) => void;
    projectPublishName: string | undefined;
    onPublishClick: () => void;
    userId: string | undefined;
    projectId: string | null;
};

type emailType = {
    createdAt: number;
    email: string;
}

type emailStateType = { [key: string]: emailType }

export const PaginationSidebar: FC<IPaginationSidebarProps> = ({
    lights,
    geometries,
    materials,
    interactions,
    texts,
    editingBlock,
    setEditingBlock,
    onAddBlock,
    projectPublishName,
    onPublishClick,
    userId,
    projectId,
}) => {
    const navigate = useNavigate()

    const [isEmailGatheredPopupVisible, setIsEmailGatheredPopupVisible] = useState(false)
    const [gatheredEmails, setGatheredEmails] = useState<emailStateType>({})

    const navigateToListing = () => {
        navigate(`/listing`)
    }

    const displayEmails = async () => {
        if (!userId || !projectId) {
            return
        }
        setIsEmailGatheredPopupVisible(true)
        setGatheredEmails({})
        const projectEmailsRef = ref(database, `emails/${userId}/${projectId}/list`)
        const snapshot = await get(projectEmailsRef)
        const snapshotData = snapshot.val()
        setGatheredEmails(snapshotData)
    }

    return (
        <div className="pagination-sidebar__wrapper">
            <div className="pagination-sidebar__items">
                {geometries.map((_geometry, geometryIdx) => {
                    const isSelected = editingBlock === geometryIdx

                    return (
                        <div
                            key={`psi-${geometryIdx}`}
                            className={`pagination-sidebar__item${isSelected ? ' pagination-sidebar__item--selected' : ''}`}
                            onClick={() => setEditingBlock(geometryIdx)}
                        >
                            <EditorBlock
                                texts={texts[geometryIdx]}
                                lights={lights[geometryIdx]}
                                geometry={geometries[geometryIdx]}
                                material={materials[geometryIdx]}
                                interaction={interactions[geometryIdx]}
                                mode="small"
                            />
                        </div>
                    )
                })}
            </div>
            <Button
                onClick={() => onAddBlock(undefined)}
                label="Add a block"
            />
            {((!projectPublishName) || projectPublishName.length <= 0) && (
                <Button
                    onClick={() => onPublishClick()}
                    label="Publish"
                />
            )}
            {projectPublishName && projectPublishName.length > 0 && (
                <div className="pagination-sidebar__project-name">
                    {projectPublishName}
                </div>
            )}
            <Button
                onClick={() => navigateToListing()}
                label="Back to listing"
            />
            <Button
                onClick={() => displayEmails()}
                label="Emails"
            />
            <Dialog
                header={"Gathered emails"}
                visible={isEmailGatheredPopupVisible}
                style={{ width: '600px' }}
                onHide={() => setIsEmailGatheredPopupVisible(false)}
            >
                <div className='pagination-sidebar__email-popup-content'>
                    {gatheredEmails && Object.keys(gatheredEmails).map(key => {

                        const emailData = gatheredEmails[key]
                        return (
                            <div
                                key={`email-${key}`}
                                className="pagination-sidebar__email-line"
                            >
                                {emailData?.email}
                            </div>
                        )
                    })}
                </div>
            </Dialog>
        </div>
    );
}
