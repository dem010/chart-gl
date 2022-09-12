import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ChartContext } from './Area/Area'
import { RefX, RefY } from '../types/chart'
import Overlay from '../services/Overlay'

export interface OverlayComponentProps {
  gridColor?: string
  gridRefX?: RefX
  gridRefY?: RefY
  cursor?: boolean
  cursorColor?: string
  cursorRef?: RefX | RefY
}

const OverlayComponent: FC<OverlayComponentProps> = ({
  gridColor = '#555',
  gridRefY = 'left',
  gridRefX = 'bottom',
  cursor = false,
  cursorColor = '#fff',
  cursorRef = 'bottom',
}) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const chartProperties = useContext(ChartContext)

  const [overlay, setOverlay] = useState<Overlay | null>(null)

  useEffect(() => {
    if (canvas.current && chartProperties && chartProperties.options.axes.length && chartProperties.chart) {
      let overlay: Overlay | null | undefined
      chartProperties.options.axes.forEach((axis) => {
        if (canvas.current && (axis.axisOptions.align === gridRefY || axis.axisOptions.align === gridRefX))
          overlay = axis.createGrid(canvas.current, gridColor)
      })

      chartProperties.chart.setCursor(canvas.current, cursor, cursorColor, cursorRef)
      overlay && setOverlay(overlay)
    }
  }, [canvas, chartProperties, gridColor, cursor])

  useEffect(() => {
    if (overlay && chartProperties && chartProperties.setProp) chartProperties.setProp((prev) => ({ ...prev }))
  }, [overlay])

  return (
    <div className="chart-overlay-canvas">
      <canvas ref={canvas} id="chart-overlay" style={{ width: '100%', height: '100%', position: 'absolute' }} />
    </div>
  )
}

OverlayComponent.defaultProps = {
  gridColor: '#555',
  gridRefY: 'left',
  gridRefX: 'bottom',
  cursor: false,
  cursorColor: '#fff',
  cursorRef: 'bottom',
}

OverlayComponent.propTypes = {
  gridColor: PropTypes.string,
  gridRefX: PropTypes.oneOf<RefX>(['bottom', 'top']),
  gridRefY: PropTypes.oneOf<RefY>(['left', 'right']),
  cursor: PropTypes.bool,
  cursorColor: PropTypes.string,
  cursorRef: PropTypes.oneOf<RefY | RefX>(['left', 'right', 'bottom', 'top']),
}

export default OverlayComponent
