import { useOverlay } from "../../components/Overlay/hooks";
import { CanvasStateEnum, useCanvas } from "../../core/Canvas";
import useMountEffect from "../../hooks/useMountEffect";

const Live = () => {
    useOverlay({ blur: false })
    const { setState, state: prevState } = useCanvas()
    useMountEffect(() => {
        setState(CanvasStateEnum.Live)
        return () => setState(prevState)
    })
    return <></>
}

export default Live