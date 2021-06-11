import { BoxedEnumType, BoxedEnumTypeRep, BoxedEnumTypeValue } from "jazzi"
import usePromise, { Config } from "./usePromise"

const promiseStates = ["Waiting","Loading", "Resolved", "Rejected"] as const
type States = typeof promiseStates[number]
type PromiseStateType<T> = BoxedEnumTypeValue<T,States >
type PromiseStateTypeRep<T> = BoxedEnumTypeRep<States, Promise<T>>

export const PromiseState: PromiseStateTypeRep<any> = BoxedEnumType("PromiseState",promiseStates)

export type Refetch<T> = (data?: T) => void

export type PromiseStateHook<Data,Args> = [PromiseStateType<Data | Error | undefined>, Refetch<Args>]

const usePromiseState = <Data,Args>(fn: (data?: Args) => Promise<Data>, config: Config<Args> = {}): PromiseStateHook<Data,Args> => {
    const { loading, data, refetch, error, attempted } = usePromise(fn,config)

    if( !attempted ){
        return [PromiseState.Waiting(undefined), refetch]
    }else if( loading ){
        return [PromiseState.Loading(undefined), refetch]
    } else if( error ){
        return [PromiseState.Rejected(error), refetch]
    } else {
        return [PromiseState.Resolved(data as Data), refetch]
    }
}

export default usePromiseState