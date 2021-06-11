export const iterateVerts = (geo: THREE.BufferGeometry ,fn: (v: [number,number,number]) => [number,number,number]) => {
    const pos = geo.getAttribute("position")
    const count = pos.count
    for(let i = 0; i < count ; i++){
        pos.setXYZ(i,...fn([
            pos.getX(i), pos.getY(i), pos.getZ(i)
        ]))
    }
    geo.attributes.position.needsUpdate = true;
    return geo
}

export const mapVerts = <T,>(geo: THREE.BufferGeometry ,fn: (v: [number,number,number]) => T):T[] => {
    const pos = geo.getAttribute("position")
    const count = pos.count
    const verts = [] as T[]
    for(let i = 0; i < count ; i++){
        verts.push(fn([
            pos.getX(i), pos.getY(i), pos.getZ(i)
        ]))
    }
    return verts
}

export function getRandom(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const range = ( start: number, end: number, step=1 ) => {
    const data = []
    for(let i = start; i < end ; i+=step)
        data.push(i)
    return data
}

export type Min = number
export type Max = number
export type Bounds = [Min,Max]


export const getLimits = (data: number[]): Bounds => {
    return data.reduce(([min,max],n) => [min > n ? n : min, max < n ? n : max],[Infinity,-Infinity])
}
