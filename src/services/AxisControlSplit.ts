import { AxisParameters } from '../types/chart'
import { subAlpha } from '../utils/subAlpha'
import { AxisControl, YAXIS_SPACING } from './AxisControl'

export class AxisControlSplit extends AxisControl {
  constructor(canvas: HTMLCanvasElement, { align, type, domain, format, style, chartProperties }: AxisParameters) {
    super(canvas, { align, type, domain, format, style, chartProperties })

    this.chartOptions?.axes.push(this)

    /** минимум по всей серии */
    this.min = []
    /** максимум по всей серии */
    this.max = []

    //this.ticks = []
    this.scale = []
    this.translate = []

    this.setOptionsParameters()

    this.tuneTickGenerator()
    this.resizeCanvasToDisplaySize()

    //переместить и отмасштабировать в зависимости от данных или ограничений осей
    this.setVisibilityArea()
    this.drawAxis()

    chartProperties.setProp && chartProperties.setProp({ ...chartProperties })

    this.disablePan()
  }

  disablePan() {
    const { type, align } = this.axisOptions
    this.chart?.axesMatricesCtrl.forEach((mCtrl) => mCtrl.disable(type, true), type, align)
  }

  setOptionsParameters() {
    const series = this.chartOptions?.series
    const { type, align } = this.axisOptions

    if (!series) return

    this.type = type

    for (let s of series) {
      if (s.refY === align || s.refX === align) {
        this.axisSeries.push(s)
        //! this.ticks.push(0)
        this.min.push(
          this.type === 'x'
            ? s.data.minmaxX.min
            : s.data.minmaxY.min - Math.abs(s.data.minmaxY.max - s.data.minmaxY.min) * YAXIS_SPACING
        )
        this.max.push(
          this.type === 'x'
            ? s.data.minmaxX.max
            : s.data.minmaxY.max + Math.abs(s.data.minmaxY.max - s.data.minmaxY.min) * YAXIS_SPACING
        )
      }
    }
  }

  /** Задать ширину/высоту оси в зависимости от размеров тиков оси */
  setAxisSize() {
    const gl = this.chart?.getGL()
    if (!this.chartOptions || !gl) return

    const { align } = this.axisOptions
    const { container, areaGrid } = this.chartOptions
    //const {}
    let max = 0
    if (this.type === 'y') {
      this.ticks.forEach((ticks) => ticks.forEach((tick) => (max = Math.max(max, Math.round(tick.metrics.width)))))
      this.canvas.width = max + 10
      this.maxWidth = max + 10 // плюс размер рисок

      if (container.current) {
        if (align === 'left') areaGrid.leftAxis = this.maxWidth + 'px'
        if (align === 'right') areaGrid.rightAxis = this.maxWidth + 'px'
        this.canvas.parentElement!.style.width = this.maxWidth + 'px'
        this.canvas.height = gl.canvas.height
      }
    }
    if (this.type === 'x') {
      //ищу наибольшее значение с учетом переноса строки
      this.ticks.forEach((ticks) =>
        ticks.forEach((tick) => {
          const lines = tick.formattedValue.length
          const metrics = tick.metrics
          max = Math.max((metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent) * lines, max)
        })
      )
      this.canvas.height = max + 20
      this.maxWidth = max + 20 // плюс размер рисок

      if (container.current) {
        let leftOffset = parseInt(this.chartOptions.areaGrid.leftAxis)
        leftOffset = isNaN(leftOffset) ? 0 : leftOffset

        if (align === 'top') areaGrid.topAxis = this.maxWidth + 'px'
        if (align === 'bottom') areaGrid.bottomAxis = this.maxWidth + 'px'

        container.current.style.gridTemplateRows = `${areaGrid.topTitle} ${areaGrid.topAxis} auto ${areaGrid.bottomAxis} ${areaGrid.bottomTitle}`
        this.canvas.parentElement!.style.height = this.maxWidth + 'px'
        this.canvas.width = gl.canvas.width + leftOffset
      }
    }
  }

  /** настройка генератора тиков. получение количества тиков */
  tuneTickGenerator() {
    // prettier-ignore
    const { type, canvas} = this
    const maxDec = 3
    const width = canvas.width / this.axisSeries.length
    const height = canvas.height / this.axisSeries.length

    /** кол-во тиков */
    const countTicks = 0.3 * Math.sqrt(type === 'x' ? width : height)

    for (let [i, series] of this.axisSeries.entries()) {
      const mCtrl = this.getMatrix(series)
      //* пока split не применяется для X
      const min = mCtrl?.minY || this.min[i]
      const max = mCtrl?.maxY || this.max[i]

      /** расстояние между тиками */
      const delta = (max - min) / countTicks
      /** знаков после запятой до 1 цифры > 0/до запятой(если больше 0) */
      let decPlaces = -Math.floor(Math.log(delta) / Math.LN10)

      const magn = Math.pow(10, -decPlaces)
      const norm = delta / magn
      let size

      if (norm < 1.5) {
        size = 1
      } else if (norm < 3) {
        size = 2
        if (norm > 2.25 && (maxDec == null || decPlaces + 1 <= maxDec)) {
          size = 2.5
          ++decPlaces
        }
      } else if (norm < 7.5) {
        size = 5
      } else {
        size = 10
      }

      size *= magn

      this.ticks[i] = this.tickGenerator(min, max, size)
    }
    this.setAxisSize()
  }

