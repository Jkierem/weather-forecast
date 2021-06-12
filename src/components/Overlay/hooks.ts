import { useContext } from "react";
import { OverlayProps } from ".";
import useMountEffect from "../../hooks/useMountEffect";
import { OverlayContext } from "./context";

export const useOverlay = (newProps: OverlayProps) => {
    const { setOverlayProps: set, resetOverlay: cleanup } = useContext(OverlayContext);
    useMountEffect(() => {
        set(newProps);
        return cleanup
    })
}