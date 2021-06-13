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

export default useWeather;