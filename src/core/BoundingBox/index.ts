import { BufferGeometry } from "three";
import { getRandom, isBetween, zip } from "../utils";

export type Min = number
export type Max = number
export type Bound = [Min,Max]
export const lower = (x: Bound) => x[0]
export const upper = (x: Bound) => x[1]

export type BoundingBox = {
    readonly x: Bound,
    readonly y: Bound,
    readonly z: Bound,
    getBound: (idx: number) => Bound,
    generateRandomPoint: () => number[];
    isInside: (...values: number[]) => boolean;
    isTupleInside: (tup: number[]) => boolean;
}

const mkBoundingBox = (min: number[],max: number[]): BoundingBox => {
    return {
        get x(){ return this.getBound(0) },
        get y(){ return this.getBound(1) },
        get z(){ return this.getBound(2) },
        getBound(idx: number){
            return [min[idx],max[idx]]
        },
        generateRandomPoint(){
            return zip(min,max).map(([low,high]) => getRandom(low,high))
        },
        isInside(...values: number[]){
            return zip(min,max,values).every(([low,high,val]) => isBetween(low,high,val))
        },
        isTupleInside(values: number[]){
            return zip(min,max,values).every(([low,high,val]) => isBetween(low,high,val))
        },
    }
}

export const fromBounds = (...bs: Bound[]) => {
    const [min,max] = bs.reduce((lims,bound) => {
        lims[0].push(bound[0])
        lims[1].push(bound[1])
        return lims
    },[[] as number[],[] as number[]])
    return mkBoundingBox(min,max);
}

export const fromGeometry = (geo: BufferGeometry) => {
    geo.computeBoundingBox()
    const { min, max } = geo.boundingBox!;
    return mkBoundingBox(min.toArray(), max.toArray())
}

export const fromLimitArrays = mkBoundingBox