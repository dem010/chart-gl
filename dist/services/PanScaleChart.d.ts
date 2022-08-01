import Chart from './Chart';
import PanScale from './PanScale';
export default class PanScaleChart extends PanScale {
    private offset;
    constructor(chart: Chart);
    bindHandlers(): void;
    unbindHandlers(): void;
    handlerMouseDown(event: MouseEvent): void;
    handlerMouseMove(event: MouseEvent): void;
    handlerMouseUp(event: MouseEvent): void;
    handlerWheel(event: WheelEvent): void;
    handlerTouchStart(event: TouchEvent): void;
    handlerTouchMove(event: TouchEvent): void;
    handlerTouchEnd(event: TouchEvent): void;
}
