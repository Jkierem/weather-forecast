import { useSpring } from "@react-spring/three"
import { Sky } from "@react-three/drei"
import React, { useContext, useState } from "react"
import useLinear from "../../hooks/useLinear"

export enum SkyTime {
    Calm=1,
    Rain=0.2,
    Storm=0,
}


export type LightContextData = {
    skyTime: SkyTime,
    ambientIntensity: number,
    sunIntensity: number,
}

export type LightContextType =  LightContextData & {
    setLight: (data: Partial<LightContextData>) => void
}

const defaultLight = {
    skyTime: SkyTime.Storm,
    ambientIntensity: 0.2,
    sunIntensity: 0.8,
}

export const LightContext = React.createContext<LightContextType>({
    ...defaultLight,
    setLight: () => {}
})

export const useLight = () => useContext(LightContext)

const Light: React.FC<{}> = ({ children }) => {
    const [value, setValue] = useState(defaultLight)
    const setLight = (data: Partial<LightContextData>) => {
        setValue(prev => ({ ...prev, ...data }))
    }

    const rayleigh = useLinear(value.skyTime,value.skyTime,{
        precision: 4
    })
    
    const {
        ambientIntensity: ai, 
        sunIntensity: si
    } = value

    return <LightContext.Provider value={{ ...value, setLight }}>
        <Sky azimuth={-3} inclination={0.7} distance={1000} rayleigh={rayleigh}/>
        <ambientLight intensity={ai} />
        <directionalLight color="white" position={[1, 5, 1]} intensity={si} />
        {children}
    </LightContext.Provider>
}

export default Light