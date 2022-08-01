import { AxisTypeType, ChartSeries, SeriesPoint } from '../types/chart';
import { Matrix4 } from '../utils/m4';
import Chart from './Chart';
import { ChartData } from './ChartData';
export default class MatrixControl {
    name: string;
    chart: Chart;
    data: ChartData;
    label?: string | undefined;
    m4: {
        new (): {};
        MatType: Float32ArrayConstructor;
        multiply(a: Matrix4, b: Matrix4, dst?: Matrix4 | undefined): Matrix4;
        addVectors(a: import("../utils/m4").Vector3, b: import("../utils/m4").Vector3, dst?: import("../utils/m4").Vector3 | undefined): import("../utils/m4").Vector3;
        subtractVectors(a: import("../utils/m4").Vector3, b: import("../utils/m4").Vector3, dst?: import("../utils/m4").Vector3 | undefined): import("../utils/m4").Vector3;
        scaleVector(v: import("../utils/m4").Vector3, s: number, dst?: import("../utils/m4").Vector3 | undefined): import("../utils/m4").Vector3;
        normalize(v: import("../utils/m4").Vector3, dst?: import("../utils/m4").Vector3 | undefined): import("../utils/m4").Vector3;
        mLength(v: import("../utils/m4").Vector3): number;
        lengthSq(v: import("../utils/m4").Vector3): number;
        cross(a: import("../utils/m4").Vector3, b: import("../utils/m4").Vector3, dst?: import("../utils/m4").Vector3 | undefined): import("../utils/m4").Vector3;
        dot(a: import("../utils/m4").Vector3, b: import("../utils/m4").Vector3): number;
        distanceSq(a: import("../utils/m4").Vector3, b: import("../utils/m4").Vector3): number;
        distance(a: import("../utils/m4").Vector3, b: import("../utils/m4").Vector3): number;
        identity(dst?: Matrix4 | undefined): Matrix4;
        transpose(m: Matrix4, dst?: Matrix4 | undefined): Matrix4;
        lookAt(cameraPosition: import("../utils/m4").Vector3, target: import("../utils/m4").Vector3, up: import("../utils/m4").Vector3, dst?: Matrix4 | undefined): Matrix4;
        perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number, dst?: Matrix4 | undefined): Matrix4;
        orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number, dst?: Matrix4 | undefined): Matrix4;
        frustum(left: number, right: number, bottom: number, top: number, near: number, far: number, dst: Matrix4): Matrix4;
        translation(tx: number, ty: number, tz: number, dst?: Matrix4 | undefined): Matrix4;
        translate(m: Matrix4, tx: number, ty: number, tz: number, dst?: Matrix4 | undefined): Matrix4;
        xRotation(angleInRadians: number, dst?: Matrix4 | undefined): Matrix4;
        xRotate(m: Matrix4, angleInRadians: number, dst?: Matrix4 | undefined): Matrix4;
        yRotation(angleInRadians: number, dst?: Matrix4 | undefined): Matrix4;
        yRotate(m: Matrix4, angleInRadians: number, dst?: Matrix4 | undefined): Matrix4;
        zRotation(angleInRadians: number, dst?: Matrix4 | undefined): Matrix4;
        zRotate(m: Matrix4, angleInRadians: number, dst?: Matrix4 | undefined): Matrix4;
        axisRotation(axis: import("../utils/m4").Vector3, angleInRadians: number, dst?: Matrix4 | undefined): Matrix4;
        axisRotate(m: Matrix4, axis: import("../utils/m4").Vector3, angleInRadians: number, dst?: Matrix4 | undefined): Matrix4;
        scaling(sx: number, sy: number, sz: number, dst?: Matrix4 | undefined): Matrix4;
        scale(m: Matrix4, sx: number, sy: number, sz: number, dst?: Matrix4 | undefined): Matrix4;
        compose(translation: number[], quaternion: number[], scale: number[], dst?: Matrix4 | undefined): Matrix4;
        inverse(m: Matrix4, dst?: Matrix4 | undefined): Matrix4;
        transformVector(m: Matrix4, v: import("../utils/m4").Vector4, dst: import("../utils/m4").Vector4): import("../utils/m4").Vector4;
        transformPoint(m: Matrix4, v: import("../utils/m4").Vector3, dst?: import("../utils/m4").Vector4 | undefined): import("../utils/m4").Vector4;
        transformDirection(m: Matrix4, v: import("../utils/m4").Vector3, dst: import("../utils/m4").Vector4): import("../utils/m4").Vector4;
        transformNormal(m: Matrix4, v: import("../utils/m4").Vector3, dst: import("../utils/m4").Vector3): import("../utils/m4").Vector3;
        copy(src: Matrix4, dst: Matrix4): Matrix4;
    };
    private gl;
    private translationMatrix;
    private scaleMatrix;
    private matrix;
    private scaleX;
    private scaleY;
    private translateX;
    private translateY;
    private xDisabled;
    private yDisabled;
    minY: number | null;
    maxY: number | null;
    private autoYScale;
    protected axisSeries: ChartSeries[] | null;
    protected num: number;
    constructor(name: string, chart: Chart, data: ChartData, label?: string | undefined);
    private resetY;
    private resetX;
    /**
     * Сбросить матрицы по заданной оси или по обоим
     * @param type тип оси
     */
    reset(type: AxisTypeType | 'all' | undefined): void;
    multiply(projectionMatrix: Matrix4): Matrix4;
    getMatrix(): Matrix4 | null;
    getTransformData(): {
        translateX: number;
        translateY: number;
        scaleX: number;
        scaleY: number;
        originX: number;
        originY: number;
        minY: number;
        maxY: number;
    };
    /** прекращаю движение */
    stopmove(trX: number, trY: number): void;
    /** движение графика */
    move(trX: number, trY: number): void;
    translate(trX: number | undefined, trY: number | undefined): void;
    resize(scX: number, scY: number): void;
    scale(sclX: number | undefined, sclY: number | undefined, originX: number, originY: number, draw?: boolean): void;
    zoomIn(coefX: number, coefY: number, originX: number, originY: number): void;
    zoomOut(coefX: number, coefY: number, originX: number, originY: number): void;
    /** тач скалирование по оси X */
    touchScale(zoom: number, originX: number, trX: number): void;
    disable(type: AxisTypeType, set: boolean): void;
    setAutoScaleY(set: boolean): void;
    setAxisSeries(axisSeries: ChartSeries[], num: number): void;
    recalculateMinMax(): void;
    /**
     * Преобразовать координаты canvas в координаты серии которая принадлежит к данной MatrixControl
     * @param pointX точка x относительно canvas
     * @param pointY точка y относительно canvas
     * @returns координаты относительно серии
     */
    convertClientPtToSeriesPt(pointX: number, pointY: number): {
        x: number;
        y: number;
    };
    getClientDistance(x1: number, y1: number, x2: number, y2: number): number;
    searchNearbyPoint(pointX: number, pointY: number, radius: number): SeriesPoint | undefined;
}
