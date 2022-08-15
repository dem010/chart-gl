import { AxisOptions, AxisParameters, AxisTypeType, ChartOptions, ChartSeries, ITick } from '../types/chart'
import Chart from './Chart'
import Overlay from './Overlay'

/** отступ от границ области графика для оси Y если не задан domain */
export const YAXIS_SPACING = 0.07 //2% от минимального и максимального значения графика //!возможно надо делать от максимума минимума видимой области или параметризовать
export class AxisControl {
  protected ctx: CanvasRenderingContext2D | null = null
  public canvas: HTMLCanvasElement
  /** минимум оси */
  public min: number[] = []
  /** максимум оси */
  public max: number[] = []
  public type: AxisTypeType
  /** максимальная ширина/высота оси в зависимости от размера тика */
  protected maxWidth: number = 100
  /**серии принадлежащие оси. Рисуем только их */
  protected axisSeries: ChartSeries[] = []
  public axisOptions: AxisOptions
  protected chart: Chart | undefined
  protected chartOptions: ChartOptions | undefined
  public ticks: ITick[][] = [[]]

  public scale: number[] = [1]
  public translate: number[] = [0]

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {AxisParameters[]} axisParameters
   */
  constructor(
    canvas: HTMLCanvasElement,
    { align, type, domain, format, chartProperties, split, style }: AxisParameters
  ) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.type = type
    this.axisOptions = { align, type, domain, format, style }
    if (chartProperties.chart) {
      this.chart = chartProperties.chart
      this.chartOptions = this.chart.options
    }
  }

  destroy() {
    this.ctx = null
    this.axisOptions.format = undefined
    //сброс матриц в первоначальное состояние
    this.chart?.axesMatricesCtrl.forEach((mCtrl) => mCtrl.reset(this.type), this.type, this.axisOptions.align)
    this.chart = undefined
    //удаляю ось из оверлея
    this.chartOptions?.overlay?.removeAxis(this)
    //удаляю ось из массива осей графика
    if (this.chartOptions && this.chartOptions.axes.includes(this)) {
      this.chartOptions.axes.splice(this.chartOptions.axes.indexOf(this), 1)
    }
    this.chartOptions = undefined
  }

  /** Задать ширину/высоту оси в зависимости от размеров тиков оси */
  setAxisSize() {
    const gl = this.chart?.getGL()
    if (!this.chartOptions || !this.chart || !gl) return

    const { align } = this.axisOptions
    const { container, areaGrid } = this.chartOptions

    //const {}
    let max = 0
    if (this.type === 'y') {
      this.ticks[0].forEach((tick) => (max = Math.max(max, Math.round(tick.metrics.width))))
      this.canvas.width = max + 10
      this.maxWidth = max + 10 // плюс размер рисок

      if (container.current) {
        if (align === 'left') areaGrid.leftAxis = this.maxWidth + 'px'
        if (align === 'right') areaGrid.rightAxis = this.maxWidth + 'px'
        if (this.canvas.parentElement) this.canvas.parentElement.style.width = this.maxWidth + 'px'
        //this.canvas.width = this.maxWidth
        //this.canvas.parentElement.style.height = gl.canvas.height + 'px'
        this.canvas.height = gl.canvas.height
      }
    }
    if (this.type === 'x') {
      //ищу наибольшее значение с учетом переноса строки
      this.ticks[0].forEach((tick) => {
        const lines = tick.formattedValue.length
        const metrics = tick.metrics
        max = Math.max((metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent) * lines, max)
      })
      this.canvas.height = max + 20
      this.maxWidth = max + 20 // плюс размер рисок

      if (container.current) {
        let leftOffset = parseInt(this.chartOptions.areaGrid.leftAxis)
        leftOffset = isNaN(leftOffset) ? 0 : leftOffset

        if (align === 'top') areaGrid.topAxis = this.maxWidth + 'px'
        if (align === 'bottom') areaGrid.bottomAxis = this.maxWidth + 'px'

        container.current.style.gridTemplateRows = `${areaGrid.topTitle} ${areaGrid.topAxis} auto ${areaGrid.bottomAxis} ${areaGrid.bottomTitle}`
        if (this.canvas.parentElement) this.canvas.parentElement.style.height = this.maxWidth + 'px'
        //this.canvas.height = this.#maxWidth
        //this.canvas.parentElement.style.width = gl.canvas.width
        this.canvas.width = gl.canvas.width + leftOffset
      }
    }
  }

  drawAxis() {
    if (this.type === 'y') this.drawYAxis()
    if (this.type === 'x') this.drawXAxis()
  }

  drawXAxis() {
    const gl = this.chart?.getGL()
    if (!this.chartOptions || !this.chart || !gl) return

    const { align } = this.axisOptions
    let cWidth = gl.canvas.width
    let leftOffset = parseInt(this.chartOptions.areaGrid.leftAxis)
    leftOffset = isNaN(leftOffset) ? 0 : leftOffset

    const ctx = this.ctx
    if (!ctx) return
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.beginPath()
    ctx.moveTo(leftOffset - 1, align === 'bottom' ? 0 : this.maxWidth)
    ctx.lineTo(cWidth + leftOffset + 1, align === 'bottom' ? 0 : this.maxWidth)
    ctx.lineWidth = 1

    ctx.font = this.getFont()
    ctx.textAlign = 'center'

    //! предусмотреть фун-ию формат
    ctx.fillStyle = this.axisOptions.style.color //'#fff'
    this.ticks[0].forEach((tick) => {
      if (tick.value * this.scale[0] - this.min[0] * this.scale[0] + leftOffset > leftOffset - 2) {
        ctx.moveTo(
          tick.value * this.scale[0] - this.min[0] * this.scale[0] + leftOffset + 0.5,
          align === 'bottom' ? 0 : this.maxWidth
        )
        ctx.lineTo(
          tick.value * this.scale[0] - this.min[0] * this.scale[0] + leftOffset + 0.5,
          align === 'bottom' ? 6 : this.maxWidth - 6
        )
        this.drawAxisText(
          ctx,
          tick.formattedValue,
          tick.value * this.scale[0] - this.min[0] * this.scale[0] + leftOffset,
          align === 'bottom'
            ? /*20*/ tick.metrics.fontBoundingBoxAscent +
                tick.metrics.fontBoundingBoxDescent +
                this.axisOptions.style.tickOffset
            : this.maxWidth - 10, //! тут высчитывается в зависимости от размера шрифта (наверно)
          tick.metrics.fontBoundingBoxAscent + tick.metrics.fontBoundingBoxDescent
        )
      }
    })

    ctx.strokeStyle = this.axisOptions.style.color // '#fff'
    ctx.stroke()
  }

  drawYAxis() {}

  drawAxisText(ctx: CanvasRenderingContext2D, text: string[], x: number, y: number, lineHeight: number) {
    for (const [index, line] of text.entries()) {
      ctx.fillText(line, x, y + index * lineHeight)
    }
  }

  resizeCanvasToDisplaySize(multiplier?: number) {
    multiplier = multiplier || 1
    const width = (this.canvas.clientWidth * multiplier) | 0
    const height = (this.canvas.clientHeight * multiplier) | 0

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width
      this.canvas.height = height
      return true
    }
    return false
  }

  format(value: number) {
    const { format } = this.axisOptions
    if (format) return format(value).split('\n')
    return [value.toString()]
  }

  resize(size?: [number, number]) {
    if (size) {
      window.requestAnimationFrame(() => {
        this.resizeCanvasToDisplaySize()
        this.tuneTickGenerator()
        this.drawAxis()
        this.chartOptions?.overlay?.resize(size)
      })
    }
  }

  /**
   * Создать сетку
   * @param {HTMLCanvasElement} canvas канвас
   * @param {string} color цвет сетки
   * @returns
   */
  createGrid(canvas: HTMLCanvasElement, color: string) {
    if (this.chartOptions) {
      const overlay = Overlay.getInstance(canvas, this.chartOptions)
      overlay.addAxis(this)
      overlay.setColor(color)
      this.chartOptions.overlay = overlay
      return overlay
    }
    return null
  }

  tuneTickGenerator() {}

  tickGenerator(min: number, max: number, tickSize: number) {
    const ticks: ITick[] = []
    const start = tickSize * Math.floor(min / tickSize)

    let i = 0,
      prev,
      v = Number.NaN
    do {
      prev = v
      v = start + i * tickSize

      const value = Number(v.toPrecision(12))
      const formattedValue = this.format(value)
      let metrics: TextMetrics | undefined

      formattedValue.forEach((fv) => {
        if (!this.ctx) return
        const m = this.ctx.measureText(fv)
        if (!metrics || metrics.width < m.width) metrics = m
      })

      if (metrics) {
        ticks.push({
          value,
          formattedValue: formattedValue,
          metrics,
        })
      }

      ++i
    } while (v < max && v !== prev)
    return ticks
  }

  /**
   * Запрашивает матрицу для переданной серии данных
   * @param {{}} series серия для которой запрашивается матрица
   */
  getMatrix(series: ChartSeries) {
    if (this.chart) return this.chart.axesMatricesCtrl.series[series.refX + series.refY + series.id]
    return null
  }

  update() {}

  protected getFont() {
    if (this.axisOptions) {
      return `${this.axisOptions.style.fontSize}px ${this.axisOptions.style.font}`
    }
    return '14px calibri, serif'
  }
}
