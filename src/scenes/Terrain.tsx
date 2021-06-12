import { animated } from "@react-spring/three";
import { MeshProps } from "@react-three/fiber";
import { BoxGeometry, Color, Float32BufferAttribute, MathUtils as m, MeshPhongMaterial } from 'three'
import React, { useMemo } from "react";
import { mapVerts } from "../core/utils";
import Trees from "./Trees";
import mkBoundingBox from "../core/BoundingBox";

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
    topColor, bottomColor, size=unit, segments=unitSeg, ...rest 
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

const Terrain = () => {
    return <animated.mesh 
        position={[0,-5,0]}
        rotation={[0,m.degToRad(45),0]}
    >
        <GradientSlab
            topColor={Green} 
            bottomColor={Green} 
            size={[15,1,15]}
            position={[0,1,0]}
        />
        <GradientSlab
            topColor={Green} 
            bottomColor={Brown} 
            size={[15,2,15]}
            position={[0,-0.5,0]}
        />
        <GradientSlab
            topColor={Brown} 
            bottomColor={Brown} 
            size={[15,6,15]}
            position={[0,-4.5,0]}
        />
        <Trees boundary={mkBoundingBox([ 0, 3,-6, 3],[ 6, 3, 0, 5])}/>
        <Trees boundary={mkBoundingBox([ 0, 3, 0, 3],[ 6, 3, 6, 5])}/>
        <Trees boundary={mkBoundingBox([-6, 3,-6, 3],[ 0, 3, 0, 5])}/>
    </animated.mesh>
}

export default Terrain;