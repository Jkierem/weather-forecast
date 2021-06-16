import { applyMiddleware, createStore } from "redux"
import { getDevtoolsCompose } from "redux-utility"
import { SkyTime } from "./controls/Lights"
import { rootReducer } from "./reducer"
import { RainConfig } from "./scenes/Rain"

export const initialState = {
    weather: {
        sky: SkyTime.Calm,
        rain: RainConfig.Light
    }
}

const initStore = () => {
    const composeEnhancers = getDevtoolsCompose(process.env.NODE_ENV === "development")

    const enhancers: any[] = []
    
    const store = createStore(
        rootReducer,
        initialState as any,
        composeEnhancers(
            applyMiddleware(...enhancers)
        )
    )

    return store;
}

export const store = initStore()