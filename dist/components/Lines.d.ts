import { FC } from 'react';
import { Series } from '../types/chart';
interface LinesProps {
    series: Series[];
    sizeCanvas?: [Number, number];
}
declare const Lines: FC<LinesProps>;
export default Lines;
