import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
    Color,
} from "three";

interface BlobPerlinPropsTypes {
    interaction: string,
};

export const BlobPerlin = ({
    interaction,
}: BlobPerlinPropsTypes) => {

    return (
        <Canvas camera={{ position: [0.0, 0.0, -13.0] }}>
            <Blob
                interaction={interaction}
            />
            <directionalLight
                // position={[5, 3, 1]}
                color='#ffffff'
                // intensity={0.25}
                intensity={1}
            />
            <hemisphereLight
                color={'#FC1EFF'}
                args={['#ffff00', '#0000ff']}
                // position={[5, 5, 5]}
                // groundColor={}
                // intensity={0.375}
                intensity={1}
            />
            <ambientLight
                color='#ffffff'
                intensity={0.5}
            // intensity={1}
            />
        </Canvas>
    );
}

const Blob = ({ interaction }: { interaction: string }) => {
    const meshRef = useRef<any>(null);


    let gu = {
        time: { value: 0 }
    };

    useFrame((state, delta) => {
        const { clock } = state;
        const elapsedTime = clock.getElapsedTime()
        gu.time.value = elapsedTime * 0.08;

        if (meshRef && meshRef.current) {

            if (interaction === 'scroll') {
                const { scrollY } = window;
                meshRef.current.rotation.y = scrollY / 500
            }
            if (interaction === 'timer') {
                meshRef.current.rotation.y += delta / 5
            }
            // const { scrollY } = window;
            // meshRef.current.rotation.y = elapsedTime * 0.08 + scrollY / 500
            // meshRef.current.rotation.y = elapsedTime * 0.08


            // meshRef.current.rotation.set(new Vector3(0, 0, elapsedTime * 0.1));
        }
        // if (meshRef.current && meshRef.current.material && meshRef.current.material.uniforms && meshRef.current.material.uniforms.u_time) {
        //     meshRef.current.material.uniforms.u_time.value =
        //         0.4 * clock.getElapsedTime();

        //     meshRef.current.material.uniforms.u_intensity.value = MathUtils.lerp(
        //         meshRef.current.material.uniforms.u_intensity.value,
        //         0.15,
        //         0.02
        //     );
        // }
    });

    const noiseShader = `
    //	Simplex 4D Noise 
    //	by Ian McEwan, Ashima Arts
    //
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

    vec4 grad4(float j, vec4 ip){
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

    return p;
    }

    float snoise(vec4 v){
    const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                            0.309016994374947451); // (sqrt(5) - 1)/4   F4
    // First corner
    vec4 i  = floor(v + dot(v, C.yyyy) );
    vec4 x0 = v -   i + dot(i, C.xxxx);

    // Other corners

    // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
    vec4 i0;

    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    //  i0.x = dot( isX, vec3( 1.0 ) );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;

    //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;

    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    // i0 now contains the unique values 0,1,2,3 in each channel
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    //  x0 = x0 - 0.0 + 0.0 * C 
    vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
    vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
    vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
    vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

    // Permutations
    i = mod(i, 289.0); 
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
                i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
            + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
            + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
            + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
    // Gradients
    // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
    // 7*7*6 = 294, which is close to the ring size 17*17 = 289.

    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));

    // Mix contributions from the five corners
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

    }`

    return (
        <mesh
            ref={meshRef}
            scale={1.5}
            position={[0, 0, 0]}
        >
            <icosahedronGeometry args={[1, 200]} />
            <meshPhongMaterial
                color={'#ff167f'}
                emissive={new Color(0x0000ff).multiplyScalar(0.05)}
                shininess={1000}
                // reflectivity={100}
                onBeforeCompile={(shader) => {
                    shader.uniforms.time = gu.time;
                    shader.vertexShader = `
                    uniform float time;
                    ${noiseShader}
                    float noise(vec3 p){
                        float n = snoise(vec4(p, time));
                        n = sin(n * 3.1415926 * 8.);
                        n = n * 0.5 + 0.5;
                        n *= n;
                        return n;
                    }
                    vec3 getPos(vec3 p){
                        return p * (4. + noise(p * 0.875) * 0.25);
                    }
                    ${shader.vertexShader}
                    `
                        .replace(
                            `#include <beginnormal_vertex>`,
                            `#include <beginnormal_vertex>
                    
                        vec3 p0 = getPos(position);
                        
                        // https://stackoverflow.com/a/39296939/4045502
                        
                        float theta = .1; 
                        vec3 vecTangent = normalize(cross(p0, vec3(1.0, 0.0, 0.0)) + cross(p0, vec3(0.0, 1.0, 0.0)));
                        vec3 vecBitangent = normalize(cross(vecTangent, p0));
                        vec3 ptTangentSample = getPos(normalize(p0 + theta * normalize(vecTangent)));
                        vec3 ptBitangentSample = getPos(normalize(p0 + theta * normalize(vecBitangent)));
                        
                        objectNormal = normalize(cross(ptBitangentSample - p0, ptTangentSample - p0));
                        
                        ///////////////////////////////////////////////
                    `
                        )
                        .replace(
                            `#include <begin_vertex>`,
                            `#include <begin_vertex>
                        transformed = p0;
                    `
                        );
                    //console.log(shader.vertexShader);
                }}
            // fragmentShader={fragmentShader}
            // uniforms={uniforms}
            />
        </mesh>
    )
}