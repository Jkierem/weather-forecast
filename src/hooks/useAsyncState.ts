  
import { Reducer, useReducer } from "react"

export type AsyncState<T,E> = {
    loading: boolean,
    attempted: boolean, 
    data?: T, 
    error?: E
}

type State<T,E> = AsyncState<T,E>
type NullaryAction<T> = { type: T }
type UnaryAction<T,U> = { type: T, payload: U }
type AsyncAction<T,E> = 
| NullaryAction<"fetch"> 
| UnaryAction<"success",T>
| UnaryAction<"error",E>
type AsyncReducer<T,E> = Reducer<State<T,E>,AsyncAction<T,E>>

type AsyncStateHook<T,E> = {
    state: State<T,E>,
    dispatch: React.Dispatch<AsyncAction<T, E>>,
    actions: {
        success: (data: T) => void,
        error: (error: E) => void,
        fetch: () => void,
    },
    events: {
        start: () => void,
        onSuccess: (data: T) => void,
        onError: (error: E) => void
    }
}

const reducer = <T,E>(state: State<T,E>, action: AsyncAction<T,E>) => {
    switch(action.type){
        case "success":
            return {
                loading: false,
                error: undefined,
                data: action.payload,
                attempted: true
            }
        case "fetch":
            return {
                loading: true,
                error: undefined,
                data: undefined,
                attempted: true
            }
        case "error":
            return {
                loading: true,
                error: action.payload,
                data: undefined,
                attempted: true
            }
        default:
            return state
    } 
}

const nullaryActionCreator = <Type>(type: Type) => (): NullaryAction<Type> => ({ type })
const unaryActionCreator = <Type>(type: Type) => <Payload>(payload: Payload): UnaryAction<Type,Payload> => ({ type, payload })
const success = unaryActionCreator<"success">("success");
const error = unaryActionCreator<"error">("error");
const fetch = nullaryActionCreator<"fetch">("fetch");

type Config = {
    lazy?: boolean
}

const useAsyncState = <Data,Err>(config: Config = {}): AsyncStateHook<Data,Err> => {
    const { lazy } = config
  const initial: State<Data,Err> = { loading: !lazy, data: undefined, error: undefined, attempted: !lazy }
  const [state, dispatch] = useReducer<AsyncReducer<Data,Err>>(reducer, initial)
  return {
    state,
    dispatch,
    actions: {
        success,
        error,
        fetch
    },
    events: {
      start: () => dispatch(fetch()),
      onSuccess: (data: Data) => dispatch(success(data)),
      onError: (data: Err) => dispatch(error(data)),
    },
  }
}

export default useAsyncState