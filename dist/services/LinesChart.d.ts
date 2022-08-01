import Chart from './Chart';
import { ChartProperties } from '../types/chart';
export default class LinesChart extends Chart {
    constructor(canvas: HTMLCanvasElement, chartProperties: ChartProperties);
    initGl(): void;
    /**
     * Задаю массив точек
     * @param {Float32Array} data набор точек
     */
    setData(data: Float32Array): void;
}
