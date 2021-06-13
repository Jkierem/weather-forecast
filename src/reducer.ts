import { combineReducers } from "redux";
import weatherReducer from "./redux/weather";

export const rootReducer = combineReducers({
    weather: weatherReducer,
})