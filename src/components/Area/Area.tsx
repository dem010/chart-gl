import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { ChartProperties } from '../../types/chart'
import './area.css'

export const ChartContext = React.createContext<ChartProperties | null>(null)

const Area: FC<PropsWithChildren> = ({ children }) => {
  const container = useRef<HTMLDivElement>(null)
  const [chartProperties, setProp] = useState<ChartProperties>({
    options: {
      container,
      axes: [],
      areaGrid: {
        topTitle: 'minmax(0, max-content)',
        leftTitle: 'minmax(0, max-content)',
        rightTitle: 'minmax(0, max-content)',
        bottomTitle: 'minmax(0, max-content)',
        topAxis: 'minmax(0, max-content)',
        leftAxis: 'minmax(0, max-content)',
        rightAxis: 'minmax(0, max-content)',
        bottomAxis: 'minmax(0, max-content)',
      },
    },
  })
  const [sizeCanvas, setResizeCanvas] = useState<[number, number] | null>(null)

  useEffect(() => {
    setProp((prev) => ({ ...prev, setProp, setResizeCanvas }))
  }, [])

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...child.props, sizeCanvas })
    }
    return child
  })

  return (
    <ChartContext.Provider value={chartProperties}>
      <div ref={container} className="chart-container">
        {childrenWithProps}
      </div>
    </ChartContext.Provider>
  )
}

export default Area
