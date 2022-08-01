import { AxisOptions, AxisParameters, AxisTypeType, ChartOptions, ChartSeries, ITick } from '../types/chart';
import Chart from './Chart';
import Overlay from './Overlay';
/** отступ от границ области графика для оси Y если не задан domain */
export declare const YAXIS_SPACING = 0.07;
export declare class AxisControl {
    protected ctx: CanvasRenderingContext2D | null;
    canvas: HTMLCanvasElement;
    /** минимум оси */
    min: number[];
    /** максимум оси */
    max: number[];
    type: AxisTypeType;
    /** максимальная ширина/высота оси в зависимости от размера тика */
    protected maxWidth: number;
    /**серии принадлежащие оси. Рисуем только их */
    protected axisSeries: ChartSeries[];
    axisOptions: AxisOptions;
    protected chart: Chart | undefined;
    protected chartOptions: ChartOptions | undefined;
    ticks: ITick[][];
    scale: number[];
    translate: number[];
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {AxisParameters[]} axisParameters
     */
    constructor(canvas: HTMLCanvasElement, { align, type, domain, format, chartProperties, split, style }: AxisParameters);
    destroy(): void;
    /** Задать ширину/высоту оси в зависимости от размеров тиков оси */
    setAxisSize(): void;
    drawAxis(): void;
    drawXAxis(): void;
    drawYAxis(): void;
    drawAxisText(ctx: CanvasRenderingContext2D, text: string[], x: number, y: number, lineHeight: number): void;
    resizeCanvasToDisplaySize(multiplier?: number): boolean;
    format(value: number): string[];
    resize(size?: [number, number]): void;
    /**
     * Создать сетку
     * @param {HTMLCanvasElement} canvas канвас
     * @param {string} color цвет сетки
     * @returns
     */
    createGrid(canvas: HTMLCanvasElement, color: string): Overlay | null;
    tuneTickGenerator(): void;
    tickGenerator(min: number, max: number, tickSize: number): ITick[];
    /**
     * Запрашивает матрицу для переданной серии данных
     * @param {{}} series серия для которой запрашивается матрица
     */
    getMatrix(series: ChartSeries): import("./MatrixControl").default | null;
    update(): void;
    protected getFont(): string;
}
