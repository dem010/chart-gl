import { Point, SeriesPoint } from '../types/chart';
interface IFindNearby {
    mousepoint: Point;
    nearestPoint?: {
        [key: string]: SeriesPoint;
    };
}
/**
 * Возвращает координаты мыши (pageX и pageY) и если в заданном радиусе присутствуют точки графика, то и их тоже
 * @param radius радиус поиска вокруг курсора в пикселях
 * @returns - { mousepoint: Point, nearestPoint?: { [name: string]: Point }
}
 */
export declare function useFindNearestPoint(radius: number): IFindNearby;
export {};
