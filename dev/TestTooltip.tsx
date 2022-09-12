import React from 'react'
import { useFindNearestPoint } from '../src/'
import { SeriesPoint } from '../src/types/chart'

const TestTooltip = () => {
  const { buttons, mousepoint, nearestPoint } = useFindNearestPoint(10)

  const getNearestPoint = (name: string, nearestPoint?: SeriesPoint) => {
    if (nearestPoint)
      return (
        <div key={name}>
          <div>{nearestPoint.label}</div>
          <div>
            <span>X:&nbsp;</span>
            <span>{Number(nearestPoint.point.x.toFixed(3))}</span>
          </div>
          <div>
            <span>Y:&nbsp;</span>
            <span>{Number(nearestPoint.point.y.toFixed(3))}</span>
          </div>
        </div>
      )
    return null
  }

  const getTooltipText = () => {
    const result: JSX.Element[] = []
    for (let name in nearestPoint) {
      const nPoint = getNearestPoint(name, nearestPoint[name])
      nPoint && result.push(nPoint)
    }
    return result
  }

  if (buttons !== 1 && nearestPoint)
    return (
      <div
        style={{
          position: 'absolute',
          top: mousepoint.y - 10,
          left: mousepoint.x + 20 + 100 > window.innerWidth ? mousepoint.x - 100 : mousepoint.x + 20,
          padding: 8,
          background: '#fff',
          zIndex: 1,
        }}
      >
        {getTooltipText()}
      </div>
    )

  return null
}

export default TestTooltip
