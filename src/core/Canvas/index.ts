import { EnumType, EnumTypeRep, EnumTypeValue } from "jazzi";
import React, { useContext } from "react";

const canvasStates = ["Initial" , "Demo" , "Live"] as const 
type CanvasStates = typeof canvasStates[number]
type CanvasStateType = EnumTypeRep<CanvasStates>
export type CanvasStateValue = EnumTypeValue
export const CanvasStateEnum: CanvasStateType = EnumType("CanvasState", ["Initial","Demo","Live"])

const defaultCanvas = {
    state: CanvasStateEnum.Initial,
    setState: (nextState: CanvasStateValue) => {}
}

export const CanvasContext = React.createContext(defaultCanvas);

export const useCanvas = () => useContext(CanvasContext);