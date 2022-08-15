import React, { FC, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { AxisControlSplit } from '../../services/AxisControlSplit'
import { ChartContext } from '../Area/Area'
import { AxisControlMerge } from '../../services/AxisControlMerge'
import { AlignType, AxisStyle } from '../../types/chart'
import { AxisControl } from '../../services/AxisControl'
import './axis.css'

export interface AxisProps {
  align?: AlignType
  /** минимум максимум оси */
  domain?: [number, number]
  sizeCanvas?: [number, number]
  format?: (value: number) => string
  /** делить ли ось на серии (применимо только к оси Y) */
  split?: boolean
  /** шрифт подписей оси (calibri, serif по умолчанию)*/
  font?: string
  /** размер шрифта подписей оси (14 по умолчанию)*/
  fontSize?: number
  /** Цвет оси и подписей (white по умолчанию)*/
  color?: string
  /** Расстояние между подписью и делителем оси (3 по умолчанию)*/
  tickOffset?: number
}

const Axis: FC<AxisProps> = ({
  align = 'bottom',
  domain,
  sizeCanvas,
  format,
  split = false,
  font = 'calibri, serif',
  fontSize = 14,
  color = '#fff',
  tickOffset = 3,
}) => {
  const chartProperties = useContext(ChartContext)

  const chart = chartProperties?.chart
  const series = chartProperties?.options.series
  const canvas = useRef<HTMLCanvasElement>(null)
  const [axis, setAxis] = useState<AxisControl | null>(null)

  useLayoutEffect(() => {
    //TODO: при смене align необходимо проверить нет ли оси с таким align. Если есть, то выдать ошибку и ничего не делать
    if (canvas.current && series && chart) {
      if (axis) axis.destroy()
      setAxis(
        split
          ? new AxisControlSplit(canvas.current, {
              chartProperties,
              domain,
              type: align === 'bottom' || align === 'top' ? 'x' : 'y',
              align,
              format,
              style: { font, fontSize, color, tickOffset },
            })
          : new AxisControlMerge(canvas.current, {
              chartProperties,
              domain,
              type: align === 'bottom' || align === 'top' ? 'x' : 'y',
              align,
              format,
              style: { font, fontSize, color, tickOffset },
            })
      )
    }
  }, [chart, series, split])

  useEffect(() => {
    axis && axis.resize(sizeCanvas)
  }, [axis, sizeCanvas])

  return (
    <div className={`chart-${align}-axis chart-axis`}>
      <canvas ref={canvas}></canvas>
    </div>
  )
}

Axis.defaultProps = {
  align: 'bottom',
  split: false,
}

Axis.propTypes = {
  align: PropTypes.oneOf<AlignType>(['top', 'left', 'bottom', 'right']).isRequired,
  split: PropTypes.bool,
}

export default Axis
