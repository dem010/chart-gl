import React, { FC, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useResizeElement from '../hooks/resizeElement'
import { ChartContext } from './Area/Area'
import LinesChart from '../services/LinesChart'
import { ChartProperties, Series } from '../types/chart'

export interface LinesProps {
  series: Series[]
  sizeCanvas?: [Number, number]
}

const Lines: FC<LinesProps> = ({ series, sizeCanvas }) => {
  const chartProperties = useContext<ChartProperties | null>(ChartContext)
  const canvas = useRef<HTMLCanvasElement>(null)
  const chart = chartProperties?.chart

  const size = useResizeElement(canvas)

  useEffect(() => {
    if (canvas.current && chartProperties && chartProperties.setProp && !chartProperties.chart) {
      new LinesChart(canvas.current, chartProperties)
    }
  }, [chartProperties])

  useEffect(() => {
    if (chartProperties && chartProperties.setProp && chart) {
      chart.setSeries(series)
      chartProperties.setProp({ ...chartProperties })
    }
  }, [chart, series])

  useEffect(() => {
    if (size && chartProperties && chartProperties.setResizeCanvas && chart) {
      chartProperties.setResizeCanvas(size)
      chart.resize(size)
    }
  }, [chart, size, chartProperties])

  return (
    <>
      <div className="chart-gl-canvas">
        <canvas id="chart-lines" ref={canvas} style={{ width: '100%', height: '100%', position: 'absolute' }}></canvas>
      </div>
    </>
  )
}

export default Lines
