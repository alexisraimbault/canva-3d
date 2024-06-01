import { blue, darkColor, green, lightColor, white } from "./colors"
import { ProjectV2Type } from "./types"

export const orientationOptions = [
    {
        label: 'Horizontal',
        value: 'horizontal'
    },
    {
        label: 'Vertical',
        value: 'vertical'
    },
]

export const alignmentOptions = [
    {
        label: 'Start',
        value: 'start'
    },
    {
        label: 'Center',
        value: 'center'
    },
    {
        label: 'End',
        value: 'end'
    },
    {
        label: 'Spaced',
        value: 'spaced'
    },
]

export const geometries = [
    {
        label: 'Box',
        value: 'box'
    },
    {
        label: 'Capsule',
        value: 'capsule'
    },
    {
        label: 'Dodecahedron',
        value: 'dodecahedron'
    },
    {
        label: 'Icosahedron',
        value: 'icosahedron'
    },
    {
        label: 'Octahedron',
        value: 'octahedron'
    },
    {
        label: 'Sphere',
        value: 'sphere'
    },
    {
        label: 'Torus',
        value: 'torus'
    },
    {
        label: 'TorusKnot',
        value: 'torusKnot'
    },
    {
        label: 'Tube',
        value: 'tube'
    },
    {
        label: 'Edges',
        value: 'edges'
    },
    {
        label: 'Wireframe',
        value: 'wireframe'
    },
]

export const materials = [
    {
        label: 'Standard',
        value: 'standard',
    },
    // {
    //     label: 'Basic',
    //     value: 'basic',
    // },
    {
        label: 'Depth',
        value: 'depth',
    },
    {
        label: 'Lambert',
        value: 'lambert',
    },
    {
        label: 'Matcap',
        value: 'matcap',
    },
    {
        label: 'Normal',
        value: 'normal',
    },
    {
        label: 'Phong',
        value: 'phong',
    },
    {
        label: 'Physical',
        value: 'physical',
    },
    {
        label: 'Toon',
        value: 'toon',
    },
]

export const interactions = [
    // TODO handle mouse interaction better
    // {
    //     label: 'Mouse',
    //     value: 'mouse',
    // },
    {
        label: 'Timer',
        value: 'timer',
    },
    {
        label: 'Scroll',
        value: 'scroll',
    },
]

export const buttonsTypes = [
    {
        label: 'Gradient',
        value: 'gradient',
    },
    {
        label: 'Classic',
        value: 'classic',
    },
]

export const globalSpecialBachgrounds = [
    {
        label: 'Bubbles',
        value: 'bubbles',
    },
    {
        label: 'Network',
        value: 'network',
    },
    {
        label: 'None',
        value: 'none',
    },
]

export const defaultProject: ProjectV2Type = {
    createdAt: Date.now(),
    name: '',
    published: false,
    publishTime: null,
    customDomain: '',
    items: [],
    globalBgColor: lightColor,
    globalDefaultTextColor: darkColor,
    globalBgSpecialSettings: {
        type: 'none',
        opacity: 1,
        colors: [],
    },
}

export const defaultPopupButton = {
    type: 'gradient',
    content: 'Register',
    textSize: 2,
    textWeight: 'bold',
    borderRadius: 0,
    backgroundColor: green,
    hoverBackgroundColor: blue,
    textColor: white,
    hoverTextColor: white,
    action: 'email-popup',
}