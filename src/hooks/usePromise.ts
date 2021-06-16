import { useEffect, useState } from "react"

export type Config<T> = {
    data?: T
}

type State<T> = {
  loading: boolean;
  error?: any; 
  data?: T;
}

export type PromiseHook<T,U> = State<T> & {
    refetch: (newData?: U) => void
}

/**
 * Receives a function that returns a promise and returns a state that is
 * hooked to react using hooks. Can receive a data argument as part of config
 */
const usePromise = <Data,Args>(fn: (data?: Args) => Promise<Data>, config: Config<Args> = {}): PromiseHook<Data,Args> => {
  const [ state, setState ] = useState<State<Data>>({ loading: false, data: undefined, error: undefined });
  const { data } = config
  useEffect(() => {
    fn(data)
    .then((data) => setState({ loading: false , data , error: undefined }))
    .catch((error) => setState({ loading: false, data: undefined, error }))
  }, [fn,data,setState])

  const refetch = (newData?: Args): void => {
    fn(newData || data)
    .then((data) => setState({ loading: false , data , error: undefined }))
    .catch((error) => setState({ loading: false, data: undefined, error }))
  }

  return { ...state, refetch }
}

export default usePromise