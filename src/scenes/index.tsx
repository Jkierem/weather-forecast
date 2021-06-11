import { Sky } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Maybe } from 'jazzi'
import React, { useMemo, useRef } from 'react'
import type { Mesh } from 'three'
import { CanvasStateValue } from '../core/Canvas'
import Clouds from './Clouds'
import { WireframeGeometry, BoxGeometry } from 'three'

type SceneHandlerProps = {
    state: CanvasStateValue
}

export const SceneHandler: React.FC<SceneHandlerProps> = ({ state }): JSX.Element => {
    const meshRef = useRef<Mesh>()
    useFrame(({ clock }) => {
        Maybe.fromNullish(meshRef.current).effect((mesh) => {
            // mesh!.rotation.x = clock.getElapsedTime()
        })
    })

    const g = useMemo(() => {
        return new WireframeGeometry(new BoxGeometry(40,20,40))
    },[])

    return <mesh ref={meshRef}>
        <Sky azimuth={1} inclination={0.6} distance={1000} rayleigh={1}/>
        {/* <lineSegments geometry={g}>
            <lineBasicMaterial color={0x0000ff}/>
        </lineSegments> */}
        {/* <boxGeometry />
        <meshPhongMaterial color="royalblue" /> */}
        <Clouds />
    </mesh>
}