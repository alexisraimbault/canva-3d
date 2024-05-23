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

export type ThreeDItemType = {
    interaction: IInteraction,
    material: IMaterial,
    geometry: IGeometry,
    lights: ILight[],
    size: number,
}

export type TextType = {
    content: string,
    size: number,
    weight: string,
    color: string,
    // TODO add color / font / decoration ...
}

export type ContainerType = {
    align: string,
    orientation: string,
    isEmptyDivider: boolean,
    height?: number,
    // items: ItemType<ThreeDItemType | TextType | ContainerType>[],
    children: ItemType[],
}

// export type ItemType<T> = {
export type ItemType = {
    type: string,
    threeDData?: ThreeDItemType,
    textData?: TextType,
    containerData?: ContainerType,
    // data: T extends ThreeDItemType ? ThreeDItemType :
    // T extends TextType ? TextType : ContainerType;
}

export type ProjectV2Type = {
    createdAt: number,
    name: string,
    published: boolean,
    publishTime: number | null,
    customDomain: string,
    // items: ItemType<ThreeDItemType | TextType | ContainerType>[],
    items: ItemType[],
    globalBgColor: string,
    globalDefaultTextColor: string,
}
