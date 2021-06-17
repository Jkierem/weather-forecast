import { useHistory } from "react-router"
import { OverlayAction } from "../../controls/Overlay"
import { useOverlay } from "../../controls/Overlay/hooks"
import useWeather from "../../hooks/useWeather"
import Island from "../../scenes/Island"

const options = [
    { action: "Low" , label: "Low"     , hover: { fill: "darkred"}},
    { action: "Med" , label: "Med"     , hover: { fill: "darkred"}},
    { action: "High", label: "High"    , hover: { fill: "darkred"}},
    { action: "Back", label: "Go back" , hover: { fill: "darkred"}},
]

const Demo = () => {
    const history = useHistory()
    const weather = useWeather()

    const handleAction = (action: OverlayAction) => {
        switch(action.action){
            case "Back":
                history.goBack()
                break;
            case "Low":
                weather.setLight()
                break;
            case "Med":
                weather.setMedium()
                break;
            case "High":
                weather.setHeavy()
                break;
        }
    }
    useOverlay({ 
        blur: false,
        sideActions: options,
        onAction: handleAction
    })
    
    return <Island />
}

export default Demo