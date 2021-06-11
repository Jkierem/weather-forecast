import React from "react"
import { OverlayProps } from "."

const defaultOverlay = {
    setOverlayProps: (props: OverlayProps) => {},
    resetOverlay: () => {}
}
export const OverlayContext = React.createContext(defaultOverlay)