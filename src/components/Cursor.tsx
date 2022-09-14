import React, { FC, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ChartContext } from './Area/Area'
import { AxisControl } from '../services/AxisControl'
import CursorCtrl from '../services/CursorCtrl'
import { RefX, RefY } from '../types/chart'

interface CursorProps {
  enabled?: boolean
  color?: string
  /** указание к какой оси привязать курсор, при наведении мыши на область графика */
  ref?: RefX | RefY
  bottom_formatter?: (val: number) => string | number
  top_formatter?: (val: number) => string | number
  left_formatter?: (val: number) => string | number
  right_formatter?: (val: number) => string | number
}

const Cursor: FC<CursorProps> = ({
  enabled = true,
  color = '#fff',
  ref = 'bottom',
  bottom_formatter = (val: number) => val,
}) => {
  const chartProperties = useContext(ChartContext)
  const [cursor, setCursor] = useState<CursorCtrl | null>(null)

  useEffect(() => {
    let cr: CursorCtrl
    if (chartProperties && chartProperties.chart && chartProperties.options.axes.length) {
      cr = new CursorCtrl(chartProperties.chart.canvas, color, ref, bottom_formatter)
      setCursor(cr)
    }
    return () => {
      cr?.destroy()
      setCursor(null)
    }
  }, [chartProperties, color, ref])

  useEffect(() => {
    //меняю массив осей, каждый раз когда меняется chartProperties
    if (chartProperties && chartProperties.chart && chartProperties.options.axes.length && cursor) {
      let axes: AxisControl[] = []
      chartProperties.options.axes.forEach((axis) => {
        axes.push(axis)
      })
      cursor.setAxes(axes)
    }
  }, [chartProperties, cursor])

  useEffect(() => {
    cursor?.setEnabled(enabled)
  }, [enabled, cursor])

  return null
}

Cursor.propTypes = {
  enabled: PropTypes.bool,
  color: PropTypes.string,
  ref: PropTypes.oneOf<RefY | RefX>(['left', 'right', 'bottom', 'top']),
  bottom_formatter: PropTypes.func,
  top_formatter: PropTypes.func,
  left_formatter: PropTypes.func,
  right_formatter: PropTypes.func,
}

export default Cursor
