import { ChartOptions } from '../types/chart';
import { AxisControl } from './AxisControl';
export default class Overlay {
    private canvas;
    private opt;
    static instance: Overlay;
    static getInstance(canvas: HTMLCanvasElement, opt: ChartOptions): Overlay;
    private ctx;
    private axes;
    private color;
    constructor(canvas: HTMLCanvasElement, opt: ChartOptions);
    addAxis(axis: AxisControl): void;
    removeAxis(axis: AxisControl): void;
    setColor(color: string): void;
    drawVerticalLine: (ctx: CanvasRenderingContext2D, x: number, y: number, height: number, color: string) => void;
    drawHorizontalLine: (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, color: string) => void;
    draw(): void;
    drawGrid(): void;
    update(): void;
    resize(size?: [number, number]): void;
    resizeCanvasToDisplaySize(multiplier?: number): boolean;
}
