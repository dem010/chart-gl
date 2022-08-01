import React, { FC, PropsWithChildren } from 'react';
import './title.css';
import { AlignType } from '../../types/chart';
interface TitleProps {
    className?: string;
    align: AlignType;
    style: React.CSSProperties | undefined;
}
declare const Title: FC<PropsWithChildren<TitleProps>>;
export default Title;
