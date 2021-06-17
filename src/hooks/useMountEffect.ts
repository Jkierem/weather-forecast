import { useEffect } from "react"

/**
 * Short hand for mount/unmount effects
 * @param eff effect to run on mount
 */
const useMountEffect = (eff :() => ((() => void) | void)) => {
    // This should have no deps 
    // eslint-disable-next-line
    useEffect(eff,[]) 
}

export default useMountEffect