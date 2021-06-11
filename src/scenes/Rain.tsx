import { useFrame } from '@react-three/fiber'
import { PointsMaterial, BufferGeometry, Float32BufferAttribute, SphereGeometry } from 'three'
import { Bounds, getRandom } from '../core/utils'

type RainProps = {
    count: number,
    xLimits: Bounds,
    yLimits: Bounds,
    zLimits: Bounds,
    xDisplace: number
}

const Rain: React.FC<RainProps> = ({ 
    count = 1000,
    xLimits,
    yLimits,
    zLimits,
    xDisplace
}) => {
    let drops: [number,number,number][] = [];
    for ( let i = 0; i < count; i ++ ) {
        const x = getRandom(...xLimits);
        const y = getRandom(...yLimits);
        const z = getRandom(...zLimits);
        drops.push([ x, y, z ]);
    }


    const geo = new BufferGeometry()
    geo.setAttribute("position", new Float32BufferAttribute(drops.flat(),3))

    useFrame(() => {
        drops = drops.map(([x,y,z]) => {
            const newY = y - 0.1 < yLimits[0] ? yLimits[1] :  y - 0.01
            return [x - ((xDisplace as any).toJSON() * 0.01),newY,z]
        });
        geo.setAttribute('position', new Float32BufferAttribute(drops.flat(),3))
    })

    return <points geometry={geo}>
        <pointsMaterial color={0x000099} size={0.07} transparent={true}/>
    </points>
}

export default Rain;