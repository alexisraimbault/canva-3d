import { Button } from 'primereact/button';

import { ThreeWrapper } from "./ThreeWrapper";

import { ILight, IGeometry, IInteraction, IMaterial, ITexts } from "../utils.js/types";

type EditorBlockPropsTypes = {
    lights: ILight[];
    geometry: IGeometry;
    material: IInteraction;
    interaction: IMaterial;
    texts: ITexts;
    mode?: string;
    openEmailPopup?: () => void;
};

export const EditorBlock = ({
    lights,
    geometry,
    material,
    interaction,
    texts,
    mode,
    openEmailPopup,
}: EditorBlockPropsTypes) => {
    const isSmallMode = mode === "small"
    const isFullMode = mode === "full"

    return (
        <div
            className={`editor-block__wrapper
                ${isSmallMode ? ' editor-block__wrapper--small' : ''}
                ${isFullMode ? ' editor-block__wrapper--full' : ''}
            `}
        >
            <div className="editor-block__scene-wrapper">
                <ThreeWrapper
                    mode={mode}
                    geometry={geometry}
                    material={material}
                    interaction={interaction}
                    lights={lights}
                />
            </div>
            {(texts?.title?.length > 0 || texts?.subtitle?.length > 0) && (
                <div
                    className={`editor-block__texts-wrapper
                        ${isSmallMode ? ' editor-block__texts-wrapper--small' : ''}
                        ${isFullMode ? ' editor-block__texts-wrapper--full' : ''}
                    `}
                >
                    {texts?.title?.length > 0 && (
                        <div
                            className={`editor-block__title
                                ${isSmallMode ? ' editor-block__title--small' : ''}
                                ${isFullMode ? ' editor-block__title--full' : ''}
                            `}>
                            {texts.title}
                        </div>
                    )}
                    {texts?.subtitle?.length > 0 && (
                        <div
                            className={`editor-block__subtitle
                                ${isSmallMode ? ' editor-block__subtitle--small' : ''}
                                ${isFullMode ? ' editor-block__subtitle--full' : ''}
                            `}>
                            {texts.subtitle}
                        </div>
                    )}
                </div>
            )}
            {!isSmallMode && texts?.CTALabel?.length > 0 && (
                <div
                    className={`editor-block__cta-container
                        ${isSmallMode ? ' editor-block__cta-container--small' : ''}
                        ${isFullMode ? ' editor-block__cta-container--full' : ''}
                    `}>
                    <Button
                        label={texts.CTALabel}
                        onClick={openEmailPopup}
                    />
                </div>
            )}
        </div>
    );
}
