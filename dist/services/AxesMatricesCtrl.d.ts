import { AlignType, AxisTypeType, ChartSeries } from '../types/chart';
import Chart from './Chart';
import MatrixControl from './MatrixControl';
interface INamedMC {
    [key: string]: MatrixControl;
}
export default class AxesMatricesCtrl {
    private chart;
    private all;
    private yAxes;
    private xAxes;
    series: INamedMC;
    constructor(chart: Chart);
    add({ refX, refY, id, data, label }: ChartSeries): void;
    forEach(cb: (value: MatrixControl, index: number, array: MatrixControl[]) => void, type?: AxisTypeType, align?: AlignType): void;
    getOneAxis(type: AxisTypeType, align: AlignType): MatrixControl | null;
    /** Удалить все матрицы */
    clear(): void;
}
export {};
