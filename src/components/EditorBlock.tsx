import { ThreeWrapper } from "./ThreeWrapper";
import { ILight, IGeometry, IInteraction, IMaterial, ITexts } from "../utils.js/types";

type EditorBlockPropsTypes = {
    lights: ILight[];
    geometry: IGeometry;
    material: IInteraction;
    interaction: IMaterial;
    texts: ITexts;
    onUpdateGeometries: (g: string) => void;
    onUpdateMaterials: (m: string) => void;
    onUpdateInteraction: (i: string) => void;
};

export const EditorBlock = ({
    lights,
    geometry,
    material,
    interaction,
    texts,
}: EditorBlockPropsTypes) => {
    // const [lights, setLights] = useState([{type: 'ambient'}, {type: 'directional'}])
    // const [geometry, setGeometry] = useState({type: 'box'})
    // const [material, setMaterial] = useState({type: 'standard'})
    // const [interaction, setInteraction] = useState({type: 'mouse'})

    return (
        <div
            className="editor-block__wrapper"
        >
            {/* <div
                className="editor-block__selection-items"
            >
                {geometries.map((g, index) => {

                    return (
                        <div
                            key={`geo-${index}`}
                            onClick={() => onUpdateGeometries(g)}
                            className="editor-block__selection-item"
                        >
                            {g}
                        </div>
                    )
                })}
                {materials.map((m, index) => {

                    return (
                        <div
                            key={`mat-${index}`}
                            onClick={() => onUpdateMaterials(m)}
                            className="editor-block__selection-item"
                        >
                            {m}
                        </div>
                    )
                })}
                {interactions.map((i, index) => {

                    return (
                        <div
                            key={`int-${index}`}
                            onClick={() => onUpdateInteraction(i)}
                            className="editor-block__selection-item"
                        >
                            {i}
                        </div>
                    )
                })}
            </div> */}
            <div className="editor-block__scene-wrapper">
                <ThreeWrapper
                    geometry={geometry}
                    material={material}
                    interaction={interaction}
                    lights={lights}
                />
            </div>
            {(texts?.title?.length > 0 || texts?.subtitle?.length > 0) && (
                <div className="editor-block__texts-wrapper">
                    {texts?.title?.length > 0 && <div className="editor-block__title">{texts.title}</div>}
                    {texts?.subtitle?.length > 0 && <div className="editor-block__subtitle">{texts.subtitle}</div>}
                </div>
            )}
        </div>
    );
}
