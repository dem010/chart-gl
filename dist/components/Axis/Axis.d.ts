import { FC } from 'react';
import './axis.css';
import { AlignType } from '../../types/chart';
export interface AxisProps {
    align?: AlignType;
    /** минимум максимум оси */
    domain?: [number, number];
    sizeCanvas?: [number, number];
    format?: (value: number) => string;
    /** делить ли ось на серии (применимо только к оси Y) */
    split?: boolean;
    /** шрифт подписей оси (calibri, serif по умолчанию)*/
    font?: string;
    /** размер шрифта подписей оси (14 по умолчанию)*/
    fontSize?: number;
    /** Цвет оси и подписей (white по умолчанию)*/
    color?: string;
    /** Расстояние между подписью и делителем оси (3 по умолчанию)*/
    tickOffset?: number;
}
declare const Axis: FC<AxisProps>;
export default Axis;
