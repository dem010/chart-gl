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
  const [chart, setChart] = useState<LinesChart | null>(null)

  const size = useResizeElement(canvas)

  useLayoutEffect(() => {
    if (chartProperties) {
      let ch
      const c = canvas.current
      if (c && !chart && chartProperties.setProp) {
        ch = new LinesChart(c, chartProperties)
        setChart(ch)
      }
    }

    /*return (() => {
      this && this.destroy()
    }).bind(ch)*/
  }, [chart, chartProperties])

  useEffect(() => {
    if (chart && chartProperties && chartProperties.setProp) {
      // const s = series.map((s) => {
      //   s.data = new ChartData(s.data)
      //   return s
      // })
      chart.setSeries(series)
      chartProperties.setProp({ ...chartProperties })
    }
  }, [chart, series]) // eslint-disable-line

  useEffect(() => {
    if (size && chart && chartProperties && chartProperties.setResizeCanvas) {
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
