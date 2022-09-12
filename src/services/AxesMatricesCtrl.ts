import { AlignType, AxisTypeType, ChartSeries } from '../types/chart'
import Chart from './Chart'
import MatrixControl from './MatrixControl'

export interface IXAxesMC {
  top: MatrixControl[]
  bottom: MatrixControl[]
}
export interface IYAxesMC {
  left: MatrixControl[]
  right: MatrixControl[]
}
export interface INamedMC {
  [key: string]: MatrixControl
}

export default class AxesMatricesCtrl {
  private chart: Chart
  private all: MatrixControl[] = []
  private yAxes: IYAxesMC = { left: [], right: [] }
  private xAxes: IXAxesMC = { top: [], bottom: [] }
  series: INamedMC = {}

  private memAll: MatrixControl[] = []

  constructor(chart: Chart) {
    this.chart = chart
  }

  add({ refX, refY, id, data, label }: ChartSeries) {
    const mCtrl = new MatrixControl(refX + refY + id, refX + refY, this.chart, data, label)
    this.series[refX + refY + id] = mCtrl
    this.yAxes[refY].push(mCtrl)
    this.xAxes[refX].push(mCtrl)
    this.all.push(mCtrl)
  }

  forEach(
    cb: (value: MatrixControl, index: number, array: MatrixControl[]) => void,
    type?: AxisTypeType,
    align?: AlignType
  ) {
    if (typeof type === 'undefined') this.all.forEach(cb)
    else {
      if (type === 'x' && (align === 'top' || align === 'bottom')) this.xAxes[align].forEach(cb)
      if (type === 'y' && (align === 'left' || align === 'right')) this.yAxes[align].forEach(cb)
    }
  }

  getOneAxis(type: AxisTypeType, align: AlignType) {
    if (type === 'x' && (align === 'top' || align === 'bottom')) return this.xAxes[align][0]
    if (type === 'y' && (align === 'left' || align === 'right')) return this.yAxes[align][0]
    return null
  }

  //TODO: достаточно ли удаление всех матриц или при смене серий еще что-то требуется
  /** Удалить все матрицы */
  clear() {
    this.all = []
    this.yAxes = { left: [], right: [] }
    this.xAxes = { top: [], bottom: [] }
    this.series = {}
  }

  save() {
    this.memAll = this.all
  }
  clearMem() {
    this.memAll = []
  }
}
