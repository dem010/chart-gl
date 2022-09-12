import { ChartOptions, RefX, RefY } from '../types/chart'
import { AxisControl } from './AxisControl'
import Cursor from './Cursor'

export default class Overlay {
  static instance: Overlay
  static getInstance(canvas: HTMLCanvasElement, opt: ChartOptions) {
    if (!Overlay.instance) Overlay.instance = new Overlay(canvas, opt)
    return Overlay.instance
  }

  private ctx: CanvasRenderingContext2D | null
  private axes: AxisControl[] = []
  private color: string = '#555'

  protected cursor: Cursor | null = null

  constructor(private canvas: HTMLCanvasElement, private opt: ChartOptions) {
    //this.canvas = canvas.current
    //this.opt = opt
    this.ctx = this.canvas.getContext('2d')
    this.resizeCanvasToDisplaySize()
  }

  addAxis(axis: AxisControl) {
    if (!this.axes.includes(axis)) this.axes.push(axis)
  }

  removeAxis(axis: AxisControl) {
    if (this.axes.includes(axis)) this.axes.splice(this.axes.indexOf(axis), 1)
  }

  setColor(color: string) {
    this.color = color
  }

  drawVerticalLine = function (ctx: CanvasRenderingContext2D, x: number, y: number, height: number, color: string) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, 1, height)
  }

  drawHorizontalLine = function (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, color: string) {
    ctx.fillStyle = color
    ctx.fillRect(x, y - 0.5, width, 1)
  }

  draw() {
    window.requestAnimationFrame(
      (() => {
        if (!this.ctx) return

        const ctx = this.ctx
        const { width, height } = this.canvas
        ctx.clearRect(0, 0, width, height)

        this.drawGrid()
        //this.drawCursor()
        this.cursor && this.cursor.draw(ctx, height)
      }).bind(this)
    )
  }

  drawGrid() {
    if (!this.ctx) return

    const ctx = this.ctx
    const { width, height } = this.canvas

    ctx.beginPath()

    this.axes.forEach((axis) => {
      const { ticks, translate, scale, min, max } = axis
      if (axis.constructor.name === 'AxisControlSplit') {
        ticks.forEach((a_ticks, i) =>
          a_ticks.forEach((tick) => {
            if (axis.type === 'y') {
              const splittedHeight = height / ticks.length
              const y = height / 2 - translate[i] - tick.value * scale[i]
              if (y > splittedHeight * i && y < splittedHeight * i + splittedHeight)
                this.drawHorizontalLine(ctx, 0, y, width, this.color)
            }
            if (axis.type === 'x') {
              this.drawVerticalLine(ctx, tick.value * scale[i] - min[i] * scale[i], 0, height, this.color)
            }
          })
        )
      } else {
        const translateY = -(max[0] - min[0]) / 2 - min[0]
        ticks[0].forEach((tick) => {
          if (axis.type === 'y')
            this.drawHorizontalLine(
              ctx,
              0,
              height / 2 - tick.value * scale[0] - translateY * scale[0],
              width,
              this.color
            )
          if (axis.type === 'x')
            this.drawVerticalLine(ctx, tick.value * scale[0] - min[0] * scale[0], 0, height, this.color)
        })
      }
    })

    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#fff'
    ctx.stroke()
  }

  update() {
    //debugger
    //console.log('gridUpdate')
    this.draw()
  }

  setXCursor(x: number) {
    window.requestAnimationFrame(
      (() => {
        this.draw()
      }).bind(this)
    )
  }

  //! перенес в Chart
  /**
   * Включить/отключить курсор
   * @param {HTMLCanvasElement} canvas канвас Overlay
   * @param set вкл/откл
   */
  /*setCursor(set: boolean, color?: string, type?: RefX | RefY) {
    if (set) this.cursor = new Cursor(this.canvas, this, color, type)
    else {
      this.cursor && this.cursor.destroy()
      this.cursor = null
    }
  }*/
  setCursor(cursor: Cursor) {
    this.cursor = cursor
  }
  removeCursor() {
    this.cursor = null
  }

  resize(size?: [number, number]) {
    this.resizeCanvasToDisplaySize()
    this.draw()
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
}
