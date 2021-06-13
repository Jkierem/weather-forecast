import React from "react"
import { Sky } from "@react-three/drei"
import { usePathSelector } from "redux-utility"
import useLinear from "../../hooks/useLinear"

export enum SkyTime {
    Calm=1,
    Rain=0.2,
    Storm=0,
}

const Light: React.FC<{}> = ({ children }) => {
    const skyConfig = usePathSelector("weather.sky",SkyTime.Calm);
    const rayleigh = useLinear(skyConfig,skyConfig,{
        precision: 4
    })

    return <>
        <Sky azimuth={-3} inclination={0.7} distance={1000} rayleigh={rayleigh}/>
        <ambientLight intensity={0.2} />
        <directionalLight color="white" position={[1, 5, 1]} intensity={0.8} />
        {children}
    </>
}

export default Light