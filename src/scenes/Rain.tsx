import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { BoundingBox } from '../core/BoundingBox'
import { getRandom } from '../core/utils'

export enum RainConfig {
    Light,
    Medium,
    Heavy
}

const getConfig = (config: RainConfig) => {
    switch(config){
        case RainConfig.Light:
            return { count: 50, speed: 0.1 }
        case RainConfig.Medium:
            return { count: 300, speed: 0.1 }    
        case RainConfig.Heavy:
            return { count: 1000, speed: 0.1 }
    }
}

const generateDrops = (count: number, gen: BoundingBox): [number,number,number][] => {
    const drops: [number,number,number][] = [];
    for ( let i = 0; i < count; i ++ ) {
        const x = getRandom(...gen.x);
        const y = getRandom(...gen.y);
        const z = getRandom(...gen.z);
        drops.push([ x, y, z ]);
    }
    return drops;
}

type RainProps = {
    config?: RainConfig,
    generationBounds: BoundingBox,
    visibilityBounds: BoundingBox,
    delay?: number
}

const Rain: React.FC<RainProps> = ({ 
    generationBounds: gen,
    visibilityBounds: vis,
    config=RainConfig.Light,
    delay=0
}) => {
    const [waiting, setWaiting] = useState(delay ? true : false)
    const { count, speed } = getConfig(config)
    let drops = useMemo(() => generateDrops(count,gen),[count,gen]);
    const geo = new BufferGeometry()
    geo.setAttribute("position", new Float32BufferAttribute(drops.flat(),3))

    useEffect(() => {
        let id: number;
        if( waiting ){
            id = window.setTimeout(() => setWaiting(false), delay)
        }
        return () => { id ?? clearTimeout(id) }
    },[delay, waiting, setWaiting])

    useFrame(() => {
        if( !waiting ){
            drops = drops.map(([x,y,z]) => {
                const newY = y - speed < vis.y[0] ? vis.y[1] :  y - speed
                return [x,newY,z]
            });
        }
        const visible = drops.filter((point) => vis.isTupleInside(point))
        geo.setAttribute('position', new Float32BufferAttribute(visible.flat(),3))
    })

    return <points geometry={geo}>
        <pointsMaterial color={0x59dcff} size={0.07} transparent={true}/>
    </points>
}

export default Rain;