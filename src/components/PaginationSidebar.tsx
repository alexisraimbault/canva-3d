import { FC } from "react";
import { Button } from 'primereact/button';

import { EditorBlock } from "./EditorBlock";

import { ILight, IGeometry, IInteraction, IMaterial, ITexts } from "../utils.js/types";


type IPaginationSidebarProps = {
    lights: ILight[][];
    geometries: IGeometry[];
    materials: IMaterial[];
    interactions: IInteraction[];
    texts: ITexts[];
    editingBlock: number;
    setEditingBlock: (n: number) => void;
    onAddBlock: (n: number | undefined) => void;
};

export const PaginationSidebar: FC<IPaginationSidebarProps> = ({
    lights,
    geometries,
    materials,
    interactions,
    texts,
    editingBlock,
    setEditingBlock,
    onAddBlock,
}) => {
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
        </div>
    );
}
