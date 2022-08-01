import { AxisParameters } from '../types/chart';
import { AxisControl } from './AxisControl';
export default class AxisControlSplit extends AxisControl {
    constructor(canvas: HTMLCanvasElement, { align, type, domain, format, style, chartProperties }: AxisParameters);
    disablePan(): void;
    setOptionsParameters(): void;
    /** Задать ширину/высоту оси в зависимости от размеров тиков оси */
    setAxisSize(): void;
    /** настройка генератора тиков. получение количества тиков */
    tuneTickGenerator(): void;
    update(): void;
    /** Спозиционировать график в зависимости от заданного/не заданного domain */
    setVisibilityArea(): void;
    drawYAxis(): void;
}
