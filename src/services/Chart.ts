import M4, { Matrix4 } from '../utils/m4'
import { nameToGlRGB } from '../utils/nameToGlRGB'
import { resizeCanvasToDisplaySize } from '../utils/glUtils'
import AxesMatricesCtrl from './AxesMatricesCtrl'
import PanScaleChart from './PanScaleChart'
import { ChartData } from './ChartData'
import { ChartOptions, ChartProperties, ChartSeries, Series } from '../types/chart'
import MatrixControl from './MatrixControl'

export default class Chart {
  private m4 = M4

  protected primitiveType: number = 0

  public gl: WebGLRenderingContext | null
  public canvas: HTMLCanvasElement
  public options: ChartOptions
  public series: ChartSeries[] = []
  protected panScale
  protected dataCount: number = 0
  protected projectionMatrix: Matrix4 = this.m4.translation(0, 0, 0)
  /*translationMatrix = this.m4.translation(0, 0, 0)
  scaleMatrix = this.m4.scaling(1, 1, 1)
  matrix
  scaleX = 1
  scaleY = 1
  translateX = 0
  translateY = 0*/

  protected positionAttributeLocation: number | null = null
  protected matrixLocation: WebGLUniformLocation | null = null
  protected colorUniformLocation: WebGLUniformLocation | null = null

  public axesMatricesCtrl = new AxesMatricesCtrl(this)
  //private chartProperties: ChartProperties

  constructor(canvas: HTMLCanvasElement, chartProperties: ChartProperties) {
    this.canvas = canvas
    this.options = chartProperties.options
    //this.chartProperties = chartProperties
    this.gl = canvas.getContext('webgl', { powerPreference: 'high-performance' })
    if (!this.gl) {
      console.error('Браузер не поддерживает webgl')
      return
    }

    chartProperties.chart = this
    chartProperties.setProp && chartProperties.setProp({ ...chartProperties })

    this.panScale = new PanScaleChart(this)
  }

  destroy() {
    this.panScale && this.panScale.destroy()
  }

  getGL() {
    return this.gl
  }

  /** Очищаю canvas */
  clear() {
    // очищаем canvas
    if (this.gl) {
      this.gl.clearColor(0, 0, 0, 0)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }
  }

  /** Задать размер canvas и пересчитать матрицу*/
  setSize() {
    const { gl, m4 } = this

    if (!gl) return

    resizeCanvasToDisplaySize(gl.canvas)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    this.projectionMatrix = m4.orthographic(
      0,
      gl.canvas.clientWidth,
      -gl.canvas.clientHeight / 2,
      gl.canvas.clientHeight - gl.canvas.clientHeight / 2,
      -1,
      1
    )

    this.axesMatricesCtrl.forEach((mCtrl) => mCtrl.multiply(this.projectionMatrix))

    //this.clear()
  }

  setColor(color: string) {
    if (this.gl) {
      const glColor = nameToGlRGB(color)
      this.gl.uniform4f(this.colorUniformLocation, ...glColor)
    }
  }

  resize(size?: [number, number]) {
    //const [width, height] = size //то что было
    if (this.gl) {
      const scX = this.gl.canvas.clientWidth / this.gl.canvas.width
      const scY = this.gl.canvas.clientHeight / this.gl.canvas.height

      this.setSize()

      this.axesMatricesCtrl.forEach((mCtrl) => mCtrl.resize(scX, scY))

      window.requestAnimationFrame(this.drawSeries.bind(this))
      this.options.axes.forEach((axis) => axis.update())
    }
  }

  setSeries(series: Series[]) {
    //TODO: удалить предыдущии серии и матрицы к ним
    this.axesMatricesCtrl.clear()
    this.series = []
    series.forEach((s, i) => {
      const chartSeries = {
        id: i + 1,
        data: new ChartData(s.data),
        refX: s.refX || 'bottom',
        refY: s.refY || 'left',
        color: s.color,
        label: s.label,
      }
      this.axesMatricesCtrl.add(chartSeries)
      this.series.push(chartSeries)
    })
    this.options.series = this.series
    this.drawSeries()
  }

  /*setOptions(options) {
    this.options
  }*/

  /** рисую массив */
  draw(matrixCtrl: MatrixControl) {
    const { gl, projectionMatrix, matrixLocation, dataCount } = this
    if (gl) {
      gl.uniformMatrix4fv(matrixLocation, false, matrixCtrl.multiply(projectionMatrix))
      const offset = 0
      gl.drawArrays(this.primitiveType, offset, dataCount)
      //TODO: добавить отображение точек при приближении
      //! если начать рисовать его в определенный момент, то появятся точки
      //gl.drawArrays(gl.POINTS, offset, dataCount)
    }
  }

  drawSeries() {
    if (this.series) {
      this.series.forEach((s) => {
        if (typeof (s.data as ChartData).getData !== 'undefined') {
          this.setColor(s.color)
          this.setData((s.data as ChartData).getData())
          this.draw(this.axesMatricesCtrl.series[s.refX + s.refY + s.id])
        }
      })
    }
  }

  setData(data: Float32Array): void {}
}
