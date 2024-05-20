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
    CTALabel: string;
};

export type IPublishStatus = {
    name: string;
    published: boolean;
    publishTime: number | null;
};

export type IProject = {
    geometries: IGeometry[];
    interactions: IInteraction[];
    lights: ILight[][];
    materials: IMaterial[];
    texts: ITexts[];
    customDomain: string;
    publishData: IPublishStatus;
}