import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { OverlayAction } from "../../controls/Overlay";
import { useSyncedOverlay } from "../../controls/Overlay/hooks";
import { mapWeather } from "../../core/Weather";
import usePromise from "../../hooks/usePromise";
import useWeather from "../../hooks/useWeather";
import { getWeatherData } from "../../middleware";
import { LoadingClouds } from "../../scenes/Clouds";
import Island from "../../scenes/Island";

const Live = () => {
    const { loading, data, error } = usePromise(getWeatherData);
    const weather = useWeather()

    const [ selectedDay, setSelected ] = useState(-1);

    const setWeather = useCallback((amount: number) => {
        mapWeather(amount, {
            Light: weather.setLight,
            Medium: weather.setMedium,
            Heavy: weather.setHeavy
        })()
    },[
        weather.setLight,
        weather.setMedium,
        weather.setHeavy,
    ])

    const history = useHistory()
    const handleAction = (action: OverlayAction) => {
        if( action.type === "weather" ){
            const { data } = action;
            setSelected(data.day)
            setWeather(data.amount)
        } else {
            history.push("/home")
        }
    }

    useSyncedOverlay({
        blur: loading || Boolean(error),
        weatherData: data?.days,
        selectedDay: selectedDay,
        onAction: handleAction,
    },[loading,data,selectedDay])

    useEffect(() => {
        if(loading) {
            weather.setLoading()
        } else if( selectedDay === -1 && data ){
            setSelected(data.days[0].day)
            setWeather(data.days[0].amount)
        }
    },[loading,weather,data,setWeather,selectedDay])

    return <>
        {loading &&
            <LoadingClouds />
        }
        {data && !loading && 
            <Island />
        }
    </>
}

export default Live