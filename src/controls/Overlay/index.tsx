import getClassName from "getclassname"
import React from "react"
import { mapWeather } from "../../core/Weather"
import { DayData } from "../../middleware"
import "./style.css"

type Styling = {
    fill?: string,
    stroke?: string,
}

export type OverlayGenericAction = {
    type: "generic",
    action: string,
    label?: string | React.ReactNode,
    idle?: Styling,
    hover?: Styling,
    transition?: string,
}

export type OverlayWeatherAction = {
    type: "weather",
    action: "weather",
    data: DayData,
}

export type OverlayAction = OverlayGenericAction | OverlayWeatherAction

export type OverlayGenericActionProp = Omit<OverlayGenericAction,"type">

export type OverlayProps = {
    blur?: boolean;
    actions?: OverlayGenericActionProp[],
    sideActions?: OverlayGenericActionProp[],
    weatherData?: { day: number, amount: number }[],
    selectedDay?: number,
    onAction?: (actionData: OverlayAction) => void,
    onGoBack?: () => void,
}

const purge = <T,>(obj: { [p: string]: T | undefined }) => {
    return Object.fromEntries(Object.entries(obj).filter(([,val]) => val !== undefined ))
}

const cssVars = (pre: string, obj: Styling) => {
    return {
        [`--${pre}-fill`]: obj.fill,
        [`--${pre}-stroke`]: obj.stroke
    }
}

const clamp = (lower: number, upper: number) => (val: number): number => {
    return val < lower ? lower :
            val > upper ? upper :
             val
}

const getDropLevel = (amount: number) => {
    const m = Number(-(4/15).toFixed(3));
    const level = clamp(-10,30)((amount * m) + 30);

    return {
        transform: `rotateZ(45deg) translateX(${level}px)`
    }
}

const Overlay: React.FC<OverlayProps> = ({ 
    children,
    blur=true, 
    actions=[], 
    sideActions=[],
    weatherData=[],
    selectedDay=0,
    onAction=()=>{}, 
    onGoBack=()=>{},
}={}) => {
    const rootCl = getClassName({ 
        base: "overlay",
        "&--transparent": !blur, 
    });
    const actionsCl = rootCl.extend("&__actions");
    const actionItemCl = actionsCl.extend("&__item");
    const sideCl = rootCl.extend("&__sidebar");

    const daysCl = getClassName({ base: "day-cards" })
    const dayCardCl = daysCl.extend("&__card");
    const dayCardRainCl = dayCardCl.extend("&__rain")
    const dayCardDayCl = dayCardCl.extend("&__day")

    const handleAction = (action: OverlayAction) => (e: React.MouseEvent) => {
        onAction?.(action)
    }

    const handleWeatherAction = (data: DayData) => (e: React.MouseEvent) => {
        onAction?.({ data, action: "weather", type: "weather" });
    } 

    const selIndex = weatherData?.findIndex(({ day }) => day === selectedDay)
    const computeDayCardClass = (idx: number, placeholder: boolean=false) => dayCardCl.recompute({
        "&--selected": idx === selIndex,
        "&--prev": idx === selIndex - 1,
        "&--next": idx === selIndex + 1,
        "&--placeholder": placeholder
    }) 

    return <>
        {actions.length > 0 && <div className={actionsCl}>
            {actions?.map((actionData,index) => {
                const { label, idle, hover,transition } = actionData
                const style = purge({
                    ...cssVars("idle",idle ?? {}),
                    ...cssVars("hover",hover ?? {}),
                    [`--transition`]: transition
                })
                return <button 
                    className={actionItemCl} 
                    style={style} 
                    key={index} 
                    onClick={handleAction({ type: "generic", ...actionData})}
                >{label}</button>
            })}
        </div>}
        {sideActions.length > 0 && <div className={sideCl}>
            {sideActions?.map((actionData,index) => {
                const { label, idle, hover,transition } = actionData
                const style = purge({
                    ...cssVars("idle",idle ?? {}),
                    ...cssVars("hover",hover ?? {}),
                    [`--transition`]: transition
                })
                return <button 
                    className={actionItemCl} 
                    style={style} 
                    key={index} 
                    onClick={handleAction({ type: "generic" ,...actionData})}
                >{label}</button>
            })}
        </div>}
        {weatherData.length > 0 && <><div className={daysCl}>
            <div className={computeDayCardClass(-1,true)}></div>
            {weatherData.map(({ day, amount },key) => {
                const cl = computeDayCardClass(key)
                const icon = mapWeather(amount, {
                    Light: "png/light.png",
                    Medium: "png/medium.png",
                    Heavy: "png/heavy.png"
                })
                const alt = mapWeather(amount, {
                    Light: "light rain",
                    Medium: "medium rain",
                    Heavy: "heavy rain"
                }) 
                return <div 
                    key={key} 
                    className={cl} 
                    onClick={handleWeatherAction({ day, amount })}
                >
                    <div className={dayCardRainCl}>
                        <div className={dayCardRainCl.extend("&__text")}>{amount}</div>
                        <div 
                            className={dayCardRainCl.extend("&__water")}
                            style={getDropLevel(amount)}
                        ></div>
                    </div>
                    <div className={dayCardDayCl}>{day}</div>
                    <figure>
                        <img alt={alt} width="45px" src={icon}/>
                    </figure>
                </div>
            })}
            <div className={computeDayCardClass(weatherData.length,true)}></div>
        </div>
        <div className="home">
            <button className="home__button" onClick={handleAction({ type: "generic", action: "Home" })}>
                <img alt="go home" src="png/home.png"/>
            </button>
        </div>
        </>}
        <div className={rootCl}>
            {children}
        </div>
    </>
}

export default Overlay