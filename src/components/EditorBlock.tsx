import { ThreeWrapper } from "./ThreeWrapper";
import { ILight, IGeometry, IInteraction, IMaterial, ITexts } from "../utils.js/types";

type EditorBlockPropsTypes = {
    lights: ILight[];
    geometry: IGeometry;
    material: IInteraction;
    interaction: IMaterial;
    texts: ITexts;
    mode?: string;
};

export const EditorBlock = ({
    lights,
    geometry,
    material,
    interaction,
    texts,
    mode,
}: EditorBlockPropsTypes) => {
    const isSmallMode = mode === "small"

    return (
        <div
            className={`editor-block__wrapper${isSmallMode ? ' editor-block__wrapper--small' : ''}`}
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
                <div className={`editor-block__texts-wrapper${isSmallMode ? ' editor-block__texts-wrapper--small' : ''}`}>
                    {texts?.title?.length > 0 && <div className={`editor-block__title${isSmallMode ? ' editor-block__title--small' : ''}`}>{texts.title}</div>}
                    {texts?.subtitle?.length > 0 && <div className={`editor-block__subtitle${isSmallMode ? ' editor-block__subtitle--small' : ''}`}>{texts.subtitle}</div>}
                </div>
            )}
        </div>
    );
}
