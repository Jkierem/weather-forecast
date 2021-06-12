import { Sky } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Maybe } from 'jazzi'
import React, { useMemo, useRef } from 'react'
import type { Mesh } from 'three'
import Light from '../components/Lights'
import { CanvasStateValue } from '../core/Canvas'
import { LoadingClouds } from './Clouds'
import Terrain from './Terrain'

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

    return <mesh ref={meshRef}>
        <Light>
        {
            state.match({
                Demo: () => <Terrain />,
                Initial: () => <LoadingClouds />,
                Live: () => <LoadingClouds />,
            })
        }
        </Light>
    </mesh>
}