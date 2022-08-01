import { AxisControl } from './AxisControl';
import Chart from './Chart';
import PanScale from './PanScale';
export default class PanScaleAxis extends PanScale {
    private offset;
    private axis;
    private canvas;
    private type;
    constructor(axis: AxisControl, chart: Chart);
    bindHandlers(): void;
    unbindHandlers(): void;
    onMouseDown(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    onMouseUp(event: MouseEvent): void;
    handlerWheel(event: WheelEvent): void;
    handlerTouchStart(event: TouchEvent): void;
    handlerTouchMove(event: TouchEvent): void;
    handlerTouchEnd(event: TouchEvent): void;
}
