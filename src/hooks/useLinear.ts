import { useEffect, useRef, useState } from "react"

type Milliseconds = number;
export type GradientConfig = {
    precision?: number;
    duration?: Milliseconds;
    steps?: number
}

const defaultConfig = {
    precision: 2,
    duration: 1000,
    steps: 40
}

const useLinear = (initial: number, trigger: number, config: GradientConfig=defaultConfig) => {
    const { 
        precision=2,
        duration=1000,
        steps=40
    } = config
    const intervalTime = Math.floor(duration/steps);

    const [ current, setCurrent ] = useState(initial)
    const intervalRef = useRef(-1)
    useEffect(() => {
        if( intervalRef.current > -1 ){
            clearInterval(intervalRef.current)
        }
        if( current !== trigger){
            const step = (trigger - current)/steps
            let done = (curr:number, target:number) => curr > target
            if( trigger < current ){
                done = (curr:number, target:number) => curr < target
            }

            intervalRef.current = window.setInterval(() => {
                setCurrent(curr => {
                    if(done(curr+step,trigger)){
                        clearInterval(intervalRef.current)
                        return curr
                    }
                    return Number((curr + step).toFixed(precision))
                })   
            },intervalTime);
        }
        return () => {intervalRef.current !== -1 && clearInterval(intervalRef.current)}
    // eslint-disable-next-line
    },[trigger])

    return current
}

export default useLinear