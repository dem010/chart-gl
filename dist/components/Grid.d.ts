import { RefX, RefY } from '../types/chart';
import { FC } from 'react';
interface GridProps {
    color?: string;
    refX?: RefX;
    refY?: RefY;
}
declare const Grid: FC<GridProps>;
export default Grid;
