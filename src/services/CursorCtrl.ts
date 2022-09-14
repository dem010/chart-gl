import { RefX, RefY } from '../types/chart'
import { AxisControl } from './AxisControl'
import OverlayCtrl from './OverlayCtrl'
import OverlayElement from './OverlayElement'

export default class CursorCtrl implements OverlayElement {
  private overlay = OverlayCtrl.getInstance()
  private cursorX: number = -1
  private cursorY: number = -1
  private cursorXValue: number | null = null
  private cursorYValue: number | null = null

  private formatter = (val: number): string | number => val
  private axes: AxisControl[] = []
  private enabled: boolean = true

  //TODO: добавить b t l r formatter
  constructor(
    private chartCanvas: HTMLCanvasElement,
    private color: string = '#fff',
    private type: RefX | RefY = 'bottom',
    formatter: (val: number) => string | number
  ) {
    this.formatter = formatter
    this.bindMethods()

    this.bindChart()
    this.bindAxes()

    this.overlay.add(this)
  }

  destroy() {
    this.unbindChart()
    this.unbindAxes()
    this.overlay.remove(this)
  }

  bindMethods() {
    this.mousemove = this.mousemove.bind(this)
    this.mousemoveY = this.mousemoveY.bind(this)
  }

  bindChart() {
    this.chartCanvas.addEventListener<'mousemove'>('mousemove', this.mousemove)
  }

  bindAxes() {
    this.axes.forEach((axis) => {
      if (axis.type === 'y') axis.canvas.addEventListener<'mousemove'>('mousemove', this.mousemoveY)
      else axis.canvas.addEventListener<'mousemove'>('mousemove', this.mousemove)
    })
  }

  unbindChart() {
    this.chartCanvas.removeEventListener<'mousemove'>('mousemove', this.mousemove)
  }

  unbindAxes() {
    this.axes.forEach((axis) => {
      axis.canvas.removeEventListener<'mousemove'>('mousemove', this.mousemove)
    })
  }

  mousemove(event: MouseEvent) {
    if (this.overlay) {
      let offset = this.chartCanvas.getBoundingClientRect()
      this.cursorX = event.pageX - offset.left
      this.cursorY = -1
      this.overlay.draw()
    }
  }

  mousemoveY(event: MouseEvent) {
    if (this.overlay) {
      let offset = this.chartCanvas.getBoundingClientRect()
      this.cursorY = event.pageY - offset.top
      this.cursorX = -1
      this.overlay.draw()
    }
  }

  setAxes(axes: AxisControl[]) {
    this.unbindAxes()
    this.axes = axes
    this.bindAxes()
  }

  draw(ctx: CanvasRenderingContext2D, { height, width }: HTMLCanvasElement) {
    if (this.enabled) {
      this.drawCursor(ctx, width, height)
      this.drawLabel(ctx, height)
    }
  }

  drawCursor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.beginPath()

    ctx.setLineDash([5, 5])
    ctx.strokeStyle = this.color
    if (this.cursorX >= 0) {
      ctx.moveTo(this.cursorX + 0.5, 0)
      ctx.lineTo(this.cursorX + 0.5, height)
    } else {
      ctx.moveTo(0, this.cursorY + 0.5)
      ctx.lineTo(width, this.cursorY + 0.5)
    }

    ctx.stroke()
    ctx.setLineDash([0, 0])
    ctx.strokeStyle = '#fff'
  }

  //TODO: привязка курсора к поиску точек (т.е если рядом с курсором точка, то выставить курсор строго на неё)
  //? Либо выставлять по нажатию на пробел
  drawLabel(ctx: CanvasRenderingContext2D, height: number) {
    const TEXT_PADDING_TB = 6
    const TEXT_PADDING_LR = 8
    const TEXT_BG = '#22f'
    const TEXT_COLOR = '#fff'
    const TEXT_BORDER_COLOR = '#acacac'
    const TEXT_FONT = '15px calibri, serif'

    this.cursorXValue = this.getValue(this.cursorX, this.type)
    let text = this.cursorXValue !== null ? this.formatter(this.cursorXValue) + '' : ''

    ctx.beginPath()

    ctx.font = TEXT_FONT
    ctx.textAlign = 'center'

    const measText = ctx.measureText(text)
    const textWidth = measText.width + TEXT_PADDING_LR * 2

    ctx.fillStyle = TEXT_BG
    ctx.strokeStyle = TEXT_BORDER_COLOR

    ctx.fillRect(
      this.cursorX + 0.5 - textWidth / 2,
      height - 0.5,
      textWidth,
      -(measText.actualBoundingBoxAscent + TEXT_PADDING_TB * 2)
    )
    ctx.rect(
      this.cursorX + 0.5 - textWidth / 2,
      height - 0.5,
      textWidth,
      -(measText.actualBoundingBoxAscent + TEXT_PADDING_TB * 2)
    )

    ctx.stroke()
    ctx.fillStyle = TEXT_COLOR
    ctx.fillText(text, this.cursorX + 0.5, height - 0.5 - TEXT_PADDING_TB)

    ctx.strokeStyle = '#fff'
  }

  getValue(coord: number, type: RefX | RefY) {
    let value = null
    if (type === 'bottom' || type === 'top') {
      this.axes.forEach((axis) => {
        if (axis.axisOptions.align === type) {
          const { scale, min } = axis
          value = coord / scale[0] + min[0]
        }
      })
    }
    return value
  }

  setEnabled(set: boolean) {
    this.enabled = set
  }
}
