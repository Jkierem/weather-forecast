import getClassName from "getclassname"
import "./style.css"

type Styling = {
    fill?: string,
    stroke?: string,
}

type OverlayAction = {
    action: string,
    label: string,
    idle?: Styling,
    hover?: Styling,
    transition?: string,
}

export type OverlayProps = {
    blur?: boolean;
    actions?: OverlayAction[],
    sideActions?: OverlayAction[],
    onAction?: (action: string, actionData?: OverlayAction) => void,
}

const purge = <T,>(obj: { [p: string]: T | undefined }) => {
    return Object.fromEntries(Object.entries(obj).filter(([,val]) => val !== undefined ))
}

const cssVars = (pre: string, obj: Styling) => {
    return {
        [`--${pre}-fill`]: obj.fill,
        [`--${pre}-stroke`]: obj.stroke
    }
}

const defaultProps = {
    blur: true,
    actions: [] as OverlayAction[],
    sideActions: [] as OverlayAction[],
    onAction: () => {},
    children: undefined
}
const Overlay: React.FC<OverlayProps> = ({ 
    blur=true, 
    actions=[], 
    onAction=()=>{}, 
    children,
    sideActions=[], 
}=defaultProps) => {
    const rootCl = getClassName({ 
        base: "overlay",
        "&--transparent": !blur, 
    });
    const actionsCl = rootCl.extend("&__actions");
    const actionItemCl = actionsCl.extend("&__item");
    const sideCl = rootCl.extend("&__sidebar")

    const handleAction = (action: OverlayAction) => () => {
        onAction?.(action.action,action)
    }

    return <>
        {actions.length > 0 && <div className={actionsCl}>
            {actions?.map((actionData,index) => {
                const { label, idle, hover,transition } = actionData
                const style = purge({
                    ...cssVars("idle",idle ?? {}),
                    ...cssVars("hover",hover ?? {}),
                    [`--transition`]: transition
                })
                return <button 
                    className={actionItemCl} 
                    style={style} 
                    key={index} 
                    onClick={handleAction(actionData)}
                >{label}</button>
            })}
        </div>}
        {sideActions.length > 0 && <div className={sideCl}>
            {sideActions?.map((actionData,index) => {
                const { label, idle, hover,transition } = actionData
                const style = purge({
                    ...cssVars("idle",idle ?? {}),
                    ...cssVars("hover",hover ?? {}),
                    [`--transition`]: transition
                })
                return <button 
                    className={actionItemCl} 
                    style={style} 
                    key={index} 
                    onClick={handleAction(actionData)}
                >{label}</button>
            })}
        </div>}
        <div className={rootCl}>
            {children}
        </div>
    </>
}

export default Overlay