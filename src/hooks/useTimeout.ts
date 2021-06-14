import { useEffect } from "react"

type TimeoutConfig = {
    action: () => void,
    duration: number,
    deps?: any[],
    condition?: boolean
    onFalse?: () => void 
}

const useTimeout = ({
    action, 
    duration, 
    deps=[],
    condition=true,
    onFalse=()=>{}
}: TimeoutConfig) => {
    useEffect(() => {
        let id: number;
        if( condition ){
            id = window.setTimeout(action,duration);
        } else {
            onFalse()
        }
        return () => { id && window.clearTimeout(id) } 
    // eslint-disable-next-line
    },deps)
}

export default useTimeout