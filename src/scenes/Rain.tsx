import { useMemo, useState, useRef } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { BoundingBox, lower, upper } from '../core/BoundingBox'
import { getRandom, isBetween } from '../core/utils'
import { Tuple3 } from '../core/utils/types'
import useTimeout from '../hooks/useTimeout'

export enum RainConfig {
    None=-1,
    Light=0,
    Medium=1,
    Heavy=2
}

const getConfig = (config: RainConfig) => {
    switch(config){
        case RainConfig.None:
            return { count: 0, speed: 0 } 
        case RainConfig.Light:
            return { count: 50, speed: 0.1 }
        case RainConfig.Medium:
            return { count: 200, speed: 0.1 }    
        case RainConfig.Heavy:
            return { count: 600, speed: 0.1 }
    }
}

type RainDrop = {
    mark: RainConfig | "removal",
    pos: Tuple3<number>;
}

const getMark = (idx: number) => {
    if( idx < 50 ){
        return RainConfig.Light
    } else if(isBetween(50,200,idx)) {
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
    
    const geo = useMemo(() => new BufferGeometry(),[])
    
    useTimeout({
        action: () => setWaiting(false),
        duration: delay,
        condition: waiting,
        deps: [delay, waiting, setWaiting]
    })
    let dropsRef: React.MutableRefObject<RainDrop[]> = useRef([])
    const visibleRef: React.MutableRefObject<boolean> = useRef(visibility);

    useTimeout({
        action: () => { visibleRef.current = true },
        duration: 3000,
        condition: visibility,
        deps: [visibility],
        onFalse: () => {
            dropsRef.current = []
            visibleRef.current = false
        }
    })

    useFrame(() => {
        let drops;
        if( visibleRef.current ){
            drops = dropsRef.current;
            let state: "static" | "inc" | "dec" = "static";
            if( drops.length !== count ){
                state = drops.length < count ? "inc" : "dec"
            }
            if( state === "inc" ){
                drops = drops.concat(generateDrops(count - drops.length,gen))
                    .map((x,idx) => {
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
                    if( y - speed < lower(vis.y) ){
                        if( state === "dec" && mark === highestMark ){
                            return { mark: "removal" as "removal", pos };
                        } else {
                            return {
                                mark,
                                pos: [x,upper(vis.y),z] as Tuple3<number>
                            };
                        }
                    }
                    return { mark, pos: [x,y-speed,z] as Tuple3<number> };
                }).filter(drop => drop.mark !== "removal");
            }
        } else {
            dropsRef.current = []
            drops = dropsRef.current
        }
        const visibleDrops = drops.map(drop => drop.pos).filter((point) => { 
            return visibility && vis.isTupleInside(point)
        })
        geo.setAttribute('position', new Float32BufferAttribute(visibleDrops.flat(),3))
    })
    const { color } = useSpring({ color: config === RainConfig.Heavy ? 0x59dcff : 0x0000ff })
    return <points geometry={geo}>
        <animated.pointsMaterial color={color} size={0.07} transparent={true}/>
    </points>
}

export default Rain;