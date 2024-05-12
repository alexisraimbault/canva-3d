export type ILight = {
    type: string;
};

export type IGeometry = {
    type: string;
};

export type IMaterial = {
    type: string;
};

export type IInteraction = {
    type: string;
};

export type ITexts = {
    title: string;
    subtitle: string;
};

export type IProject = {
    geometries: IGeometry[];
    interactions: IInteraction[];
    lights: ILight[][];
    materials: IMaterial[];
    texts: ITexts[];
    customDomain: string;
}