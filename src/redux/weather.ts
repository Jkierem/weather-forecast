import { createReducer, nullaryActionCreator } from "redux-utility";
import { SkyTime } from "../controls/Lights";
import { RainConfig } from "../scenes/Rain";

export const LOADING = "Loading"
export const LIGHT = "Light"
export const MEDIUM = "Medium"
export const HEAVY = "Heavy"

export const Weathers = [ LOADING, LIGHT, MEDIUM, HEAVY ] as const

export const setLoading = nullaryActionCreator(LOADING)
export const setLight = nullaryActionCreator(LIGHT)
export const setMedium = nullaryActionCreator(MEDIUM)
export const setHeavy = nullaryActionCreator(HEAVY)

export default createReducer({
    [LOADING]: () => ({
        rain: RainConfig.None,
        sky: SkyTime.Calm,
    }), 
    [LIGHT]: () => ({
        rain: RainConfig.Light,
        sky: SkyTime.Calm,
    }), 
    [MEDIUM]: () => ({
        rain: RainConfig.Medium,
        sky: SkyTime.Rain
    }), 
    [HEAVY]: () => ({
        rain: RainConfig.Heavy,
        sky: SkyTime.Storm
    }), 
})