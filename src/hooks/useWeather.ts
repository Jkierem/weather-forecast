import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setHeavy, setLight, setMedium } from "../redux/weather"

const useWeather = () => {
    const dispatch = useDispatch()
    return {
        setLight: () => dispatch(setLight()),
        setMedium: () => dispatch(setMedium()),
        setHeavy: () => dispatch(setHeavy()),
    }
}

export const useSetWeather = (weather: "Light" | "Medium" | "Heavy") => {
    const weatherCtrl = useWeather()
    useEffect(() => {
        // @ts-ignore
        weatherCtrl[`set${weather}`]();
    },[weather])
}

export default useWeather;