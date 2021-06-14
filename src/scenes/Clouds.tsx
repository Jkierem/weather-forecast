import { BufferGeometry, SphereGeometry, Vector3, MeshPhongMaterial } from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import React, { useMemo, useRef } from "react"
import { getRandom, getRandomInt, iterateVerts, mapVerts, range} from '../core/utils'
import { animated, config, useSpring } from '@react-spring/three'
import Rain, { RainConfig } from './Rain'
import { EnumType } from 'jazzi'
import { fromBounds, fromGeometry, lower } from '../core/BoundingBox'
import { MeshProps } from '@react-three/fiber'
import { useState } from 'react'
import { useEffect } from 'react'
import { usePathSelector } from 'redux-utility'

const jitter = (geo: BufferGeometry) => {
    return iterateVerts(geo, (v) => (v.map(x => getRandom(0,0.2) + x) as [number,number,number]))
}

const chop = (geo: BufferGeometry, limitY: number) => {
    return iterateVerts(geo, ([x,y,z]) => [x,Math.max(y,limitY),z])
}

const defaultDelta = () => 1
const Cloud = ({ 
    size=3, 
    delta=defaultDelta, 
    rainDelay=0,
    rainSeverity=RainConfig.Light,
    visibility=true,
    ...rest 
}) => {
    const geo = useMemo(() => {
        const geos = []
        let prev = 1.5
        for(let i = 0; i < size ; i++){
            const sizeDelta = getRandom(-0.3,0.3);
            const newSize = prev + (prev * sizeDelta)
            prev = newSize
            const displace = getRandomInt(0,2) % 2 === 0;
            const current = new SphereGeometry(newSize,14,13)
            current.translate(
                delta()*i,
                displace ? 0 : getRandom(-0.4,0.4),
                displace ? 0 : getRandom(-1,1))
            const g = chop(jitter(current),-0.3)
            geos.push(new ConvexGeometry(mapVerts(g,(v) => new Vector3(...v))))
        }
        const res = BufferGeometryUtils.mergeBufferGeometries(geos);
        return res
    },[size, delta])

    const mat = useMemo(() => new MeshPhongMaterial({ color: 'white', flatShading: true }),[])

    const realBounding = useMemo(() => fromGeometry(geo),[geo]);
    const cloudFloor = lower(realBounding.y);
    const visibilityBounds = useMemo(() => fromBounds(
        realBounding.x,
        [-10, cloudFloor],
        realBounding.z
    ),[realBounding, cloudFloor]);

    const generationBounds = useMemo(() => fromBounds(
        realBounding.x,
        [cloudFloor, cloudFloor+10],
        realBounding.z
    ),[realBounding, cloudFloor])

    return <animated.mesh geometry={geo}  material={mat} {...rest}>
        <Rain
            delay={rainDelay}
            visibilityBounds={visibilityBounds}
            generationBounds={generationBounds}
            config={rainSeverity}
            visibility={visibility}
        />
    </animated.mesh>
}

const NormalCloud = (props: any) => <Cloud size={4} {...props}/>
const SmallCloud = (props: any) => <Cloud size={3} {...props}/>
const BigCloud = (props: any) => <Cloud size={6} {...props}/>

const RandomCloud = (props: any) => {
    const type = useRef(getRandomInt(0,4));
    switch(type.current){
        case 0:
        default:
            return <NormalCloud {...props}/>
        case 1:
            return <SmallCloud {...props}/>
        case 2:
            return <BigCloud {...props}/>
    }
} 

type MovingCloudProps = { 
    y: number,
    z: number, 
    duration: number, 
    direction: number,
    displace: number
}
const MovingCloud: React.FC<MovingCloudProps> = ({ y , duration, direction, z, displace }) => {
    const { x } = useSpring({
        from: { x: -30*direction - (displace*direction) }, 
        to: { x: 30*direction + (displace*direction) },
        loop: true,
        config: {
            duration 
        }
    })
    const rainSeverity = usePathSelector("weather.rain",RainConfig.Light)
    return <RandomCloud position-x={x} position-y={y} position-z={z} rainSeverity={rainSeverity}/>
}

export const CloudConfig = EnumType("CloudConfig",["Light","Medium","Heavy"])

export const LoadingClouds = () => {
    return <>
        {range(0,30).map((y) => {
            const duration = getRandomInt(8000,23000);
            const direction = getRandomInt(0,2) % 2 ? 1 : -1
            const height = getRandom(-15,8)
            const depth = getRandomInt(-20,-5)
            const displace = getRandomInt(15,40);
            return <MovingCloud 
                key={y} 
                y={height} 
                z={depth} 
                duration={duration} 
                direction={direction}
                displace={displace}
            />
        })}
    </>
}

export type PoppingCloudProps = {
    /**
     * Delay of the popping animation
     */
    popDelay?: number;
    /**
     * Delay between popping and rain starting to fall
     * The real rain delay passed to the rain component is popDelay + rainDelay
     */
    rainDelay?: number;
    visible?: boolean;
    initialPosition: [number,number,number];
} & MeshProps

export const PoppingCloud: React.FC<PoppingCloudProps> = ({
    popDelay=2000,
    rainDelay:rawRainDelay=1000,
    visible=false,
    initialPosition: pos,
}) => {
    const [visibility, setVisibility] = useState(false)
    const rainSeverity = usePathSelector("weather.rain",RainConfig.Light)

    useEffect(() => {
        setVisibility(visible)
    },[visible])

    const { scale } = useSpring({ 
        scale: visibility ? 1 : 0,
        delay: popDelay,
        config: config.gentle
    })
    const rainDelay = popDelay + rawRainDelay;
    return <Cloud 
        size={5}
        rainDelay={rainDelay}
        rainSeverity={rainSeverity}
        scale={scale}
        visibility={visibility}
        position={pos}
    />
}