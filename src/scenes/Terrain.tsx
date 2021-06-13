import { animated, SpringRef, useChain, useSpring, useSpringRef, config } from "@react-spring/three";
import { MeshProps } from "@react-three/fiber";
import { BoxGeometry, Color, Float32BufferAttribute, MathUtils as m, MeshPhongMaterial } from 'three'
import React, { useMemo } from "react";
import { mapVerts } from "../core/utils";
import Trees from "./Trees";
import { fromLimitArrays } from "../core/BoundingBox";
import { PoppingCloud } from "./Clouds";

type SlabProps = {
    color: number
    size?: [number,number,number],
    segments?: [number,number,number]
} & MeshProps

const unit = [1,1,1]
const unitSeg = [1,1,1]
const Green = 0x489e16
const Brown = 0xe38a52

type GradientSlabProps = {
    topColor: number;
    bottomColor: number;
} & Omit<SlabProps,"color">

const GradientSlab: React.FC<GradientSlabProps> = ({
    topColor, 
    bottomColor, 
    size=unit, 
    segments=unitSeg, 
    ...rest 
}) => {
    const [g,m] = useMemo(() => {
        const geo = new BoxGeometry(...size);
        const top = new Color(topColor)
        const bot = new Color(bottomColor)
        const colors = mapVerts(geo, ([x,y,z]) => y < 0 ? [bot.r,bot.g,bot.b] : [top.r,top.g,top.b])
        geo.setAttribute("color",new Float32BufferAttribute(new Float32Array(colors.flat()),3))
        geo.attributes.color.needsUpdate = true
        const mat = new MeshPhongMaterial({ vertexColors: true })
        return [geo,mat]
    },[topColor,bottomColor,size])

    return <animated.mesh material={m} geometry={g} {...rest}/>
}

const boxes = [
    fromLimitArrays([ 0,-6, 3],[ 6, 0, 7]),
    fromLimitArrays([ 0, 0, 3],[ 6, 6, 7]),
    fromLimitArrays([-6,-6, 3],[ 0, 0, 7])
]

const slabConfig = (ref: SpringRef) => ({ h: 1, from: { h: 0 }, ref, config: config.wobbly })

const Terrain = () => {
    const slab1Ref = useSpringRef()
    const { h: h1 } = useSpring(slabConfig(slab1Ref))
    const slab2Ref = useSpringRef()
    const { h: h2 } = useSpring(slabConfig(slab2Ref))
    const slab3Ref = useSpringRef()
    const { h: h3 } = useSpring(slabConfig(slab3Ref))

    const scaleRef = useSpringRef()
    const scaleSpring = useSpring({ scale: 1, from: { scale: 0 }, ref: scaleRef })

    useChain([
        slab1Ref,
        slab2Ref,
        slab3Ref, 
        scaleRef
    ],[0,0.2,0.4,1]);

    return <animated.mesh 
        position={[0,-6,0]}
        rotation={[0,m.degToRad(45),0]}
    >
        <GradientSlab
            topColor={Green} 
            bottomColor={Green} 
            size={[15,1,15]}
            position-y={h1.to([0,1],[-10,1])}
        />
        <GradientSlab
            topColor={Green} 
            bottomColor={Brown} 
            size={[15,2,15]}
            position-y={h2.to([0,1],[-11.5,-0.5])}
        />
        <GradientSlab
            topColor={Brown} 
            bottomColor={Brown} 
            size={[15,6,15]}
            position-y={h3.to([0,1],[-15.5,-4.5])}
        />
        {boxes.map((box) => {
            return <Trees
                boundary={box}
                delay={1500}
                scaleSpring={scaleSpring}
            />
        })}
        <mesh position={[0,10,0]}>
            <PoppingCloud 
            />
        </mesh>
    </animated.mesh>
}

export default Terrain;