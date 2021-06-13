
import { useHistory } from "react-router"
import { useOverlay } from "../../components/Overlay/hooks"
import { useSetWeather } from "../../hooks/useWeather"
import { LoadingClouds } from "../../scenes/Clouds"

const options = [
    { 
        action: "live", 
        label: "Live Mode",
        idle: { fill: "FireBrick"},
        hover: { fill: "DarkRed" } 
    },
    { 
        action: "demo", 
        label: "Demo Mode", 
        idle: { fill: "Olive"},
        hover: { fill: "DarkOliveGreen" }  
    }
]

const Home = () => {
    const history = useHistory()
    const handleSelect = (action: string) => {
        history.push(action)
    }
    useSetWeather("Medium")
    useOverlay({ actions: options, onAction: handleSelect })

    return <LoadingClouds />
}

export default Home