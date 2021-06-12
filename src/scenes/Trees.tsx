import { animated } from "@react-spring/three"
import { MeshProps } from "@react-three/fiber"
import { useMemo } from "react"
import mkBoundingBox, { BoundingBox } from "../core/BoundingBox"
import { range } from "../core/utils"

type TreesProps = {
    amount?: number
    /**
     * Boundary to determine the space where trees can spawn.
     * Must be a 4D Boundary where the last dimension is tree height
     */
    boundary?: BoundingBox,
} & MeshProps

type Tuple3<T> = [T,T,T]
type Tuple4<T> = [T,T,T,T]

const defBound = mkBoundingBox([-1,-1,-1,3],[1,1,1,7])
const generateData= (amount: number, boundary: BoundingBox): Tuple4<number>[] => {
    return range(0,amount).map(() => boundary.generateRandomPoint() as Tuple4<number>)
}
const Trees: React.FC<TreesProps> = ({ amount=5, boundary=defBound, ...rest }) => {
    const positions: Tuple4<number>[] = useMemo(() => generateData(amount, boundary),[amount, boundary])
    return <animated.mesh {...rest}>
        {positions.map((data,key) => {
            const position = data.slice(0,3) as Tuple3<number>
            const height = data[data.length - 1]
            return <mesh key={key} position={position}>
                <coneBufferGeometry args={[1,height,32]} />
                <meshPhongMaterial color={0x00ff00}/>
            </mesh>
        })}
    </animated.mesh>
}

export default Trees