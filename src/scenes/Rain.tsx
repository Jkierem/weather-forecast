import { useSpring, animated } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { BoundingBox, upper } from '../core/BoundingBox'
import { getRandom, isBetween } from '../core/utils'
import { Tuple3 } from '../core/utils/types'

export enum RainConfig {
    Light=0,
    Medium=1,
    Heavy=2
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

type RainDrop = {
    mark: RainConfig | "death",
    pos: Tuple3<number>;
}

const getMark = (idx: number) => {
    if( idx < 50 ){
        return RainConfig.Light
    } else if(isBetween(50,300,idx)) {
        return RainConfig.Medium
    } else {
        return RainConfig.Heavy
    }
}

const generateDrops = (count: number, gen: BoundingBox): RainDrop[] => {
    const drops: RainDrop[] = [];
    for ( let i = 0; i < count; i ++ ) {
        const x = getRandom(...gen.x);
        const y = getRandom(...gen.y);
        const z = getRandom(...gen.z);
        drops.push({
            mark: 0,
            pos: [ x, y, z ]
        });
    }
    return drops;
}

type RainProps = {
    config?: RainConfig,
    generationBounds: BoundingBox,
    visibilityBounds: BoundingBox,
    delay?: number,
    visibility: boolean 
}

const Rain: React.FC<RainProps> = ({ 
    generationBounds: gen,
    visibilityBounds: vis,
    visibility,
    config=RainConfig.Light,
    delay=0
}) => {
    const [waiting, setWaiting] = useState(delay ? true : false)
    const { count, speed } = getConfig(config)
    // let drops = useMemo(() => generateDrops(count,gen),[count,gen]);
    // geo.setAttribute("position", new Float32BufferAttribute(drops.flat(),3))
    
    const geo = useMemo(() => new BufferGeometry(),[])
    useEffect(() => {
        let id: number;
        if( waiting ){
            id = window.setTimeout(() => setWaiting(false), delay)
        }
        return () => { id ?? clearTimeout(id) }
    },[delay, waiting, setWaiting])
    let dropsRef: React.MutableRefObject<RainDrop[]> = useRef([])
    useFrame(() => {
        let { current: drops } = dropsRef;
        if( visibility ){
            let state: "static" | "inc" | "dec" = "static";
            if( drops.length !== count ){
                state = drops.length < count ? "inc" : "dec"
            }
            if( state === "inc" ){
                drops = drops.concat(generateDrops(count - drops.length,gen)).map((x,idx) => {
                    return {
                        mark: getMark(idx),
                        pos: x.pos
                    }
                })
            }
            if( !waiting ){
                const highestMark = getMark(drops.length - 1);
                dropsRef.current = drops.map((rainDrop) => {
                    const { pos, mark } = rainDrop
                    const [x,y,z] = pos;
                    if( y - speed < vis.y[0] ){
                        if( state === "dec" && mark === highestMark ){
                            return { mark: "death" as "death", pos };
                        } else {
                            return {
                                mark,
                                pos: [x,upper(vis.y),z] as Tuple3<number>
                            };
                        }
                    }
                    return { mark, pos: [x,y-speed,z] as Tuple3<number> };
                }).filter(drop => drop.mark !== "death");
            }
        } else {
            dropsRef.current = []
        }
        const visible = drops.map(drop => drop.pos).filter((point) => visibility && vis.isTupleInside(point))
        geo.setAttribute('position', new Float32BufferAttribute(visible.flat(),3))
    })
    const { color } = useSpring({ color: config === RainConfig.Heavy ? 0x59dcff : 0x0000ff })
    return <points geometry={geo}>
        <animated.pointsMaterial color={color} size={0.07} transparent={true}/>
    </points>
}

export default Rain;