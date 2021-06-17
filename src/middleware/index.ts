export type DayData = {
    day: number,
    amount: number
}

export type WeatherData = {
    request: string, 
    days: DayData[]
}

export type WeatherResponse = [WeatherData]

export const getWeatherData = (): Promise<WeatherData> => {
    return fetch('https://private-4945e-weather34.apiary-proxy.com/weather34/rain')
        .then((res: Response) => res.json() as Promise<WeatherResponse>)
        .then((raw: WeatherResponse) => raw[0] );
}