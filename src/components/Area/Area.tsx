import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { ChartProperties } from '../../types/chart'
import './area.css'

//const NOP_ELEMENT = ({ className }) => <div className={className}></div>
export const ChartContext = React.createContext<ChartProperties | null>(null)
//export const ChangeChartContext = React.createContext(null)

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

  /*const getChildren = () => {
    const aChildren = children.constructor.name === 'Array' ? children : [children]
    const axes = aChildren.filter((child) => child.type.name === 'Axis')
    axes.forEach((a) => {
      //a.props.sizeCanvas = sizeCanvas
      a.props = { ...a.props, sizeCanvas }
    })
  }*/
  const childrenWithProps = React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...child.props, sizeCanvas })
    }
    return child
  })

  /*console.log('children:', children)

  const getChildren = () => {
    const ret = [children]
    const aChildren = children.constructor.name === 'Array' ? children : [children]

    const titles = aChildren.filter((child) => child.type.name === 'Title')
    const aligns = ['top', 'left', 'right', 'bottom']
    for (let i = 0; i < titles.length; i++) {
      if (aligns.includes(titles[i].props.align)) aligns.splice(aligns.indexOf(titles[i].props.align), 1)
    }
    aligns.forEach((align, k) => {
      ret.push(<NOP_ELEMENT key={'empty-title-' + k} className={`chart-${align}-title empty`} />)
    })

    return ret
  }*/

  //return <div className="chart-container">{getChildren()}</div>
  return (
    <ChartContext.Provider value={chartProperties}>
      <div ref={container} className="chart-container">
        {childrenWithProps}
      </div>
    </ChartContext.Provider>
  )
}

export default Area
