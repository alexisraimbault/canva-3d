import { MathUtils } from 'three'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
// import { Instances, Instance, Environment } from '@react-three/drei'
import { Instances, Instance } from '@react-three/drei'
import { EffectComposer, N8AO, TiltShift2 } from '@react-three/postprocessing'

import { SpecialBgSettingsType } from '../utils.js/types'

interface BubblesBackgroundPropsTypes {
    settings: SpecialBgSettingsType
    globalBgColor: string,
};

export const BubblesBackground = ({
    settings,
    globalBgColor,
}: BubblesBackgroundPropsTypes) => {

    return (
        <div
            className='complex-background__wrapper'
        >
            <Canvas
                className='complex-background__canva'
                style={{
                    opacity: settings?.opacity || 0.5,
                }}
                shadows
                dpr={[1, 2]}
                gl={{ antialias: false }}
                camera={{ fov: 50, position: [0, 0, 21] }}
            >
                <color
                    attach="background"
                    args={['#f0f0f0']}
                />
                <fog
                    attach="fog"
                    args={['red', 20, -5]}
                />
                <ambientLight
                    intensity={1.5}
                />
                <pointLight
                    position={[10, 10, 10]}
                    intensity={1}
                    castShadow
                />
                <Bubbles />
                <EffectComposer
                // disableNormalPass
                >
                    <N8AO
                        aoRadius={6}
                        intensity={2}
                        color="red"
                    />
                    <TiltShift2
                        blur={0.1}
                    />
                </EffectComposer>
                <color attach="background" args={[`#${globalBgColor}`]} />
                {/* <Environment preset="city" /> */}
            </Canvas>
        </div>
    );
}

const Bubbles = () => {
    const particles = Array.from({ length: 150 }, () => ({
        factor: MathUtils.randInt(20, 100),
        // speed: MathUtils.randFloat(0.01, 0.75),
        speed: MathUtils.randFloat(0.01, 0.2),
        xFactor: MathUtils.randFloatSpread(40),
        yFactor: MathUtils.randFloatSpread(10),
        zFactor: MathUtils.randFloatSpread(10)
    }))

    const ref = useRef<any>(null)

    useFrame((state, delta) => {
        if (ref.current === undefined || ref.current === null) {
            return
        }
        return void (ref.current.rotation.y = MathUtils.damp(ref.current.rotation.y, (-state.mouse.x * Math.PI) / 6, 2.75, delta))
    })
    return (
        <Instances
            limit={particles.length}
            ref={ref}
            castShadow
            receiveShadow
            position={[0, 2.5, 0]}
        >
            <sphereGeometry args={[0.45, 64, 64]} />
            <meshStandardMaterial
                roughness={1}
                color="blue"
            />
            {particles.map((data, i) => (
                <Bubble
                    key={i}
                    {...data}
                />
            ))}
        </Instances>
    )
}

const Bubble = ({ factor, speed, xFactor, yFactor, zFactor }: {
    factor: number,
    speed: number,
    xFactor: number,
    yFactor: number,
    zFactor: number,
}) => {
    const ref = useRef<any>(null)
    useFrame((state) => {
        if (ref.current === undefined || ref.current === null) {
            return
        }
        const t = factor + state.clock.elapsedTime * (speed / 2)
        ref.current.scale.setScalar(Math.max(1.5, Math.cos(t) * 5))
        ref.current.position.set(
            Math.cos(t) + Math.sin(t * 1) / 10 + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
            Math.sin(t) + Math.cos(t * 2) / 10 + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
            Math.sin(t) + Math.cos(t * 2) / 10 + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 4
        )
    })
    return <Instance ref={ref} />
}