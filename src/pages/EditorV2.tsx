import { useState, useEffect } from 'react';
import {
    SignedIn,
    SignedOut,
    useAuth
} from "@kobbleio/react";
import { useParams } from 'react-router-dom'
import { ref, push, set, get } from "firebase/database";

import { LoggedOutDisplay } from '../components/LoggedOutDisplay';
import { EditorV2Sidebar } from '../components/EditorV2Sidebar';
import { EditorV2ItemRenderer } from '../components/EditorV2ItemRenderer';

import { ProjectV2Type, ItemType } from '../utils.js/types';
import { database } from '../utils.js/firebase';
import { defaultProject } from '../utils.js/statics';

type EditorV2PropsTypes = {};

export const EditorV2 = ({ }: EditorV2PropsTypes) => {
    const { user } = useAuth();
    const { projectId: urlProjectId } = useParams()

    const [projectData, setProjectData] = useState<ProjectV2Type>({ ...defaultProject })
    const [selectedItemIndexPath, setSelectedItemIndexPath] = useState<number[] | null>(null)
    const [projectId, setProjectId] = useState<string | null>(urlProjectId ? urlProjectId : null)
    const [hasLoaded, setHasLoaded] = useState(urlProjectId ? false : true)
    const [isNameAlreadyTaken, setIsNameAlreadyTaken] = useState(false)

    const isSidebarBackgroundSelection = selectedItemIndexPath !== null && selectedItemIndexPath.length === 1 && selectedItemIndexPath[0] === -1
    const isSidebarItemSelected = selectedItemIndexPath !== null && !isSidebarBackgroundSelection

    useEffect(() => {
        fetchInitialData()
    }, [urlProjectId, user])

    useEffect(() => {
        if (!hasLoaded) {
            return
        }

        onSaveProject()
    }, [hasLoaded, projectData])


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
        const projectInit = { ...defaultProject, ...snapshotData }
        setProjectData(projectInit)
        setHasLoaded(true)
    }

    const onSaveProject = () => {
        if (!user) {
            return
        }

        const userId = user.id
        // const analytics = getAnalytics();
        // setUserId(analytics, userId);

        const userProjectsPagesListRef = ref(database, `users/${userId}/projects`)

        const isFirstSave = !projectId

        if (isFirstSave) {
            const newProjectRef = push(userProjectsPagesListRef, projectData);
            const newProjectId = newProjectRef.key
            setProjectId(newProjectId)
        } else {
            const projectRef = ref(database, `users/${userId}/projects/${projectId}`)
            set(projectRef, projectData)
        }
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
        const allNames = snapshotData === null ? [] : Object.keys(snapshotData).map(item => item.toLowerCase())
        const isTaken = allNames.includes(projectData.name.toLowerCase())

        if (isTaken) {
            setIsNameAlreadyTaken(true)
            return
        }

        const projectPublishNameRef = ref(database, `publishNames/${projectData.name}`)
        const dataToWrite = {
            projectId,
            userId,
        }
        set(projectPublishNameRef, dataToWrite)

        const newProjectData = { ...projectData }
        newProjectData.published = true
        newProjectData.publishTime = Date.now()
        setProjectData(newProjectData)
    }

    const addItem = (itemToAdd: ItemType) => {
        const newProject = { ...projectData }
        newProject.items.push(itemToAdd)
        setProjectData(newProject)
        setSelectedItemIndexPath([newProject.items.length - 1])
    }

    const setItemPathValueAndRetrieveRec = (path: number[], newItemValue: ItemType, itemsTree: ItemType[]) => {
        if (path.length === 1) {
            itemsTree[path[0]] = newItemValue
            return itemsTree
        }

        // if(path[0] === undefined) {
        //     return
        // }

        // if(itemsTree[path[0]] === undefined) {
        //     return
        // }

        // if(itemsTree[path[0]].containerData === undefined) {
        //     return
        // }

        // if(itemsTree[path[0]].containerData === undefined) {
        //     return
        // }

        itemsTree[path[0]].containerData!.children = setItemPathValueAndRetrieveRec(
            path.slice(1),
            newItemValue,
            itemsTree[path[0]]?.containerData?.children || []
        )

        return itemsTree
    }

    const removeItemWithPathAndRetrieveRec = (path: number[], itemsTree: ItemType[]) => {
        if (path.length === 1) {
            itemsTree.splice(path[0], 1)
            return itemsTree
        }

        // if(path[0] === undefined) {
        //     return
        // }

        // if(itemsTree[path[0]] === undefined) {
        //     return
        // }

        // if(itemsTree[path[0]].containerData === undefined) {
        //     return
        // }

        // if(itemsTree[path[0]].containerData === undefined) {
        //     return
        // }

        itemsTree[path[0]].containerData!.children = removeItemWithPathAndRetrieveRec(
            path.slice(1),
            itemsTree[path[0]]?.containerData?.children || []
        )

        return itemsTree
    }

    const editItem = (itemIndexPath: number[] | null, newItemValue: ItemType) => {
        if (itemIndexPath === null) {
            return
        }
        const newProject = { ...projectData }
        newProject.items = setItemPathValueAndRetrieveRec(itemIndexPath, newItemValue, newProject.items)
        setProjectData(newProject)
    }

    const deleteItem = (itemIndexPath: number[] | null) => {
        if (itemIndexPath === null) {
            return
        }
        const newProject = { ...projectData }
        newProject.items = removeItemWithPathAndRetrieveRec(itemIndexPath, newProject.items)
        setProjectData(newProject)
        setSelectedItemIndexPath(null)
    }

    const onToggleBackgroundCustomisation = () => {
        if (selectedItemIndexPath && selectedItemIndexPath.length === 1 && selectedItemIndexPath[0] === -1) {
            setSelectedItemIndexPath(null)
            return
        }

        setSelectedItemIndexPath([-1])
    }

    return (
        <div className='editorv2__wrapper'>
            <SignedOut>
                <LoggedOutDisplay />
            </SignedOut>
            <SignedIn>
                <div className="editorv2__inner">
                    <EditorV2Sidebar
                        onAddItem={addItem}
                        onEditItem={editItem}
                        selectedItemIndexPath={selectedItemIndexPath}
                        setSelectedItemIndexPath={setSelectedItemIndexPath}
                        items={projectData.items}
                        project={projectData}
                        updateProject={setProjectData}
                        deleteItem={deleteItem}
                        onPublish={onPublish}
                        isNameAlreadyTaken={isNameAlreadyTaken}
                    />
                    <div
                        className={
                            `editorv2__page-content
                            ${(isSidebarBackgroundSelection || isSidebarItemSelected) ? ' editorv2__page-content--reduced' : ''}
                            fullpage-wrapper`
                        }
                        onClick={onToggleBackgroundCustomisation}
                        style={{
                            backgroundColor: `#${projectData.globalBgColor}`,
                        }}
                    >
                        {projectData?.items?.map((projectItem, projectItemIndex) => {
                            return (
                                <EditorV2ItemRenderer
                                    key={`item-${projectItemIndex}`}
                                    item={projectItem}
                                    itemIndexPath={[projectItemIndex]}
                                    isSelected={selectedItemIndexPath?.length === 1 && selectedItemIndexPath[0] === projectItemIndex}
                                    onSelectItem={() => setSelectedItemIndexPath([projectItemIndex])}
                                    setSelectedItemIndexPath={setSelectedItemIndexPath}
                                    relativeSelectedItemIndexPath={selectedItemIndexPath || []}
                                />
                            )
                        })}
                    </div>
                </div>
            </SignedIn>
        </div>
    );
}