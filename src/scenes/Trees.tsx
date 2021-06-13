import { animated, useTrail, SpringValue, config } from "@react-spring/three"
import { MeshProps } from "@react-three/fiber"
import { useMemo } from "react"
import { fromLimitArrays, BoundingBox } from "../core/BoundingBox"
import { range } from "../core/utils"
import { Tuple4 } from "../core/utils/types"

type TreesProps = {
    amount?: number,
    /**
     * Boundary to determine the space where trees can spawn.
     * Must be a 3D Boundary where the [x,y,height]
     */
    boundary?: BoundingBox,
    baseHeight?: number,
    scaleSpring: { scale: SpringValue<number> };
    delay: number;
} & MeshProps

const defBound = fromLimitArrays([-1,-1,3],[1,1,7])
const generateData= (amount: number, boundary: BoundingBox): Tuple4<number>[] => {
    return range(0,amount).map(() => boundary.generateRandomPoint() as Tuple4<number>)
}
const Trees: React.FC<TreesProps> = ({ 
    amount=5, 
    boundary=defBound, 
    baseHeight=3, 
    scaleSpring,
    delay,
    ...rest 
}) => {
    const positions: Tuple4<number>[] = useMemo(() => generateData(amount, boundary),[amount, boundary])
    const trail = useTrail(5,{ y: baseHeight, from: { y: baseHeight-10 }, delay, config: config.wobbly });
    return <animated.mesh {...rest}>
        {positions.map(([x,z,height],key) => {
            const { y } = trail[key]
            const { scale } = scaleSpring
            return <animated.mesh key={key}
                scale={scale}
                position-x={x}
                position-y={y}
                position-z={z}
            >
                <coneBufferGeometry args={[1,height,32]} />
                <meshPhongMaterial color={0x00ff00}/>
            </animated.mesh>
        })}
    </animated.mesh>
}

export default Trees