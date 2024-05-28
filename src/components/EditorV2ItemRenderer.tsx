import { MouseEvent, useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";

import { ThreeDItemRenderer } from "./ThreeDItemRenderer";

import { ItemType, ThreeDItemType, TextType, ContainerType, ButtonType, SeparatorType, ImageType } from "../utils.js/types";
import { accentColor, darkColor, lightColor } from "../utils.js/colors";
import { storage } from "../utils.js/firebase";

interface EditorV2ItemRendererProps {
    item: ItemType;
    onSelectItem?: () => void;
    toggleEmailPopup?: () => void;
    itemIndexPath?: number[];
    relativeSelectedItemIndexPath?: number[];
    isSelected?: boolean;
    setSelectedItemIndexPath?: (n: number[]) => void;
    isLive?: boolean;
};

export const EditorV2ItemRenderer = ({
    item,
    onSelectItem = () => { },
    toggleEmailPopup = () => { },
    setSelectedItemIndexPath = () => { },
    relativeSelectedItemIndexPath = [],
    isSelected = false,
    itemIndexPath = [],
    isLive = false,
}: EditorV2ItemRendererProps) => {
    const [isItemHovered, setIsItemHovered] = useState(false)

    const toggleDetectOver = (isOvered: boolean) => {
        setIsItemHovered(isOvered)
    }

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        if (item.type === 'image' && item.imageData?.path !== null) {
            fetchImage()
        }
    }, [item])

    const fetchImage = async () => {

        const imageName = item.imageData?.path
        const imagePath = `uploads/${imageName}`
        const imageUrlRes = await getDownloadURL(ref(storage, imagePath));
        setImageUrl(imageUrlRes)
    }

    const render3dItem = (itemData: ThreeDItemType | undefined) => {
        return (
            <ThreeDItemRenderer
                item={itemData}
            />
        )
    }

    const renderSeparatorItem = (itemData: SeparatorType | undefined) => {
        return (
            <div
                style={{
                    width: `${itemData?.width || 20}vw`,
                    height: `${itemData?.height || 20}vw`,
                }}
            >
            </div>
        )
    }

    const renderImageItem = (itemData: ImageType | undefined) => {
        console.log({ imageUrl })

        return itemData?.path === null ? (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: `${itemData?.size || 2}vw`,
                    height: `${itemData?.size || 2}vw`,
                    textAlign: 'center'
                }}
            >
                {'I'}
            </div>
        ) : imageUrl !== null ? (
            <img
                style={{
                    borderRadius: `${itemData?.borderRadius}%`
                }}
                src={imageUrl}
                width={`${itemData?.size ? itemData?.size * 10 : 20}vw`}
            />
        ) : (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: `${itemData?.size || 2}vw`,
                    height: `${itemData?.size || 2}vw`,
                    textAlign: 'center'
                }}
            >
                {'...'}
            </div>
        )
    }

    const renderTextItem = (itemData: TextType | undefined) => {
        return (
            <div
                style={{
                    fontWeight: itemData?.weight === 'bold' ? 700 : 400,
                    fontSize: `${itemData?.size || 2}em`,
                    color: `#${itemData?.color || darkColor}`,
                    maxWidth: `calc(100vw - 20px)`,
                }}
            >
                {itemData?.content || ''}
            </div>
        )
    }

    const renderButtonItem = (itemData: ButtonType | undefined) => {
        return (
            <button
                className="editor-v2-item__custom-button-container"
                style={{
                    fontWeight: itemData?.textWeight === 'bold' ? 700 : 400,
                    fontSize: `${itemData?.textSize || 2}em`,
                    color: `#${!isItemHovered ?
                        (itemData?.textColor || darkColor) :
                        (itemData?.hoverTextColor || darkColor)
                        }`,
                    backgroundColor: `#${!isItemHovered ?
                        (itemData?.backgroundColor || lightColor) :
                        (itemData?.hoverBackgroundColor || accentColor)
                        }`,
                    borderRadius: `${itemData?.borderRadius || 0}px`,
                }}
                onMouseEnter={() => toggleDetectOver(true)}
                onMouseLeave={() => toggleDetectOver(false)}
                onClick={toggleEmailPopup}
            >
                {itemData?.content || ''}
            </button>
        )
    }

    const renderContainerItem = (itemData: ContainerType | undefined) => {
        const isVertical = itemData?.orientation === 'vertical'
        const alignmentCSS: {
            alignItems: string,
            justifyContent: string,
            textAlign: CanvasTextAlign | undefined,
        } = {
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        }

        if (isVertical) {
            if (itemData?.align === 'start') {
                alignmentCSS.alignItems = 'flex-start';
                alignmentCSS.textAlign = 'start';
            }
            if (itemData?.align === 'end') {
                alignmentCSS.alignItems = 'flex-end';
                alignmentCSS.textAlign = 'end';
            }
        } else {
            if (itemData?.align === 'start') {
                alignmentCSS.justifyContent = 'flex-start';
            }
            if (itemData?.align === 'end') {
                alignmentCSS.justifyContent = 'flex-end';
            }
            if (itemData?.align === 'spaced') {
                alignmentCSS.justifyContent = 'space-between';
            }
        }

        return (
            <div
                style={{
                    display: 'flex',
                    ...(isVertical ?
                        { flexDirection: 'column' } :
                        { width: '100%' }
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
                            isLive={isLive}
                            toggleEmailPopup={toggleEmailPopup}
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
        if (item.type === 'button') {
            return renderButtonItem(item.buttonData)
        }
        if (item.type === 'separator') {
            return renderSeparatorItem(item.separatorData)
        }
        if (item.type === 'image') {
            return renderImageItem(item.imageData)
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
                ${isLive ? ' editor-v2-item__wrapper--live' : ''}
            `}
            style={{
                padding: `${item?.spacing?.top || 0}px ${item?.spacing?.right || 0}px ${item?.spacing?.bottom || 0}px ${item?.spacing?.left || 0}px`,
                ...(item.type === 'container' && item?.containerData?.orientation === 'horizontal' ?
                    { width: '100%' } : {}
                ),
            }}
            onClick={onElementClickWrapper}
        >
            {renderItem(item)}
        </div>
    );
}
