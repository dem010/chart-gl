import React, { FC, PropsWithChildren, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ChartContext } from '../Area/Area'
import './title.css'
import { AlignType } from '../../types/chart'

export interface TitleProps {
  className?: string
  align: AlignType
  style: React.CSSProperties | undefined
}

const Title: FC<PropsWithChildren<TitleProps>> = ({ className, align, children, style }) => {
  const chartProperties = useContext(ChartContext)

  useEffect(() => {
    if (chartProperties) {
      chartProperties.options.areaGrid[`${align}Title`] = 'max-content'
    }
  }, [align])

  return (
    <div className={(className ? className + ' ' : '') + `chart-${align}-title`} style={style ? style : {}}>
      {children}
    </div>
  )
}

Title.propTypes = {
  align: PropTypes.oneOf<AlignType>(['top', 'left', 'bottom', 'right']).isRequired,
}

export default Title
