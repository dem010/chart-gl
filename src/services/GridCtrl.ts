import { RefX, RefY } from '../types/chart'
import { AxisControl } from './AxisControl'
import OverlayCtrl from './OverlayCtrl'
import OverlayElement from './OverlayElement'

export default class GridCtrl implements OverlayElement {
  private overlay = OverlayCtrl.getInstance()
  private axes: AxisControl[] = []

  constructor(private color: string) {
    this.overlay.add(this)
  }

  destroy() {
    this.overlay.remove(this)
  }

  setAxes(axes: AxisControl[]) {
    this.axes = axes
  }

  drawVerticalLine = function (ctx: CanvasRenderingContext2D, x: number, y: number, height: number, color: string) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, 1, height)
  }

  drawHorizontalLine = function (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, color: string) {
    ctx.fillStyle = color
    ctx.fillRect(x, y - 0.5, width, 1)
  }

  draw(ctx: CanvasRenderingContext2D, { width, height }: HTMLCanvasElement) {
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
}
