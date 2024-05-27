import { useState, useEffect } from 'react';
import {
    SignedIn,
    SignedOut,
    useAuth
} from "@kobbleio/react";

import { LoggedOutDisplay } from '../components/LoggedOutDisplay';
import { EditorV2Sidebar } from '../components/EditorV2Sidebar';
import { EditorV2ItemRenderer } from '../components/EditorV2ItemRenderer';

import { ProjectV2Type, ItemType } from '../utils.js/types';
import { darkColor, lightColor } from '../utils.js/colors';

type EditorV2PropsTypes = {};

export const EditorV2 = ({ }: EditorV2PropsTypes) => {
    const { user } = useAuth();

    const defaultProject: ProjectV2Type = {
        createdAt: Date.now(),
        name: '',
        published: false,
        publishTime: null,
        customDomain: '',
        items: [],
        globalBgColor: lightColor,
        globalDefaultTextColor: darkColor,
    }
    const [projectData, setProjectData] = useState<ProjectV2Type>({ ...defaultProject })
    const [selectedItemIndexPath, setSelectedItemIndexPath] = useState<number[] | null>(null)

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
            itemsTree.splice(path[0])
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
                    />
                    <div
                        className="editorv2__page-content fullpage-wrapper"
                        onClick={onToggleBackgroundCustomisation}
                        style={{
                            backgroundColor: `#${projectData.globalBgColor}`,
                        }}
                    >
                        {projectData.items.map((projectItem, projectItemIndex) => {
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