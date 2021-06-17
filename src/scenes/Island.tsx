import React, { useMemo, useState } from "react";
import { animated, SpringRef, useChain, useSpring, useSpringRef, config } from "@react-spring/three";
import { MeshProps } from "@react-three/fiber";
import { BoxGeometry, Color, Float32BufferAttribute, MathUtils as m, MeshPhongMaterial } from 'three'
import { usePathSelector } from "redux-utility";
import { mapVerts } from "../core/utils";
import { fromLimitArrays } from "../core/BoundingBox";
import { PoppingCloud } from "./Clouds";
import { RainConfig } from "./Rain";
import Trees from "./Trees";
import Meeple from "./Meeple"
import useTimeout from "../hooks/useTimeout";

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

const Island = () => {
    const rain: RainConfig = usePathSelector("weather.rain",RainConfig.Light as RainConfig);
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

    const [popDelay, setPopDelay] = useState(2000)
    const [rainDelay, setRainDelay] = useState(1000)
    useTimeout({
        action: () => {
            setPopDelay(0)
            setRainDelay(0)
        },
        duration: 2000
    })

    return <animated.mesh 
        position={[0,-6,0]}
        rotation={[0,m.degToRad(45),0]}
    >
        <Meeple 
            delay={4000}
            position={[-8,3,8]}
            rotation={[0,-m.degToRad(45),0]}
            showUmbrella={rain >= RainConfig.Medium}
        />
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
        <PoppingCloud 
            visible={true}
            initialPosition={[5,10,5]}
            popDelay={popDelay}
            rainDelay={rainDelay}
        />
        <PoppingCloud 
            visible={true}
            initialPosition={[-5,10,-5]}
            popDelay={popDelay}
            rainDelay={rainDelay}
        />
        <PoppingCloud 
            visible={true}
            initialPosition={[-5,10,4]}
            popDelay={popDelay}
            rainDelay={rainDelay}
        />
        <PoppingCloud 
            visible={rain >= RainConfig.Medium}
            initialPosition={[5,10,-3]}
            popDelay={popDelay}
            rainDelay={rainDelay}
        />
        <PoppingCloud 
            visible={rain >= RainConfig.Medium}
            initialPosition={[-5,10,0]}
            popDelay={popDelay}
            rainDelay={rainDelay}
        />
        <PoppingCloud 
            visible={rain === RainConfig.Heavy}
            initialPosition={[0,10,-3]}
            popDelay={popDelay}
            rainDelay={rainDelay}
        />
        <PoppingCloud 
            visible={rain === RainConfig.Heavy}
            initialPosition={[3,10,3]}
            popDelay={popDelay}
            rainDelay={rainDelay}
        />
        {boxes.map((box,key) => {
            return <Trees
                key={key}
                boundary={box}
                delay={1500}
                scaleSpring={scaleSpring}
            />
        })}
        
    </animated.mesh>
}

export default Island;