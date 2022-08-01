import { AlignType, AxisTypeType, PanType } from '../types/chart';
import AxesMatricesCtrl from './AxesMatricesCtrl';
import Chart from './Chart';
export default class PanScale {
    protected chart: Chart;
    protected matricesCtrl: AxesMatricesCtrl;
    protected isTranslate: boolean;
    protected mouseStartTranslate: [number, number];
    prevCenter: number;
    prevDistance: number;
    constructor(chart: Chart, matricesCtrl: AxesMatricesCtrl);
    destroy(): void;
    unbindHandlers(): void;
    panStart({ clientX, clientY }: PanType): void;
    pan({ clientX, clientY }: PanType, type?: AxisTypeType, align?: AlignType): void;
    panEnd({ clientX, clientY }: PanType, type?: AxisTypeType, align?: AlignType): void;
    scaleStart(touches: TouchList): void;
    scaleTo(touches: TouchList): void;
    scaleStop(touches: TouchList): void;
}
