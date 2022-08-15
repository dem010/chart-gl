import React, { useContext, useEffect, useState } from 'react'
import { ChartContext } from '../components/Area/Area'
import { ChartProperties, Point, SeriesPoint } from '../types/chart'

export interface IFindNearby {
  mousepoint: Point
  nearestPoint?: { [key: string]: SeriesPoint }
}

/**
 * Возвращает координаты мыши (pageX и pageY) и если в заданном радиусе присутствуют точки графика, то и их тоже
 * @param radius радиус поиска вокруг курсора в пикселях
 * @returns - { mousepoint: Point, nearestPoint?: { [name: string]: Point }
}
 */
export function useFindNearestPoint(radius: number) {
  const chartProperties = useContext<ChartProperties | null>(ChartContext)
  const chart = chartProperties && chartProperties.chart
  const [nearestPoint, setNearestPoint] = useState<IFindNearby>({ mousepoint: { x: 0, y: 0 } })

  const handlerMouseMove = (event: MouseEvent) => {
    const offset = chart?.canvas.getBoundingClientRect()
    if (offset) {
      const mousepoint = { x: event.pageX, y: event.pageY }

      const result: { [key: string]: SeriesPoint } = {}
      chart?.axesMatricesCtrl.forEach((mCtrl) => {
        const res = mCtrl.searchNearbyPoint(mousepoint.x - offset.left, mousepoint.y - offset.top, radius)
        if (res) result[mCtrl.name] = res
      })
      if (Object.keys(result).length) setNearestPoint({ mousepoint, nearestPoint: result })
      else setNearestPoint({ mousepoint })
    }
  }

  useEffect(() => {
    if (chart) {
      chart.canvas.addEventListener<'mousemove'>('mousemove', handlerMouseMove)
    }

    return () => {
      chart && chart.canvas.removeEventListener('mousemove', handlerMouseMove)
    }
  }, [chart])

  return nearestPoint
}
