import { Matrix4 } from '../utils/m4';
import AxesMatricesCtrl from './AxesMatricesCtrl';
import PanScaleChart from './PanScaleChart';
import { ChartOptions, ChartProperties, ChartSeries, Series } from '../types/chart';
import MatrixControl from './MatrixControl';
export default class Chart {
    private m4;
    protected primitiveType: number;
    gl: WebGLRenderingContext | null;
    canvas: HTMLCanvasElement;
    options: ChartOptions;
    series: ChartSeries[];
    protected panScale: PanScaleChart | undefined;
    protected dataCount: number;
    protected projectionMatrix: Matrix4;
    protected positionAttributeLocation: number | null;
    protected matrixLocation: WebGLUniformLocation | null;
    protected colorUniformLocation: WebGLUniformLocation | null;
    axesMatricesCtrl: AxesMatricesCtrl;
    constructor(canvas: HTMLCanvasElement, chartProperties: ChartProperties);
    destroy(): void;
    getGL(): WebGLRenderingContext | null;
    /** Очищаю canvas */
    clear(): void;
    /** Задать размер canvas и пересчитать матрицу*/
    setSize(): void;
    setColor(color: string): void;
    resize(size?: [number, number]): void;
    setSeries(series: Series[]): void;
    /** рисую массив */
    draw(matrixCtrl: MatrixControl): void;
    drawSeries(): void;
    setData(data: Float32Array): void;
}
