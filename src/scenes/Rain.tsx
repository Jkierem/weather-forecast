import { useFrame } from '@react-three/fiber'
import { EnumType, EnumTypeValue } from 'jazzi'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { Bounds, getRandom } from '../core/utils'

export const RainConfig = EnumType("RainConfig",["Light","Medium","Heavy"])

type RainProps = {
    config?: EnumTypeValue,
    xLimits: Bounds,
    yLimits: Bounds,
    zLimits: Bounds,
}

const Rain: React.FC<RainProps> = ({ 
    xLimits,
    yLimits,
    zLimits,
    config=RainConfig.Heavy
}) => {
    const { count, speed } = config.match({
        Light: () => ({ count: 50, speed: 0.01 }),
        Medium: () => ({ count: 300, speed: 0.05 }),
        Heavy: () => ({ count: 1200, speed: 0.1 }),
    })
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
            const newY = y - speed < yLimits[0] ? yLimits[1] :  y - speed
            return [x,newY,z]
        });
        geo.setAttribute('position', new Float32BufferAttribute(drops.flat(),3))
    })

    return <points geometry={geo}>
        <pointsMaterial color={0x59dcff} size={0.07} transparent={true}/>
    </points>
}

export default Rain;