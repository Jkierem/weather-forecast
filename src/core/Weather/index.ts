import { isBetween } from "../utils"

export enum WeatherState {
    Light="Light", 
    Medium="Medium", 
    Heavy="Heavy"
}

export const getWeather = (amount: number) => {
    if(amount < 40){
        return WeatherState.Light
    } else if(isBetween(40,100,amount)) {
        return WeatherState.Medium
    } else {
        return WeatherState.Heavy
    }
}

type WeatherMap<T> = {
    [P in WeatherState]: T
}
export const mapWeather = <T>(amount: number, map: WeatherMap<T>) => {
    return map[getWeather(amount)]
}
