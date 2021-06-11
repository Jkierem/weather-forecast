import { useEffect } from "react"

const useMountEffect = (eff :() => ((() => void) | void)) => {
    // This should have no deps 
    // eslint-disable-next-line
    useEffect(eff,[]) 
}

export default useMountEffect