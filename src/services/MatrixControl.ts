import { AxisTypeType, ChartSeries, Point, SeriesPoint } from '../types/chart'
import M4, { Matrix4 } from '../utils/m4'
import { bSearchX } from '../utils/utils'
import { YAXIS_SPACING } from './AxisControl'
import Chart from './Chart'
import { ChartData } from './ChartData'

export default class MatrixControl {
  m4 = M4

  private gl: WebGLRenderingContext | null = null

  private translationMatrix: Matrix4 = this.m4.translation(0, 0, 0)
  private scaleMatrix: Matrix4 = this.m4.scaling(1, 1, 1)
  private matrix: Matrix4 | null = null
  private scaleX = 1
  private scaleY = 1
  private translateX = 0
  private translateY = 0

  private xDisabled = false
  private yDisabled = false

  //минимум отрисованного участка по оси Y
  public minY: number | null = null
  //максимум отрисованного участка по оси Y
  public maxY: number | null = null

  private autoYScale = false
  protected axisSeries: ChartSeries[] | null = null
  protected num: number = -1

  constructor(public name: string, public chart: Chart, public data: ChartData, public label?: string) {
    this.gl = chart.gl
  }

  private resetY() {
    this.minY = null
    this.maxY = null
    this.translateY = 0
    this.scaleY = 1
    this.scaleMatrix[5] = 1
    this.scaleMatrix[13] = 0
    this.translationMatrix[13] = 0
    this.autoYScale = false
  }

  private resetX() {
    this.translateX = 0
    this.scaleX = 1
    this.translationMatrix[12] = 0
    this.scaleMatrix[12] = 0
  }

  /**
   * Сбросить матрицы по заданной оси или по обоим
   * @param type тип оси
   */
  reset(type: AxisTypeType | 'all' | undefined) {
    switch (type) {
      case 'x':
        this.resetX()
        break
      case 'y':
        this.resetY()
        break
      default:
        this.resetX()
        this.resetY()
    }
  }

  multiply(projectionMatrix: Matrix4) {
    const { m4, translationMatrix, scaleMatrix } = this
    this.matrix = m4.multiply(projectionMatrix, translationMatrix)
    this.matrix = m4.multiply(this.matrix, scaleMatrix)
    return this.matrix
  }

  getMatrix() {
    return this.matrix
  }

  getTransformData() {
    return {
      translateX: this.translationMatrix[12],
      translateY: this.translationMatrix[13],
      scaleX: this.scaleMatrix[0],
      scaleY: this.scaleMatrix[5],
      originX: this.scaleMatrix[12],
      originY: this.scaleMatrix[13],
      minY: this.minY || 0,
      maxY: this.maxY || 0,
    }
  }
  /** прекращаю движение */
  stopmove(trX: number, trY: number) {
    trX = this.xDisabled ? 0 : trX
    trY = this.yDisabled ? 0 : trY
    const { chart, m4 } = this
    if (trX) this.translateX = this.translateX + trX
    if (trY) this.translateY = this.translateY - trY
    this.translationMatrix = m4.translation(this.translateX, this.translateY, 0)
    window.requestAnimationFrame(chart.drawSeries.bind(chart))
  }

  /** движение графика */
  move(trX: number, trY: number) {
    trX = this.xDisabled ? 0 : trX
    trY = this.yDisabled ? 0 : trY
    const { chart, m4, translateX, translateY } = this
    this.translationMatrix = m4.translation(translateX + trX, translateY - trY, 0)

    this.autoYScale && this.recalculateMinMax()

    window.requestAnimationFrame(() => {
      chart.drawSeries.bind(chart)()
    })
  }

  translate(trX: number | undefined, trY: number | undefined) {
    const { chart, m4 } = this
    if (trX) this.translateX = trX
    if (trY) this.translateY = trY
    this.translationMatrix = m4.translation(this.translateX, this.translateY, 0)
    window.requestAnimationFrame(chart.drawSeries.bind(chart))
  }

