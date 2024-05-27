import { ReactNode } from "react";
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Nullable } from "primereact/ts-helpers";
import { SelectButton } from 'primereact/selectbutton';
import { ColorPicker, ColorPickerHSBType, ColorPickerRGBType } from 'primereact/colorpicker';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Slider } from 'primereact/slider';
// import { FileUpload } from 'primereact/fileupload';
import {
    useAuth
} from "@kobbleio/react";
import { ref, uploadBytes } from "firebase/storage";


import { ThreeDItemType, TextType, ContainerType, ProjectV2Type, ItemType, ButtonType, SeparatorType, ImageType } from "../utils.js/types";
import { orientationOptions, alignmentOptions, geometries, materials, interactions } from '../utils.js/statics'
import { accentColor, darkColor, lightColor } from "../utils.js/colors";
import { storage } from "../utils.js/firebase";

type EditorV2SidebarProps = {
    onAddItem: (i: ItemType) => void;
    onEditItem: (itemIndexPath: number[] | null, newItemValue: ItemType) => void;
    items: ItemType[];
    selectedItemIndexPath: number[] | null;
    setSelectedItemIndexPath: (i: number[] | null) => void;
    project: ProjectV2Type,
    updateProject: (newProject: ProjectV2Type) => void,
    deleteItem: (itemIndexPath: number[] | null) => void;
};

