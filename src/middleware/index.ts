import { Async, Maybe } from "jazzi"

export type DayData = {
    day: number,
    amount: number
}

export type WeatherData = {
    request: string, 
    days: DayData[]
}

export type WeatherResponse = [WeatherData]

const mockedData = Async.Success<unknown, WeatherData>({
    request: "[Mocked]",
    days: [
        { day: 1, amount: 1 },
        { day: 2, amount: 60 },
        { day: 3, amount: 120 },
        { day: 4, amount: 85 },
        { day: 5, amount: 70 },
        { day: 6, amount: 55 },
        { day: 7, amount: 32 },
        { day: 8, amount: 41 },
        { day: 9, amount: 170 },
    ]
})

const getEnv = (key: string) => Maybe.fromNullish(process.env[`REACT_APP_${key}`])

const callBackend = Async.require<{ url: string }>()
    .access("url")
    .chain(url => Async.from(() => {
        return fetch(url)
            .then((res: Response) => res.json() as Promise<WeatherResponse>)
            .then((raw: WeatherResponse) => raw[0] );
    }))
    .recover(() => mockedData)

export const getWeatherData = (): Promise<WeatherData> => {
    return getEnv("BACK_END")
        .fold(
            () => mockedData, 
            (url) => callBackend
                .provide({ url: url as unknown as string })
                .recover(() => mockedData)
        ).run()

}