  resize(scX: number, scY: number) {
    this.scale(scX * this.scaleX, scY * this.scaleY, 0, 0, false)
  }

  scale(sclX: number | undefined, sclY: number | undefined, originX: number, originY: number, draw?: boolean) {
    const { chart, m4, translateX, translateY } = this

    if (typeof draw === 'undefined') draw = true
    const inv = m4.inverse(this.scaleMatrix)
    const tOrigin = m4.transformPoint(inv, [originX - translateX, -1 * (originY + translateY), 0])

    if (sclX) this.scaleX = sclX
    if (sclY) this.scaleY = sclY

    this.scaleMatrix = m4.translate(this.scaleMatrix, tOrigin[0], tOrigin[1], 0)
    this.scaleMatrix[0] = this.scaleX
    this.scaleMatrix[5] = this.scaleY
    this.scaleMatrix = m4.translate(this.scaleMatrix, -tOrigin[0], -tOrigin[1], 0)
    draw && window.requestAnimationFrame(chart.drawSeries.bind(chart))
  }

  zoomIn(coefX: number, coefY: number, originX: number, originY: number) {
    if (!this.gl) return

    const cHeight = this.gl.canvas.height / (this.axisSeries?.length || 1)
    coefX = this.xDisabled ? 0 : coefX
    coefY = this.yDisabled ? 0 : coefY
    originX = this.xDisabled ? 0 : originX
    //originY = this.yDisabled ? 0 : originY
    originY = this.yDisabled ? -this.gl.canvas.height / 2 + cHeight / 2 : originY

    this.scaleX = this.scaleX + this.scaleX * coefX
    this.scaleY = this.scaleY + this.scaleY * coefY

    this.autoYScale && this.recalculateMinMax()
    this.scale(this.scaleX, this.scaleY, originX, originY)
  }

  zoomOut(coefX: number, coefY: number, originX: number, originY: number) {
    if (!this.gl) return

    const cHeight = this.gl.canvas.height / (this.axisSeries?.length || 1)
    coefX = this.xDisabled ? 0 : coefX
    coefY = this.yDisabled ? 0 : coefY
    originX = this.xDisabled ? 0 : originX
    //originY = this.yDisabled ? 0 : originY
    originY = this.yDisabled ? -this.gl.canvas.height / 2 + cHeight / 2 : originY

    this.scaleX = this.scaleX - this.scaleX * coefX
    this.scaleY = this.scaleY - this.scaleY * coefY

    this.scale(this.scaleX, this.scaleY, originX, originY)
    this.autoYScale && this.recalculateMinMax()
  }

  /** тач скалирование по оси X */
  touchScale(zoom: number, originX: number, trX: number) {
    this.scaleX = this.scaleX * zoom
    this.scale(this.scaleX, this.scaleY, originX, 0, false)
    this.move(trX, 0)
  }

  disable(type: AxisTypeType, set: boolean) {
    if (type === 'x') this.xDisabled = set
    else this.yDisabled = set
  }

  setAutoScaleY(set: boolean) {
    this.autoYScale = set
  }

  setAxisSeries(axisSeries: ChartSeries[], num: number) {
    this.axisSeries = axisSeries
    this.num = num
  }