export const EditorV2Sidebar = ({
    onAddItem,
    onEditItem,
    items,
    project,
    updateProject,
    deleteItem,
    selectedItemIndexPath,
    setSelectedItemIndexPath,
}: EditorV2SidebarProps) => {
    const { user } = useAuth();

    const getSelectedItem = (itemsTree: ItemType[], path: number[]): ItemType => {
        if (path.length === 1) {
            return itemsTree[path[0]]
        }

        return getSelectedItem(itemsTree[path[0]]?.containerData?.children || [], path.slice(1))
    }

    const isBackgroundSelection = selectedItemIndexPath !== null && selectedItemIndexPath.length === 1 && selectedItemIndexPath[0] === -1
    const hasItemSelected = selectedItemIndexPath !== null && !isBackgroundSelection
    const selectedItem = hasItemSelected ? getSelectedItem(items, selectedItemIndexPath) : null

    const onDeleteItem = () => {
        deleteItem(selectedItemIndexPath)
    }

    const itemTypes = [{
        id: '3d',
        render: (
            <div>{"3D"}</div>
        ),
        defaultItem: {
            interaction: { type: 'timer' },
            material: { type: 'standard' },
            geometry: { type: 'box' },
            lights: [{ type: 'hemisphere' }],
            size: 20,
        },
        defaultItemKey: 'threeDData'
    }, {
        id: 'text',
        render: (
            <div>{"T"}</div>
        ),
        defaultItem: {
            content: 'Edit me',
            size: 26,
            weight: 'normal',
            color: project.globalDefaultTextColor,
        },
        defaultItemKey: 'textData'
    }, {
        id: 'container',
        render: (
            <div>{"[]"}</div>
        ),
        defaultItem: {
            align: 'center',
            orientation: 'horizontal',
            isEmptyDivider: false,
            height: 40,
            children: [],
        },
        defaultItemKey: 'containerData'
    }, {
        id: 'separator',
        render: (
            <div>{"]["}</div>
        ),
        defaultItem: {
            width: 2,
            height: 2,
        },
        defaultItemKey: 'separatorData'
    }, {
        id: 'button',
        render: (
            <div>{"Btn"}</div>
        ),
        defaultItem: {
            content: 'Edit me',
            textSize: 30,
            textWeight: 'bold',
            borderRadius: 0,
            backgroundColor: lightColor,
            hoverBackgroundColor: accentColor,
            textColor: darkColor,
            hoverTextColor: darkColor,
            action: 'email-popup',
        },
        defaultItemKey: 'buttonData'
    }, {
        id: 'image',
        render: (
            <div>{"Img"}</div>
        ),
        defaultItem: {
            size: 2,
            borderRadius: 0,
            path: null,
        },
        defaultItemKey: 'imageData'
    }]

    const onGeometryChange = (e: DropdownChangeEvent) => {
        if (!selectedItem) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.threeDData) {
            newSelectedItem.threeDData.geometry = { type: e.target.value }
        }
        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onMaterialChange = (e: DropdownChangeEvent) => {
        if (!selectedItem) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.threeDData) {
            newSelectedItem.threeDData.material = { type: e.target.value }
        }
        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onInteractionChange = (e: DropdownChangeEvent) => {
        if (!selectedItem) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.threeDData) {
            newSelectedItem.threeDData.interaction = { type: e.target.value }
        }
        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateSeparatorSize = (metric: string) => (newSize: Nullable<number | null> | number[]) => {
        if (!selectedItem) {
            return;
        }
        if (Array.isArray(newSize)) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.separatorData) {
            if (metric === 'width') {
                newSelectedItem.separatorData.width = newSize || 2
            }
            if (metric === 'height') {
                newSelectedItem.separatorData.height = newSize || 2
            }
        }
        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateImageSize = (newSize: Nullable<number | null> | number[]) => {
        if (!selectedItem) {
            return;
        }
        if (Array.isArray(newSize)) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.imageData) {
            newSelectedItem.imageData.size = newSize || 2
        }
        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUploadImage = async (image: File) => {
        if (!selectedItem) {
            return;
        }

        const userId = user?.id || undefined
        if (!userId) {
            return
        }

        const imageName = `${userId}_${Date.now()}`
        const storageRef = ref(storage, `uploads/${imageName}`);
        await uploadBytes(storageRef, image);

        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.imageData) {
            newSelectedItem.imageData.path = imageName
        }
        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateImageBorderRadius = (newBorderRadius: Nullable<number | null> | number[]) => {
        if (!selectedItem) {
            return;
        }
        if (Array.isArray(newBorderRadius)) {
            return;
        }

        if (newBorderRadius !== 0 && !newBorderRadius) {
            return;
        }

        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.imageData !== undefined) {
            newSelectedItem.imageData.borderRadius = newBorderRadius
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdate3dItemSize = (newSize: Nullable<number | null> | number[]) => {
        if (!selectedItem) {
            return;
        }
        if (Array.isArray(newSize)) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.threeDData) {
            newSelectedItem.threeDData.size = newSize || 20
        }
        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateTextContent = (newTextContent: string) => {
        if (!selectedItem) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.textData !== undefined) {
            newSelectedItem.textData.content = newTextContent
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateTextSize = (newTextSize: Nullable<number | null>) => {
        if (!selectedItem) {
            return;
        }

        if (!newTextSize) {
            return;
        }

        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.textData !== undefined) {
            newSelectedItem.textData.size = newTextSize
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onToggleBoldText = () => {
        if (!selectedItem) {
            return;
        }

        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.textData !== undefined) {
            newSelectedItem.textData.weight = newSelectedItem.textData.weight === "bold" ? "normal" : "bold"
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateTextColor = (color: string | null | undefined | ColorPickerRGBType | ColorPickerHSBType) => {
        if (color === null) {
            return
        }
        if (color === undefined) {
            return
        }
        if (color.toString().length > 6) {
            return
        }
        if (!selectedItem) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.textData !== undefined) {
            newSelectedItem.textData.color = color.toString()
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onToggleBtnBoldText = () => {
        if (!selectedItem) {
            return;
        }

        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.buttonData !== undefined) {
            newSelectedItem.buttonData.textWeight = newSelectedItem.buttonData.textWeight === "bold" ? "normal" : "bold"
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateBtnTextContent = (newTextContent: string) => {
        if (!selectedItem) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.buttonData !== undefined) {
            newSelectedItem.buttonData.content = newTextContent
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)

    }

    const onUpdateBtnTextSize = (newTextSize: Nullable<number | null>) => {
        if (!selectedItem) {
            return;
        }

        if (!newTextSize) {
            return;
        }

        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.buttonData !== undefined) {
            newSelectedItem.buttonData.textSize = newTextSize
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateBtnBorderRadius = (newBorderRadius: Nullable<number | null>) => {
        if (!selectedItem) {
            return;
        }

        if (newBorderRadius !== 0 && !newBorderRadius) {
            return;
        }

        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.buttonData !== undefined) {
            newSelectedItem.buttonData.borderRadius = newBorderRadius
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateBtnBgColor = (color: string | null | undefined | ColorPickerRGBType | ColorPickerHSBType) => {
        if (color === null) {
            return
        }
        if (color === undefined) {
            return
        }
        if (color.toString().length > 6) {
            return
        }
        if (!selectedItem) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.buttonData !== undefined) {
            newSelectedItem.buttonData.backgroundColor = color.toString()
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateBtnHoverBgColor = (color: string | null | undefined | ColorPickerRGBType | ColorPickerHSBType) => {
        if (color === null) {
            return
        }
        if (color === undefined) {
            return
        }
        if (color.toString().length > 6) {
            return
        }
        if (!selectedItem) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.buttonData !== undefined) {
            newSelectedItem.buttonData.hoverBackgroundColor = color.toString()
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateBtnTextColor = (color: string | null | undefined | ColorPickerRGBType | ColorPickerHSBType) => {
        if (color === null) {
            return
        }
        if (color === undefined) {
            return
        }
        if (color.toString().length > 6) {
            return
        }
        if (!selectedItem) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.buttonData !== undefined) {
            newSelectedItem.buttonData.textColor = color.toString()
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onUpdateBtnHoveredTextColor = (color: string | null | undefined | ColorPickerRGBType | ColorPickerHSBType) => {
        if (color === null) {
            return
        }
        if (color === undefined) {
            return
        }
        if (color.toString().length > 6) {
            return
        }
        if (!selectedItem) {
            return;
        }
        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.buttonData !== undefined) {
            newSelectedItem.buttonData.hoverTextColor = color.toString()
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onOrientationChange = (newOrientation: string) => {
        if (!selectedItem) {
            return;
        }

        if (!newOrientation) {
            return
        }

        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.containerData !== undefined) {
            newSelectedItem.containerData.orientation = newOrientation
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onAlignmentChange = (newAlignment: string) => {
        if (!selectedItem) {
            return;
        }

        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.containerData !== undefined) {
            newSelectedItem.containerData.align = newAlignment
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
    }

    const onAddContainerChild = (itemStatics: {
        id: string,
        render: ReactNode,
        defaultItem: ThreeDItemType | TextType | ContainerType | ButtonType | SeparatorType | ImageType,
        defaultItemKey: string
    }) => {
        if (!selectedItem) {
            return;
        }

        const newSelectedItem: ItemType = { ...selectedItem }
        if (newSelectedItem.containerData !== undefined) {
            newSelectedItem.containerData.children.push({
                type: itemStatics.id,
                [itemStatics.defaultItemKey]: itemStatics.defaultItem,
            })
        }

        onEditItem(selectedItemIndexPath, newSelectedItem)
        if (newSelectedItem.containerData !== undefined) {
            const newSelectedItemIndexPath = [...selectedItemIndexPath || [], newSelectedItem.containerData.children.length - 1]
            setSelectedItemIndexPath(newSelectedItemIndexPath)
        }
    }

    const renderContainerCustomisation = () => {
        if (selectedItem?.type !== 'container') {
            return
        }

        return (
            <div className="editorv2-sidebar__3d-form-container">
                <div className="editorv2-sidebar__form-label">{"Orientation"}</div>
                <SelectButton
                    value={selectedItem.containerData?.orientation}
                    onChange={(e) => onOrientationChange(e.value)}
                    options={orientationOptions}
                    className='editorv2-sidebar__form-input-container'
                />
                <div className="editorv2-sidebar__form-label">{"Alignment"}</div>
                <SelectButton
                    value={selectedItem.containerData?.align}
                    onChange={(e) => onAlignmentChange(e.value)}
                    options={alignmentOptions}
                    className='editorv2-sidebar__form-input-container'
                />
                <div className="editorv2-sidebar__form-label">{"Add Children"}</div>
                <div
                    className='editorv2-sidebar__form-input-row'
                >

                    {itemTypes.map(itemType => (
                        <div
                            className="editorv2-sidebar__container-edition-add-item-btn"
                            key={`c-it-${itemType.id}`}
                            onClick={() => onAddContainerChild(itemType)}
                        >
                            {itemType.render}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderTextItemCustomisation = () => {
        if (selectedItem?.type !== 'text') {
            return
        }

        return (
            <div className="editorv2-sidebar__3d-form-container">
                <div className="editorv2-sidebar__form-label">{"Content"}</div>
                <InputText
                    value={selectedItem?.textData?.content || ''}
                    onChange={(e) => onUpdateTextContent(e.target.value)}
                    placeholder="Content"
                    className='editorv2-sidebar__form-input-container'
                />
                <div className="editorv2-sidebar__form-label">{"Size"}</div>
                <InputNumber
                    value={selectedItem?.textData?.size || 26}
                    onValueChange={(e) => onUpdateTextSize(e.value)}
                    className='editorv2-sidebar__form-input-container'
                />
                <div className="editorv2-sidebar__form-label">{"Decoration"}</div>
                <div
                    className={`
                    editorv2-sidebar__bold-input-container
                    ${selectedItem?.textData?.weight === 'bold' ? ' editorv2-sidebar__bold-input-container--selected' : ''}
                    `}
                    onClick={onToggleBoldText}
                >
                    {"B"}
                </div>
                <ColorPicker
                    format="hex"
                    value={selectedItem?.textData?.color}
                    onChange={(e) => onUpdateTextColor(e.value)}
                    className='editorv2-sidebar__form-input-container'
                />
                <IconField
                    iconPosition="left"
                    className='editorv2-sidebar__form-input-container'
                >
                    <InputIcon className="pi pi-hashtag"> </InputIcon>
                    <InputText
                        value={selectedItem?.textData?.color}
                        onChange={(e) => onUpdateTextColor(e.target.value)}
                        placeholder="FFFFFF"
                    />
                </IconField>
            </div>
        )
    }

    const renderButtonCustomisation = () => {
        if (selectedItem?.type !== 'button') {
            return
        }

        return (
            <div className="editorv2-sidebar__3d-form-container">
                <div className="editorv2-sidebar__form-label">{"Background color"}</div>
                <ColorPicker
                    format="hex"
                    value={selectedItem?.buttonData?.backgroundColor}
                    onChange={(e) => onUpdateBtnBgColor(e.value)}
                    className='editorv2-sidebar__form-input-container'
                />
                <IconField
                    iconPosition="left"
                    className='editorv2-sidebar__form-input-container'
                >
                    <InputIcon className="pi pi-hashtag"> </InputIcon>
                    <InputText
                        value={selectedItem?.buttonData?.backgroundColor}
                        onChange={(e) => onUpdateBtnBgColor(e.target.value)}
                        placeholder="FFFFFF"
                    />
                </IconField>
                <div className="editorv2-sidebar__form-label">{"Hovered"}</div>
                <ColorPicker
                    format="hex"
                    value={selectedItem?.buttonData?.hoverBackgroundColor}
                    onChange={(e) => onUpdateBtnHoverBgColor(e.value)}
                    className='editorv2-sidebar__form-input-container'
                />
                <IconField
                    iconPosition="left"
                    className='editorv2-sidebar__form-input-container'
                >
                    <InputIcon className="pi pi-hashtag"> </InputIcon>
                    <InputText
                        value={selectedItem?.buttonData?.hoverBackgroundColor}
                        onChange={(e) => onUpdateBtnHoverBgColor(e.target.value)}
                        placeholder="FFFFFF"
                    />
                </IconField>
                <div className="editorv2-sidebar__form-label">{"Label"}</div>
                <InputText
                    value={selectedItem?.buttonData?.content || ''}
                    onChange={(e) => onUpdateBtnTextContent(e.target.value)}
                    placeholder="Content"
                    className='editorv2-sidebar__form-input-container'
                />
                <div className="editorv2-sidebar__form-label">{"Text size"}</div>
                <InputNumber
                    value={selectedItem?.buttonData?.textSize || 26}
                    onValueChange={(e) => onUpdateBtnTextSize(e.value)}
                    className='editorv2-sidebar__form-input-container'
                />
                <div className="editorv2-sidebar__form-label">{"Text decoration"}</div>
                <div
                    className={`
                        editorv2-sidebar__bold-input-container
                        ${selectedItem?.buttonData?.textWeight === 'bold' ? ' editorv2-sidebar__bold-input-container--selected' : ''}
                    `}
                    onClick={onToggleBtnBoldText}
                >
                    {"B"}
                </div>
                <div className="editorv2-sidebar__form-label">{"Text color"}</div>
                <ColorPicker
                    format="hex"
                    value={selectedItem?.buttonData?.textColor}
                    onChange={(e) => onUpdateBtnTextColor(e.value)}
                    className='editorv2-sidebar__form-input-container'
                />
                <IconField
                    iconPosition="left"
                    className='editorv2-sidebar__form-input-container'
                >
                    <InputIcon className="pi pi-hashtag"> </InputIcon>
                    <InputText
                        value={selectedItem?.buttonData?.textColor}
                        onChange={(e) => onUpdateBtnTextColor(e.target.value)}
                        placeholder="FFFFFF"
                    />
                </IconField>
                <div className="editorv2-sidebar__form-label">{"Hovered"}</div>
                <ColorPicker
                    format="hex"
                    value={selectedItem?.buttonData?.hoverTextColor}
                    onChange={(e) => onUpdateBtnHoveredTextColor(e.value)}
                    className='editorv2-sidebar__form-input-container'
                />
                <IconField
                    iconPosition="left"
                    className='editorv2-sidebar__form-input-container'
                >
                    <InputIcon className="pi pi-hashtag"> </InputIcon>
                    <InputText
                        value={selectedItem?.buttonData?.hoverTextColor}
                        onChange={(e) => onUpdateBtnHoveredTextColor(e.target.value)}
                        placeholder="FFFFFF"
                    />
                </IconField>
                <div className="editorv2-sidebar__form-label">{"Radius"}</div>
                <InputNumber
                    value={selectedItem?.buttonData?.borderRadius || 0}
                    onValueChange={(e) => onUpdateBtnBorderRadius(e.value)}
                    className='editorv2-sidebar__form-input-container'
                />
                <div className="editorv2-sidebar__form-label">{"Action"}</div>
                <div className="editorv2-sidebar__form-big-label">{"Email gathering popup"}</div>
                <div className="editorv2-sidebar__form-big-label">{"(More options to come)"}</div>
            </div>
        )
    }

    const renderImageCustomisation = () => {
        if (selectedItem?.type !== 'image') {
            return
        }

        return (
            <div className="editorv2-sidebar__3d-form-container">
                {selectedItem.imageData?.path === null && (
                    <input
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={(e) => {
                            if (e.target.files !== null) {
                                onUploadImage(e.target.files[0])
                            }
                        }}
                    />
                )}
                <div className="editorv2-sidebar__form-label">{"Size"}</div>
                <InputNumber
                    value={selectedItem.imageData?.size}
                    onValueChange={(e) => onUpdateImageSize(e.value)}
                // className='editorv2-sidebar__form-input-container'
                />
                <Slider
                    value={selectedItem.imageData?.size}
                    onChange={(e) => onUpdateImageSize(e.value)}
                    min={1}
                    max={100}
                    className='editorv2-sidebar__form-input-slider'
                />
                <div className="editorv2-sidebar__form-label">{"Radius"}</div>
                <InputNumber
                    value={selectedItem.imageData?.borderRadius}
                    onValueChange={(e) => onUpdateImageBorderRadius(e.value)}
                // className='editorv2-sidebar__form-input-container'
                />
                <Slider
                    value={selectedItem.imageData?.borderRadius}
                    onChange={(e) => onUpdateImageBorderRadius(e.value)}
                    min={1}
                    max={100}
                    className='editorv2-sidebar__form-input-slider'
                />
            </div>
        )
    }

    const renderSeparatorCustomisation = () => {
        if (selectedItem?.type !== 'separator') {
            return
        }

        return (
            <div className="editorv2-sidebar__3d-form-container">
                <div className="editorv2-sidebar__form-label">{"Height"}</div>
                <InputNumber
                    value={selectedItem.separatorData?.height}
                    onValueChange={(e) => onUpdateSeparatorSize('height')(e.value)}
                // className='editorv2-sidebar__form-input-container'
                />
                <Slider
                    value={selectedItem.separatorData?.height}
                    onChange={(e) => onUpdateSeparatorSize('height')(e.value)}
                    min={1}
                    max={100}
                    className='editorv2-sidebar__form-input-slider'
                />
                <div className="editorv2-sidebar__form-label">{"Width"}</div>
                <InputNumber
                    value={selectedItem.separatorData?.width}
                    onValueChange={(e) => onUpdateSeparatorSize('width')(e.value)}
                // className='editorv2-sidebar__form-input-container'
                />
                <Slider
                    value={selectedItem.separatorData?.width}
                    onChange={(e) => onUpdateSeparatorSize('width')(e.value)}
                    min={1}
                    max={100}
                    className='editorv2-sidebar__form-input-slider'
                />
            </div>
        )
    }

    const render3dItemCustomisation = () => {
        if (selectedItem?.type !== '3d') {
            return
        }

        // TODO edit more things (size, colors, add shapes, add more complex metarials, shininess, diffusion, ect)

        return (
            <div className="editorv2-sidebar__3d-form-container">
                <div className="editorv2-sidebar__form-label">{"3D Shape"}</div>
                <Dropdown
                    value={selectedItem.threeDData?.geometry.type}
                    onChange={onGeometryChange}
                    options={geometries}
                    placeholder="Select a Geometry"
                    className='editorv2-sidebar__form-input-container'
                />
                <div className="editorv2-sidebar__form-label">{"Texture"}</div>
                <Dropdown
                    value={selectedItem.threeDData?.material.type}
                    onChange={onMaterialChange}
                    options={materials}
                    placeholder="Select a Material"
                    className='editorv2-sidebar__form-input-container'
                />
                <div className="editorv2-sidebar__form-label">{"Interaction"}</div>
                <Dropdown
                    value={selectedItem.threeDData?.interaction.type}
                    onChange={onInteractionChange}
                    options={interactions}
                    placeholder="Select an interaction"
                    className='editorv2-sidebar__form-input-container'
                />
                <div className="editorv2-sidebar__form-label">{"Size"}</div>
                <InputNumber
                    value={selectedItem.threeDData?.size}
                    onValueChange={(e) => onUpdate3dItemSize(e.value)}
                // className='editorv2-sidebar__form-input-container'
                />
                <Slider
                    value={selectedItem.threeDData?.size}
                    onChange={(e) => onUpdate3dItemSize(e.value)}
                    min={5}
                    max={100}
                    className='editorv2-sidebar__form-input-slider'
                />
            </div>
        )
    }

    const updateGlobalBgColor = (color: string | null | undefined | ColorPickerRGBType | ColorPickerHSBType) => {
        if (color === null) {
            return
        }
        if (color === undefined) {
            return
        }
        if (color.toString().length > 6) {
            return
        }
        const newProject = { ...project }
        newProject.globalBgColor = color.toString()
        updateProject(newProject)
    }

    const updateGlobalDefaultTextColor = (color: string | null | undefined | ColorPickerRGBType | ColorPickerHSBType) => {
        if (color === null) {
            return
        }
        if (color === undefined) {
            return
        }
        if (color.toString().length > 6) {
            return
        }
        const newProject = { ...project }
        newProject.globalDefaultTextColor = color.toString()
        updateProject(newProject)
    }

    const renderBackgroundCustomisation = () => {

        return (
            <div className="editorv2-sidebar__3d-form-container">
                <div className="editorv2-sidebar__form-label">{"Background color"}</div>
                <ColorPicker
                    format="hex"
                    value={project.globalBgColor}
                    onChange={(e) => updateGlobalBgColor(e.value)}
                    className='editorv2-sidebar__form-input-container'
                />
                <IconField
                    iconPosition="left"
                    className='editorv2-sidebar__form-input-container'
                >
                    <InputIcon className="pi pi-hashtag"> </InputIcon>
                    <InputText
                        value={project.globalBgColor}
                        onChange={(e) => updateGlobalBgColor(e.target.value)}
                        placeholder="FFFFFF"
                    />
                </IconField>
                <div className="editorv2-sidebar__form-label">{"Default text color"}</div>
                <ColorPicker
                    format="hex"
                    value={project.globalDefaultTextColor}
                    onChange={(e) => updateGlobalDefaultTextColor(e.value)}
                    className='editorv2-sidebar__form-input-container'
                />
                <IconField
                    iconPosition="left"
                    className='editorv2-sidebar__form-input-container'
                >
                    <InputIcon className="pi pi-hashtag"> </InputIcon>
                    <InputText
                        value={project.globalDefaultTextColor}
                        onChange={(e) => updateGlobalDefaultTextColor(e.target.value)}
                        placeholder="FFFFFF"
                    />
                </IconField>
            </div>
        )
    }

    return (
        <div className="editorv2-sidebar__wrapper">
            <div className="editorv2-sidebar__inner-btns-container">
                {itemTypes.map(itemType => (
                    <div
                        className="editorv2-sidebar__add-item-btn"
                        key={`it-${itemType.id}`}
                        onClick={() => onAddItem({
                            type: itemType.id,
                            [itemType.defaultItemKey]: itemType.defaultItem,
                        })}
                    >
                        {itemType.render}
                    </div>
                ))}
            </div>
            {hasItemSelected && (
                <div className="editorv2-sidebar__customisation-section">
                    <div className="editorv2-sidebar__customisation-inner">
                        {selectedItem && selectedItem.type === '3d' && render3dItemCustomisation()}
                        {selectedItem && selectedItem.type === 'text' && renderTextItemCustomisation()}
                        {selectedItem && selectedItem.type === 'container' && renderContainerCustomisation()}
                        {selectedItem && selectedItem.type === 'button' && renderButtonCustomisation()}
                        {selectedItem && selectedItem.type === 'separator' && renderSeparatorCustomisation()}
                        {selectedItem && selectedItem.type === 'image' && renderImageCustomisation()}
                    </div>
                    {/* <Button
                        label="Close"
                        onClick={() => setSelectedItemIndexPath(null)}
                        className="editorv2-sidebar__customisatino-close-btn"
                    /> */}
                    <Button
                        label="Delete"
                        onClick={() => onDeleteItem()}
                        className="editorv2-sidebar__customisatino-delete-btn"
                    />
                </div>
            )}
            {isBackgroundSelection && (
                <div className="editorv2-sidebar__customisation-section">
                    <div className="editorv2-sidebar__customisation-inner">
                        {renderBackgroundCustomisation()}
                    </div>
                    <Button
                        label="Close"
                        onClick={() => setSelectedItemIndexPath(null)}
                        className="editorv2-sidebar__customisatino-close-btn"
                    />
                </div>
            )}
            {/* <FileUpload
                mode="basic"
                name="Test"
                url="/api/upload"
                accept="image/*"
                maxFileSize={1000000}
                onUpload={onUpload}
            /> */}
        </div >
    );
}
