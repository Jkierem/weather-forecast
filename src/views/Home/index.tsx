import { useHistory } from "react-router"
import { useOverlay } from "../../components/Overlay/hooks"

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

    useOverlay({ actions: options, onAction: handleSelect })

    return <></>
}

export default Home