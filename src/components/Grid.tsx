import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ChartContext } from './Area/Area'
import { RefX, RefY } from '../types/chart'
import { FC } from 'react'
import Overlay from '../services/Overlay'

export interface GridProps {
  color?: string
  refX?: RefX
  refY?: RefY
}

const Grid: FC<GridProps> = ({ color = '#555', refY = 'left', refX = 'bottom' }) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const chartProperties = useContext(ChartContext)

  const [overlay, setOverlay] = useState<Overlay | null>(null)

  useEffect(() => {
    if (canvas.current && chartProperties && chartProperties.options.axes.length) {
      chartProperties.options.axes.forEach((axis) => {
        if (canvas.current && (axis.axisOptions.align === refY || axis.axisOptions.align === refX))
          setOverlay(axis.createGrid(canvas.current, color))
      })
    }
  }, [canvas, chartProperties, color])

  useEffect(() => {
    if (overlay && chartProperties && chartProperties.setProp) chartProperties.setProp((prev) => ({ ...prev }))
  }, [overlay])

  return (
    <div className="chart-grid-canvas">
      <canvas ref={canvas} id="chart-grid" style={{ width: '100%', height: '100%', position: 'absolute' }} />
    </div>
  )
}

Grid.defaultProps = {
  color: '#555',
  refY: 'left',
  refX: 'bottom',
}

Grid.propTypes = {
  color: PropTypes.string,
  refX: PropTypes.oneOf<RefX>(['bottom', 'top']),
  refY: PropTypes.oneOf<RefY>(['left', 'right']),
}

export default Grid