  update() {
    const { type } = this
    for (let [i, series] of this.axisSeries.entries()) {
      const mCtrl = this.getMatrix(series)
      if (!mCtrl) continue
      let { translateY, scaleX, scaleY, minY, maxY, originY } = mCtrl.getTransformData()
      if (scaleX && type === 'x') this.scale[i] = scaleX
      if (scaleY && type === 'y') {
        this.scale[i] = scaleY
        this.translate[i] = translateY + originY
        this.min[i] = minY
        this.max[i] = maxY
      }
    }
    window.requestAnimationFrame(() => {
      this.tuneTickGenerator()
      this.drawAxis()
      this.chartOptions?.overlay?.update()
    })
  }

  /** Спозиционировать график в зависимости от заданного/не заданного domain */
  setVisibilityArea() {
    const gl = this.chart?.getGL()
    if (!gl) return

    let cHeight = gl.canvas.height
    cHeight = cHeight / this.axisSeries.length

    this.axisSeries.forEach((series, i) => {
      let scaleX, scaleY, translateX, translateY
      if (this.type === 'y') {
        this.scale[i] = scaleY = cHeight / (this.max[i] - this.min[i])
        this.translate[i] = translateY =
          (-(this.max[i] - this.min[i]) / 2 - this.min[i]) * scaleY +
          cHeight * (this.axisSeries.length / 2) +
          cHeight / 2 -
          cHeight * (i + 1)
      }
      let mCtrl = this.getMatrix(series)
      if (mCtrl) {
        mCtrl.scale(scaleX, scaleY, 0, 0)
        mCtrl.translate(translateX, translateY)
        mCtrl.setAxisSeries(this.axisSeries, i)
        mCtrl.setAutoScaleY(true)
        mCtrl.recalculateMinMax()
      }
    })
  }

  drawYAxis() {
    const gl = this.chart?.getGL()
    const ctx = this.ctx
    if (!gl || !ctx) return

    const { align } = this.axisOptions
    let cHeight = gl.canvas.height
    //размер оси каждой серии
    cHeight = cHeight / this.axisSeries.length

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    //рисую фон
    for (let [i] of this.axisSeries.entries()) {
      ctx.fillStyle = i % 2 ? '#00000022' : '#00000000'
      ctx.fillRect(0, cHeight * i, this.maxWidth, cHeight)
    }

    //отрисовываю ось для каждой серии
    for (let [i] of this.axisSeries.entries()) {
      ctx.beginPath()
      ctx.fillStyle = i % 2 ? this.axisOptions.style.color : subAlpha(this.axisOptions.style.color, 0.2) //'#fff' : '#ddd'
      ctx.lineWidth = i % 2 ? 2 : 1

      ctx.moveTo(align === 'left' ? this.maxWidth - 0.5 : 0, cHeight * i)
      ctx.lineTo(align === 'left' ? this.maxWidth - 0.5 : 0, cHeight * i + cHeight)

      ctx.font = this.getFont()
      ctx.textAlign = align === 'left' ? 'end' : 'start'

      this.ticks[i].forEach((tick) => {
        const lines = tick.formattedValue.length

        const y = gl.canvas.height / 2 - this.translate[i] - tick.value * this.scale[i]

        if (
          ((y > cHeight * i && !i) || y > cHeight * i + tick.metrics.fontBoundingBoxAscent) &&
          y < cHeight * i + cHeight
        ) {
          ctx.moveTo(align === 'left' ? this.maxWidth : 0, y - 0.5)
          ctx.lineTo(align === 'left' ? this.maxWidth - 6 : 6, y - 0.5)
          this.drawAxisText(
            ctx,
            tick.formattedValue,
            align === 'left'
              ? this.maxWidth - 6 - this.axisOptions.style.tickOffset
              : 6 + this.axisOptions.style.tickOffset,
            y + ((tick.metrics.fontBoundingBoxAscent - tick.metrics.fontBoundingBoxDescent) / 2) * lines,
            tick.metrics.fontBoundingBoxAscent + tick.metrics.fontBoundingBoxDescent
          )
        }
      })
      ctx.strokeStyle = i % 2 ? this.axisOptions.style.color : subAlpha(this.axisOptions.style.color, 0.2) //'#fff' : '#aaa'
      ctx.stroke()
    }
  }
}
