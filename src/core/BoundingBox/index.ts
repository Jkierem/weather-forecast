import { getRandom, zip } from "../utils";

export type Bound = [number,number]

export type BoundingBox = {
    readonly x: Bound,
    readonly y: Bound,
    readonly z: Bound,
    getBound: (idx: number) => Bound,
    generateRandomPoint: () => number[];
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
        }
    }
}

export default mkBoundingBox;