import { animated, AnimatedComponent, AnimatedProps, config, useChain, useSpring, useSpringRef } from "@react-spring/three";
import { MeshProps } from "@react-three/fiber";
import React, { useCallback } from "react";
import { useState } from "react";
import { degToRad } from "three/src/math/MathUtils";
import useTimeout from "../hooks/useTimeout";

const Head: React.FC<MeshProps> = (props) => {
    return <mesh {...props}>
        <boxGeometry args={[0.3,0.3,0.3]} />
        <meshPhongMaterial color={0xffff00} />
    </mesh>
}

const Torso: React.FC<MeshProps> = (props) => {
    return <mesh {...props}>
        <boxGeometry args={[0.4,0.6,0.4]} />
        <meshPhongMaterial color={0xff0000} />
    </mesh>
}

const Legs: React.FC<MeshProps> = (props) => {
    return <mesh {...props}>
        <mesh position={[0.1,0,0]}>
            <boxGeometry args={[0.15,0.4,0.1]} />
            <meshPhongMaterial color={0xff00ff} />
        </mesh>
        <mesh position={[-0.1,0,0]}>
            <boxGeometry args={[0.15,0.4,0.1]} />
            <meshPhongMaterial color={0xff00ff} />
        </mesh>
    </mesh>
}

const Arm: React.FC<AnimatedProps<MeshProps>> = (props) => {
    return <animated.mesh {...props}>
        <mesh position={[0,-0.25,0]}>
            <boxGeometry args={[0.15,0.5,0.15]} />
            <meshPhongMaterial color={0xff00ff} />
        </mesh>
    </animated.mesh>
}

const Umbrella: React.FC<AnimatedProps<MeshProps>> = (props) => {
    return <animated.mesh {...props}>
        <mesh>
            <boxGeometry args={[0.1,0.5,0.5]} />
            <meshPhongMaterial color={0xaaaaaa} />
        </mesh>
        <mesh position={[0,0,0]}>
            <sphereGeometry 
                args={[0.7,10,10,0,6,0,1.2]}
            />
            <meshPhongMaterial color={0xaaaaaa} />
        </mesh>
    </animated.mesh>
}

type MeepleProps = {
    delay: number;
    showUmbrella?: boolean
} & MeshProps

const Meeple: React.FC<MeepleProps> = ({
    delay,
    showUmbrella=false,
    ...rest
}) => {
    const { scale } = useSpring({ 
        scale: 1,
        from: { scale: 0 },
        config: config.wobbly,
        delay,
    })

    const [ umbVisible, setUmb ] = useState(showUmbrella);
    useTimeout({
        action: () => setUmb(true),
        onFalse: () => setUmb(false),
        duration: 500,
        condition: showUmbrella,
        deps: [showUmbrella]   
    })

    const { t } = useSpring({ t: showUmbrella ? 1 : 0 })
    const { umb } = useSpring({ umb: umbVisible ? 1 : 0 })

    const armRotY = [15,-55].map(degToRad)
    const armRotZ = [15,100].map(degToRad)

    return <animated.mesh {...rest} scale={scale}>
        <Head position={[0,1,0]}/>
        <Arm 
            position={[0.2,0.75,0]}
            rotation-y={t.to([0,1],armRotY)}
            rotation-z={t.to([0,1],armRotZ)}
        />
        <Umbrella
            scale={umb}
            position={[0.5,1.1,0]} 
        />
        <Arm 
            position={[-0.2,0.75,0]}
            rotation={[0,0,-degToRad(15)]} 
        />
        <Torso position={[0,0.5,0]}/>
        <Legs />
    </animated.mesh>
}

export default Meeple;