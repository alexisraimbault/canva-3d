import { MouseEvent } from "react";

import { ThreeDItemRenderer } from "./ThreeDItemRenderer";

import { ItemType, ThreeDItemType, TextType, ContainerType } from "../utils.js/types";
import { darkColor } from "../utils.js/colors";

interface EditorV2ItemRendererProps {
    item: ItemType;
    onSelectItem: () => void;
    itemIndexPath: number[];
    relativeSelectedItemIndexPath: number[];
    isSelected: boolean;
    setSelectedItemIndexPath: (n: number[]) => void;
};

export const EditorV2ItemRenderer = ({
    item,
    onSelectItem,
    setSelectedItemIndexPath,
    relativeSelectedItemIndexPath,
    isSelected,
    itemIndexPath,
}: EditorV2ItemRendererProps) => {
    const render3dItem = (itemData: ThreeDItemType | undefined) => {
        return (
            <ThreeDItemRenderer
                item={itemData}
            />
        )
    }

    const renderTextItem = (itemData: TextType | undefined) => {
        return (
            <div
                style={{
                    fontWeight: itemData?.weight === 'bold' ? 700 : 400,
                    fontSize: itemData?.size || 26,
                    color: `#${itemData?.color || darkColor}`,
                }}
            >
                {itemData?.content || ''}
            </div>
        )
    }

    const renderContainerItem = (itemData: ContainerType | undefined) => {
        const isVertical = itemData?.orientation === 'vertical'
        const alignmentCSS = {
            alignItems: 'center',
            justifyContent: 'center',
        }

        if (isVertical) {
            if (itemData?.align === 'start') {
                alignmentCSS.alignItems = 'flex-start';
            }
            if (itemData?.align === 'end') {
                alignmentCSS.alignItems = 'flex-end';
            }
        } else {
            if (itemData?.align === 'start') {
                alignmentCSS.justifyContent = 'flex-start';
            }
            if (itemData?.align === 'end') {
                alignmentCSS.justifyContent = 'flex-end';
            }
        }

        return (
            <div
                style={{
                    display: 'flex',
                    ...(isVertical ?
                        { flexDirection: 'column' } :
                        {}
                    ),
                    ...alignmentCSS,
                    flexWrap: 'wrap',
                }}
            >
                {itemData?.children?.map((child, chindIndex) => {
                    const newItemIndexPathPath = [...itemIndexPath, chindIndex]
                    const newRelativeSelectedItemIndexPath = relativeSelectedItemIndexPath.slice(1)
                    return (
                        <EditorV2ItemRenderer
                            key={`item-${newItemIndexPathPath.join('-')}`}
                            item={child}
                            itemIndexPath={newItemIndexPathPath}
                            onSelectItem={() => setSelectedItemIndexPath(newItemIndexPathPath)}
                            setSelectedItemIndexPath={setSelectedItemIndexPath}
                            relativeSelectedItemIndexPath={newRelativeSelectedItemIndexPath}
                            isSelected={newRelativeSelectedItemIndexPath?.length === 1 && newRelativeSelectedItemIndexPath[0] === chindIndex}
                        />
                    )
                })}
            </div>
        )
    }

    const renderItem = (item: ItemType) => {
        if (item.type === '3d') {
            return render3dItem(item.threeDData)
        }
        if (item.type === 'text') {
            return renderTextItem(item.textData)
        }
        if (item.type === 'container') {
            return renderContainerItem(item.containerData)
        }
    }

    // const onElementClickWrapper = (e: MouseEvent<HTMLDivElement, MouseEvent) => {
    const onElementClickWrapper = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        onSelectItem()
    }

    return (
        <div
            className={`
                editor-v2-item__wrapper
                ${isSelected ? ' editor-v2-item__wrapper--selected' : ''}
            `}
            onClick={onElementClickWrapper}
        >
            {renderItem(item)}
        </div>
    );
}
