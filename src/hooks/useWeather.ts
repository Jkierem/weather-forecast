import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setHeavy, setLight, setLoading, setMedium, Weathers } from "../redux/weather"

type WeatherNames = typeof Weathers[number]
type WeatherSetters = `set${WeatherNames}`; 
type WeatherAPI = { 
    [P in WeatherSetters]: () => void;
}

const useWeather = () => {
    const dispatch = useDispatch()
    return {
        setLoading: () => dispatch(setLoading()),
        setLight: () => dispatch(setLight()),
        setMedium: () => dispatch(setMedium()),
        setHeavy: () => dispatch(setHeavy()),
    } as WeatherAPI
}

export const useSetWeather = (weather: WeatherNames) => {
    const weatherCtrl = useWeather()
    useEffect(() => {
        weatherCtrl[`set${weather}` as WeatherSetters]();
    },[weather, weatherCtrl])
}

export default useWeather;