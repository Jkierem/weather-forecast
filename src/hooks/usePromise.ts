import { useEffect } from "react"
import useAsyncState, { AsyncState } from "./useAsyncState"

export type Config<T> = {
    data?: T
    lazy?: boolean;
}

export type PromiseHook<T,U> = AsyncState<T,Error> & {
    refetch: (newData?: U) => void
}

/**
 * Receives a function that returns a promise and returns a state that is
 * hooked to react using hooks. Can receive a data argument as part of config
 */
const usePromise = <Data,Args>(fn: (data?: Args) => Promise<Data>, config: Config<Args> = {}): PromiseHook<Data,Args> => {
  const { events, state } = useAsyncState<Data,Error>(config)
  const { data, lazy } = config
  useEffect(() => {
    if( !lazy ){
      fn(data).then(events.onSuccess).catch(events.onError)
    }
    // eslint-disable-next-line
  }, [])

  const refetch = (newData?: Args): void => {
    events.start()
    fn(newData ?? data)
      .then(events.onSuccess)
      .catch(events.onError)
  }

  return { ...state, refetch }
}

export default usePromise