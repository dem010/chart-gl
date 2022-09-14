import React, { FC, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ChartContext } from './Area/Area'
import { RefX, RefY } from '../types/chart'
import GridCtrl from '../services/GridCtrl'
import { AxisControl } from '../services/AxisControl'

interface GridProps {
  color?: string
  refX?: RefX
  refY?: RefY
}

const Grid: FC<GridProps> = ({ color = '#555', refX = 'bottom', refY = 'left' }) => {
  const chartProperties = useContext(ChartContext)
  const [grid, setGrid] = useState<GridCtrl | null>(null)

  useEffect(() => {
    let gr: GridCtrl
    if (chartProperties && chartProperties.chart && chartProperties.options.axes.length) {
      gr = new GridCtrl(color)
      setGrid(gr)
    }

    return () => {
      gr?.destroy()
      setGrid(null)
    }
  }, [chartProperties, color, refX, refY])

  useEffect(() => {
    //меняю массив осей, каждый раз когда меняется chartProperties
    if (chartProperties && chartProperties.chart && chartProperties.options.axes.length && grid) {
      let axes: AxisControl[] = []
      chartProperties.options.axes.forEach((axis) => {
        if (axis.axisOptions.align === refY || axis.axisOptions.align === refX) axes.push(axis)
      })
      grid.setAxes(axes)
    }
  }, [chartProperties, grid])

  return null
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
