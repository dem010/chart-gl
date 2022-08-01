interface IMinmax {
    min: number;
    max: number;
}
export declare class ChartData {
    data: Float32Array;
    minmaxX: IMinmax;
    minmaxY: IMinmax;
    constructor(data: Float32Array | Array<number>);
    getData(): Float32Array;
}
export {};
