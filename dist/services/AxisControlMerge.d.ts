import { AxisParameters } from '../types/chart';
import { AxisControl } from './AxisControl';
/** отступ от границ области графика для оси Y если не задан domain */
export declare class AxisControlMerge extends AxisControl {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {[]} series
     */
    constructor(canvas: HTMLCanvasElement, { align, type, domain, format, style, chartProperties }: AxisParameters);
    enablePan(): void;
    setOptionsParameters(): void;
    /** Спозиционировать график в зависимости от заданного/не заданного domain */
    setVisibilityArea(): void;
    drawYAxis(): void;
    /** настройка генератора тиков. получение количества тиков */
    tuneTickGenerator(): void;
    update(): void;
}
