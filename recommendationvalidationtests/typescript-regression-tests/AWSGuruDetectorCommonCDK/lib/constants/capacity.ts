export interface Capacity {
    [stage: string]: CapacityPerRegion
}

export interface CapacityPerRegion {
    [region: string]: UnitCapacity
}

export interface UnitCapacity {
    instanceType: string,
    memoryLimitMiB: number,
    minCapacity: number,
    maxCapacity: number,
    warmPoolMinSize?: number,
}
