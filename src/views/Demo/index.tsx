import { useHistory } from "react-router"
import { SkyTime, useLight } from "../../components/Lights"
import { useOverlay } from "../../components/Overlay/hooks"
import Terrain from "../../scenes/Terrain"

const options = [
    { action: "Low" , label: "Low"     , hover: { fill: "darkred"}},
    { action: "Med" , label: "Med"     , hover: { fill: "darkred"}},
    { action: "High", label: "High"    , hover: { fill: "darkred"}},
    { action: "Back", label: "Go back" , hover: { fill: "darkred"}},
]

const Demo = () => {
    const history = useHistory()
    const light = useLight()

    const handleAction = (action: string) => {
        switch(action){
            case "Back":
                history.goBack()
                break;
            case "Low":
                light.setLight({ skyTime: SkyTime.Calm })
                break;
            case "Med":
                light.setLight({ skyTime: SkyTime.Rain })
                break;
            case "High":
                light.setLight({ skyTime: SkyTime.Storm })
                break;
        }
    }
    useOverlay({ 
        blur: false,
        sideActions: options,
        onAction: handleAction
    })
    
    return <>
        <Terrain />
    </>
}

export default Demo