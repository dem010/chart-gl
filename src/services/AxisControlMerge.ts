import { AxisParameters } from '../types/chart'
import { AxisControl, YAXIS_SPACING } from './AxisControl'
import PanScaleAxis from './PanScaleAxis'

/** отступ от границ области графика для оси Y если не задан domain */
export class AxisControlMerge extends AxisControl {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {[]} series
   */
  constructor(
    canvas: HTMLCanvasElement,
    { align, type, domain, keepDomain, format, style, chartProperties }: AxisParameters
  ) {
    super(canvas, { align, type, domain, keepDomain, format, style, chartProperties })

    this.chartOptions?.axes.push(this)
    this.setOptionsParameters()

    this.tuneTickGenerator()
    this.resizeCanvasToDisplaySize()

    //переместить и отмасштабировать в зависимости от данных или ограничений осей
    this.setVisibilityArea()
    this.drawAxis()

    //Обработка событий
    this.chart && new PanScaleAxis(this, this.chart)

    chartProperties.setProp && chartProperties.setProp({ ...chartProperties })

    this.enablePan()
  }

  enablePan() {
    const { type, align } = this.axisOptions
    this.chart?.axesMatricesCtrl.forEach((mCtrl) => mCtrl.disable(type, false), type, align)
  }

  setOptionsParameters() {
    const series = this.chartOptions?.series
    if (!series) return
    const { domain, type, align } = this.axisOptions

    let minX = series[0].data.minmaxX.min
    let maxX = series[0].data.minmaxX.max
    let minY = series[0].data.minmaxY.min
    let maxY = series[0].data.minmaxY.max

    if (series.length > 1) {
      for (let s of series) {
        if (s.refY === align || s.refX === align) {
          minX = Math.min(s.data.minmaxX.min, minX)
          minY = Math.min(s.data.minmaxY.min, minY)
          maxX = Math.max(s.data.minmaxX.max, maxX)
          maxY = Math.max(s.data.minmaxY.max, maxY)
        }
      }
    }
    if (type === 'x') {
      this.min = [domain ? domain[0] : minX]
      this.max = [domain ? domain[1] : maxX]
    }
    if (type === 'y') {
      this.min = [domain ? domain[0] : minY - Math.abs(maxY - minY) * YAXIS_SPACING]
      this.max = [domain ? domain[1] : maxY + Math.abs(maxY - minY) * YAXIS_SPACING]
    }
  }

  /** Спозиционировать график в зависимости от заданного/не заданного domain */
  setVisibilityArea() {
    const gl = this.chart?.getGL()
    if (!this.chart || !gl) return

    let cWidth = gl.canvas.width
    let cHeight = gl.canvas.height

    let scaleX: number, scaleY: number, translateX: number, translateY: number
    if (this.type === 'x') {
      scaleX = cWidth / (this.max[0] - this.min[0])
      this.scale = [scaleX]
      translateX = -this.min[0] + (this.min[0] / this.scale[0] - this.min[0]) * scaleX
    }
    if (this.type === 'y') {
      //min-dmin-(dmax-dmin-(max-min))/2 => (min-dmin+max-dmax)/2
      scaleY = cHeight / (this.max[0] - this.min[0])
      this.scale = [scaleY]
      translateY = (-(this.max[0] - this.min[0]) / 2 - this.min[0]) * scaleY
    }

    this.chart.axesMatricesCtrl.forEach((a) => a.scale(scaleX, scaleY, 0, 0), this.type, this.axisOptions.align)
    this.chart.axesMatricesCtrl.forEach((a) => a.translate(translateX, translateY), this.type, this.axisOptions.align)
  }

  drawYAxis() {
    const gl = this.chart?.getGL()
    const ctx = this.ctx
    if (!this.chart || !gl || !ctx) return

    const { align } = this.axisOptions
    let cHeight = gl.canvas.height
    const translateY = -(this.max[0] - this.min[0]) / 2 - this.min[0]

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.beginPath()
    ctx.moveTo(align === 'left' ? this.maxWidth : 0, 0)
    ctx.lineWidth = 1
    ctx.lineTo(align === 'left' ? this.maxWidth : 0, cHeight)

    ctx.font = this.getFont()
    ctx.textAlign = align === 'left' ? 'end' : 'start'

    ctx.fillStyle = this.axisOptions.style.color
    this.ticks[0].forEach((tick) => {
      ctx.moveTo(
        align === 'left' ? this.maxWidth : 0,
        cHeight / 2 - tick.value * this.scale[0] - translateY * this.scale[0] + 0.5
      )
      ctx.lineTo(
        align === 'left' ? this.maxWidth - 6 : 6,
        cHeight / 2 - tick.value * this.scale[0] - translateY * this.scale[0] + 0.5
      )
      const lines = tick.formattedValue.length
      this.drawAxisText(
        ctx,
        tick.formattedValue,
        align === 'left'
          ? this.maxWidth - 6 - this.axisOptions.style.tickOffset
          : 6 + this.axisOptions.style.tickOffset,
        tick.metrics.fontBoundingBoxAscent +
          cHeight / 2 -
          tick.value * this.scale[0] -
          translateY * this.scale[0] -
          ((tick.metrics.fontBoundingBoxAscent + tick.metrics.fontBoundingBoxDescent) / 2) * lines,
        tick.metrics.fontBoundingBoxAscent + tick.metrics.fontBoundingBoxDescent
      )
    })

    ctx.strokeStyle = this.axisOptions.style.color //'#ffffffff'
    ctx.stroke()
  }

  /** настройка генератора тиков. получение количества тиков */
  tuneTickGenerator() {
    // prettier-ignore
    const { type, min, max, canvas: { width, height } } = this
    const maxDec = 3

    const countTicks = 0.3 * Math.sqrt(type === 'x' ? width : height)

    const delta = (max[0] - min[0]) / countTicks
    /** цифр после запятой */
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

    this.ticks = [this.tickGenerator(this.min[0], this.max[0], size)]
    this.setAxisSize()
  }

  update() {
    const gl = this.chart?.getGL()
    const mCtrl = this.chart?.axesMatricesCtrl.getOneAxis(this.type, this.axisOptions.align)
    if (!this.chart || !mCtrl || !gl) return

    const { translateX, translateY, scaleX, scaleY, originX, originY } = mCtrl.getTransformData()

    const {
      type,
      canvas: { width, height },
    } = this

    if (typeof translateX === 'number' && scaleX && type === 'x') {
      this.scale = [scaleX]
      this.min = [-translateX / this.scale[0] - originX / this.scale[0]]
      this.max = [this.min[0] + gl.canvas.width / this.scale[0]]
    }
    if (typeof translateY === 'number' && scaleY && type === 'y') {
      this.scale = [scaleY]
      this.min = [-translateY / this.scale[0] - (originY + gl.canvas.clientHeight / 2) / this.scale[0]]
      this.max = [this.min[0] + gl.canvas.height / this.scale[0]]
    }
    window.requestAnimationFrame(() => {
      this.tuneTickGenerator()
      this.drawAxis()
      this.chartOptions && this.chartOptions.overlay && this.chartOptions.overlay.update()
    })
  }

  getDomain(): [number, number] | undefined {
    return [this.min[0], this.max[0]]
  }
}
