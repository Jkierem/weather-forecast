import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setHeavy, setLight, setLoading, setMedium, Weathers } from "../redux/weather"

type WeatherNames = typeof Weathers[number]
type WeatherSetters = `set${WeatherNames}`; 
type WeatherAPI = { [P in WeatherSetters]: () => void; }

/**
 * Used to gain access to the Weather API and control the weather
 * @returns WeatherAPI
 */
const useWeather = () => {
    const dispatch = useDispatch()
    return {
        setLoading: () => dispatch(setLoading()),
        setLight: () => dispatch(setLight()),
        setMedium: () => dispatch(setMedium()),
        setHeavy: () => dispatch(setHeavy()),
    } as WeatherAPI
}

/**
 * Shorthand for setting an specific weather setting on mount
 * @param weather 
 */
export const useSetWeather = (weather: WeatherNames) => {
    const weatherCtrl = useWeather()
    useEffect(() => {
        weatherCtrl[`set${weather}` as WeatherSetters]();
    },[weather, weatherCtrl])
}

export default useWeather;