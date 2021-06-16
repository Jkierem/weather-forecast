import { animated, AnimatedProps, config, useSpring } from "@react-spring/three";
import { MeshProps, useLoader } from "@react-three/fiber";
import React, { Suspense } from "react";
import { useState } from "react";
import { TextureLoader } from "three";
import { degToRad } from "three/src/math/MathUtils";
import useTimeout from "../hooks/useTimeout";

const SKIN = 0xfcb479;

const Head: React.FC<MeshProps> = (props) => {
    return <mesh {...props}>
        <boxGeometry args={[0.3,0.3,0.3]} />
        <meshPhongMaterial color={SKIN} />
    </mesh>
}

const Torso: React.FC<MeshProps> = (props) => {
    const [ jean, shirt ] = useLoader(TextureLoader,[ "textures/jean.jpg", "textures/lumberjack.jpg"])
    return <mesh {...props}>
        <mesh position={[0,0.05,0]}>
            <boxGeometry args={[0.4,0.5,0.4]} />
            <meshPhongMaterial map={shirt} />
        </mesh>
        <mesh position={[0,-0.2,0]}>
            <boxGeometry args={[0.4,0.15,0.4]} />
            <meshPhongMaterial map={jean} />
        </mesh>
    </mesh>
}

const Legs: React.FC<MeshProps> = (props) => {
    const [ jean ] = useLoader(TextureLoader,[ "textures/jean.jpg" ])
    return <mesh {...props}>
        <mesh position={[0.1,0,0]}>
            <boxGeometry args={[0.15,0.4,0.1]} />
            <meshPhongMaterial map={jean} />
        </mesh>
        <mesh position={[-0.1,0,0]}>
            <boxGeometry args={[0.15,0.4,0.1]} />
            <meshPhongMaterial map={jean} />
        </mesh>
    </mesh>
}

const Arm: React.FC<AnimatedProps<MeshProps>> = (props) => {
    const [ shirt ] = useLoader(TextureLoader,[ "textures/lumberjack.jpg"])
    return <animated.mesh {...props}>
        <mesh position={[0,-0.25,0]}>
            <boxGeometry args={[0.15,0.4,0.15]} />
            <meshPhongMaterial color={SKIN} />
        </mesh>
        <mesh position={[0,-0.1,0]}>
            <boxGeometry args={[0.2,0.2,0.2]} />
            <meshPhongMaterial map={shirt} />
        </mesh>
    </animated.mesh>
}

const Umbrella: React.FC<AnimatedProps<MeshProps>> = (props) => {
    return <animated.mesh {...props}>
        <mesh>
            <boxGeometry args={[0.1,0.6,0.1]} />
            <meshPhongMaterial color={0xaaaaaa} />
        </mesh>
        <mesh position={[0,0,0]}>
            <sphereGeometry args={[0.7,10,10,0,6,0,1.2]} />
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

    return <Suspense fallback={null}>
        <animated.mesh {...rest} scale={scale}>
            <Head position={[0,1,0]}/>
            <Arm 
                position={[0.2,0.8,0]}
                rotation-y={t.to([0,1],armRotY)}
                rotation-z={t.to([0,1],armRotZ)}
            />
            <Umbrella
                scale={umb}
                position={[0.5,1.1,0]} 
            />
            <Arm 
                position={[-0.2,0.8,0]}
                rotation={[0,0,-degToRad(15)]} 
            />
            <Torso position={[0,0.5,0]}/>
            <Legs />
        </animated.mesh>
    </Suspense> 
}

export default Meeple;