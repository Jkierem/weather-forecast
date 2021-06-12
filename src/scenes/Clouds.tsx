import { BufferGeometry, SphereGeometry, Vector3, MeshPhongMaterial, Box3 } from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import React, { useMemo, useRef } from "react"
import { getRandom, getRandomInt, iterateVerts, mapVerts, range, Bounds } from '../core/utils'
import { animated, useSpring } from '@react-spring/three'
import Rain from './Rain'
import { EnumType } from 'jazzi'

const jitter = (geo: BufferGeometry) => {
    return iterateVerts(geo, (v) => (v.map(x => getRandom(0,0.2) + x) as [number,number,number]))
}

const chop = (geo: BufferGeometry, limitY: number) => {
    return iterateVerts(geo, ([x,y,z]) => [x,Math.max(y,limitY),z])
}

const getBounds = (geo: BufferGeometry): { x: Bounds, y: Bounds, z: Bounds } => {
    geo.computeBoundingBox();
    const { min, max } = geo.boundingBox as Box3;
    return {
        x: [min.x, max.x],
        y: [min.y, max.y],
        z: [min.z, max.z],
    }
}

const defaultDelta = () => 1
const Cloud = ({ size=3, delta=defaultDelta,...rest }) => {
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

    const bounds = getBounds(geo);

    return <animated.mesh geometry={geo}  material={mat} {...rest}>
        <Rain
            xLimits={bounds.x}
            yLimits={[-10,bounds.y[0]]}
            zLimits={bounds.z}
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

type AnimatedCloudProps = { 
    y: number,
    z: number, 
    duration: number, 
    direction: number,
    displace: number
}
const AnimatedCloud: React.FC<AnimatedCloudProps> = ({ y , duration, direction, z, displace }) => {
    const { x } = useSpring({
        from: { x: -30*direction - (displace*direction) }, 
        to: { x: 30*direction + (displace*direction) },
        loop: true,
        config: {
            duration 
        }
    })
    return <RandomCloud position-x={x} position-y={y} position-z={z}/>
}

export const CloudConfig = EnumType("CloudConfig",["Light","Medium","Heavy"])

export const LoadingClouds = ({ config=CloudConfig.Heavy }) => {
    const amnt = config.match({
        Light: 15,
        Medium: 20,
        Heavy: 30
    })

    return <>
        {range(0,amnt).map((y) => {
            const duration = getRandomInt(8000,23000);
            const direction = getRandomInt(0,2) % 2 ? 1 : -1
            const height = getRandom(-15,8)
            const depth = getRandomInt(-20,-5)
            const displace = getRandomInt(15,40);
            return <AnimatedCloud 
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