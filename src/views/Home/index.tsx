
import { useHistory } from "react-router"
import { OverlayAction } from "../../controls/Overlay"
import { useOverlay } from "../../controls/Overlay/hooks"
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
    },
    {
        action: "github",
        label: <img height="40px" alt="check out the code" src="png/github.png"/>
    }
]

const Home = () => {
    const history = useHistory()
    const handleSelect = (action: OverlayAction) => {
        if( action.action === "github" ){
            window.location.href = "https://github.com/Jkierem/weather-forecast"
        } else {
            history.push(action.action)
        } 
    }
    useSetWeather("Loading")
    useOverlay({ actions: options, onAction: handleSelect })

    return <LoadingClouds />
}

export default Home