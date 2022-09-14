import React, { FC, ReactNode, useContext, useEffect, useRef } from 'react'
import { ChartContext } from './Area/Area'
import OverlayCtrl from '../services/OverlayCtrl'

export interface OverlayProps {
  children?: ReactNode
}

const Overlay: FC<OverlayProps> = ({ children }) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const chartProperties = useContext(ChartContext)

  useEffect(() => {
    if (
      chartProperties &&
      chartProperties.chart &&
      !chartProperties.chart.options.overlay &&
      canvas.current &&
      chartProperties.setProp
    ) {
      chartProperties.chart.options.overlay = OverlayCtrl.getInstance()
      chartProperties.chart.options.overlay.setCanvas(canvas.current)
      chartProperties.setProp({ ...chartProperties })
    }
  }, [chartProperties])

  return (
    <div className="chart-overlay-canvas">
      <canvas ref={canvas} id="chart-overlay" style={{ width: '100%', height: '100%', position: 'absolute' }} />
      {children}
    </div>
  )
}

export default Overlay
