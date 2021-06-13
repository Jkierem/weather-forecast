import { createReducer, nullaryActionCreator } from "redux-utility";
import { SkyTime } from "../components/Lights";
import Rain, { RainConfig } from "../scenes/Rain";

export const LIGHT = "LIGHT"
export const MEDIUM = "MEDIUM"
export const HEAVY = "HEAVY"

export const setLight = nullaryActionCreator(LIGHT)
export const setMedium = nullaryActionCreator(MEDIUM)
export const setHeavy = nullaryActionCreator(HEAVY)

export default createReducer({
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