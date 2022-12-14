import { AxisControl } from '../services/AxisControl'
import Chart from '../services/Chart'
import { ChartData } from '../services/ChartData'
import OverlayCtrl from '../services/OverlayCtrl'

export type RefX = 'top' | 'bottom'
export type RefY = 'left' | 'right'
export type AlignType = 'bottom' | 'top' | 'left' | 'right'
export type AxisTypeType = 'x' | 'y'

export interface PanType {
  clientX: number
  clientY: number
}

export interface Point {
  x: number
  y: number
}

export interface SeriesPoint {
  label?: string
  point: Point
}

export interface Series {
  data: Float32Array
  color: string
  refX?: RefX
  refY?: RefY
  label?: string
}
export interface ChartSeries {
  id: number
  data: ChartData
  color: string
  refX: RefX
  refY: RefY
  label?: string
}

export interface ChartOptions {
  container: React.RefObject<HTMLDivElement>
  axes: AxisControl[]
  areaGrid: {
    topTitle: string
    leftTitle: string
    rightTitle: string
    bottomTitle: string
    topAxis: string
    leftAxis: string
    rightAxis: string
    bottomAxis: string
  }
  series?: ChartSeries[]
  overlay?: OverlayCtrl
}

export interface ChartProperties {
  options: ChartOptions
  chart?: Chart
  setProp?: React.Dispatch<React.SetStateAction<ChartProperties>>
  setResizeCanvas?: React.Dispatch<React.SetStateAction<[number, number]>>
}

export interface AxisOptions {
  domain?: [number, number]
  type: AxisTypeType
  align: AlignType
  style: AxisStyle
  format?: (value: number) => string
}

export interface AxisStyle {
  /** шрифт подписей оси */
  font: string
  /** размер шрифта подписей оси */
  fontSize: number
  /** Цвет оси и подписей*/
  color: string
  /** Расстояние между подписью и делителем оси */
  tickOffset: number
}

export interface AxisParameters {
  chartProperties: ChartProperties
  domain?: [number, number]
  keepDomain: boolean
  type: AxisTypeType
  align: AlignType
  style: AxisStyle
  format?: (value: number) => string
  split?: boolean
}

export interface ITick {
  value: number
  formattedValue: string[]
  metrics: TextMetrics
}