  //выровнять видимое значение графика по оси Y
  recalculateMinMax() {
    if (!this.gl) return
    // получить начало и конец интервала оси по которой идет движение
    //! для оси X
    let min = -this.translationMatrix[12] / this.scaleMatrix[0] - this.scaleMatrix[12] / this.scaleMatrix[0]
    let max = min + this.gl.canvas.width / this.scaleMatrix[0]

    //* нужны ближайшие точки вышедшие за границу обзора (иначе выходит за границы своей области)
    let index1 = bSearchX(min, this.data.data)
    let index2 = bSearchX(max, this.data.data)

    //index1 = index1 - 2 < 1 ? 1 : index1 - 1
    index1 = index1 - 2 < 1 ? 1 : index1 - 3
    index2 = index2 + 2 > this.data.data.length ? this.data.data.length - 1 : index2 + 1
    let plotMin = this.data.data[index1]
    let plotMax = this.data.data[index1]
    //ищу максимум и минимум
    for (let index = index1 + 2; index <= index2; index += 2) {
      plotMin = Math.min(plotMin, this.data.data[index])
      plotMax = Math.max(plotMax, this.data.data[index])
    }

    plotMin = plotMin - Math.abs(plotMax - plotMin) * YAXIS_SPACING
    plotMax = plotMax + Math.abs(plotMax - plotMin) * YAXIS_SPACING

    if (this.axisSeries) {
      const cHeight = this.gl.canvas.height / this.axisSeries.length
      //если максимум или минимум изменился изменяю scaleY и подстраиваю по translateY
      if (plotMin !== this.minY || plotMax !== this.maxY) {
        this.minY = plotMin
        this.maxY = plotMax

        //! только для splitted
        this.scaleMatrix[5] = this.scaleY = cHeight / (this.maxY - this.minY)

        this.translationMatrix[13] = this.translateY =
          (-(this.maxY - this.minY) / 2 - this.minY) * this.scaleY +
          cHeight * (this.axisSeries.length / 2) +
          cHeight / 2 -
          cHeight * (this.num + 1)
      }
    }
  }

  /**
   * Преобразовать координаты canvas в координаты серии которая принадлежит к данной MatrixControl
   * @param pointX точка x относительно canvas
   * @param pointY точка y относительно canvas
   * @returns координаты относительно серии
   */
  convertClientPtToSeriesPt(pointX: number, pointY: number) {
    const x =
      -this.translationMatrix[12] / this.scaleMatrix[0] -
      this.scaleMatrix[12] / this.scaleMatrix[0] +
      pointX / this.scaleMatrix[0]
    const y =
      -this.translationMatrix[13] / this.scaleMatrix[5] -
      this.scaleMatrix[13] / this.scaleMatrix[5] -
      pointY / this.scaleMatrix[5] +
      (this.chart.canvas.height * 0.5) / this.scaleMatrix[5]
    return { x, y }
  }

  getClientDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow((x2 - x1) * this.scaleMatrix[0], 2) + Math.pow((y2 - y1) * this.scaleMatrix[5], 2))
  }

  //! ищу ближайшие точки
  searchNearbyPoint(pointX: number, pointY: number, radius: number): SeriesPoint | undefined {
    //! для оси X
    /** Положение мыши по оси X переведенное в координаты графика */
    const { x, y } = this.convertClientPtToSeriesPt(pointX, pointY)
    //поиск ближайших точек к x и y
    let index = bSearchX(x, this.data.data)
    //index = index - 2 < 1 ? 1 : index - 3
    let nearestPoint = { x: this.data.data[index], y: this.data.data[index + 1] }
    let nextNearestPoint =
      index + 2 < this.data.data.length ? { x: this.data.data[index + 2], y: this.data.data[index + 3] } : null
    let prevNearestPoint = index - 2 > -1 ? { x: this.data.data[index - 2], y: this.data.data[index - 1] } : null

    let resNearestPoint: Point = nearestPoint

    let distance = this.getClientDistance(nearestPoint.x, nearestPoint.y, x, y)
    let nextDistance: number | null = null
    let prevDistance: number | null = null
    if (nextNearestPoint) {
      nextDistance = this.getClientDistance(nextNearestPoint.x, nextNearestPoint.y, x, y)
      if (nextDistance < distance) {
        distance = nextDistance
        resNearestPoint = nextNearestPoint
      }
    }
    if (prevNearestPoint) {
      prevDistance = this.getClientDistance(prevNearestPoint.x, prevNearestPoint.y, x, y)
      if (prevDistance < distance) {
        distance = prevDistance
        resNearestPoint = prevNearestPoint
      }
    }
    return distance < radius ? { point: resNearestPoint, label: this.label } : undefined
  }
}
