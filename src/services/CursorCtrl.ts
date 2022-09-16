import { AlignType, RefX, RefY } from '../types/chart'
import { AxisControl } from './AxisControl'
import OverlayCtrl from './OverlayCtrl'
import OverlayElement from './OverlayElement'

const TEXT_PADDING_TB = 6
const TEXT_PADDING_LR = 8
const TEXT_BG = '#22f'
const TEXT_COLOR = '#fff'
const TEXT_BORDER_COLOR = '#acacac'
const TEXT_FONT = '15px calibri, serif'

export default class CursorCtrl implements OverlayElement {
  private overlay = OverlayCtrl.getInstance()
  private cursorX: number = -1
  private cursorY: number = -1
  private cursorXValue: number | null = null
  private cursorYValue: number | null = null

  private formatter = (val: number): string | number => val
  private axes: AxisControl[] = []
  private enabled: boolean = true
  private currentType: RefX | RefY = 'bottom'

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
    this.chartCanvas.addEventListener<'mousemove'>('mousemove', this.mousemove.bind(this, this.type))
  }

  bindAxes() {
    this.axes.forEach((axis) => {
      if (axis.type === 'y') {
        axis.canvas.addEventListener<'mousemove'>('mousemove', this.mousemoveY.bind(this, axis.axisOptions.align))
        axis.canvas.addEventListener<'touchstart'>('touchstart', this.touchstartY.bind(this, axis.axisOptions.align))
      } else {
        axis.canvas.addEventListener<'mousemove'>('mousemove', this.mousemove.bind(this, axis.axisOptions.align))
        axis.canvas.addEventListener<'touchstart'>('touchstart', this.touchstart.bind(this, axis.axisOptions.align))
      }
    })
  }

  unbindChart() {
    this.chartCanvas.removeEventListener<'mousemove'>('mousemove', this.mousemove.bind(this, this.type))
  }

  unbindAxes() {
    this.axes.forEach((axis) => {
      axis.canvas.removeEventListener<'mousemove'>('mousemove', this.mousemove.bind(this, axis.axisOptions.align))
    })
  }

  mousemove(align: AlignType, event: MouseEvent) {
    if (this.overlay) {
      let offset = this.chartCanvas.getBoundingClientRect()
      this.cursorX = event.pageX - offset.left
      this.cursorY = -1
      this.currentType = align
      this.overlay.draw()
    }
  }

  mousemoveY(align: AlignType, event: MouseEvent) {
    if (this.overlay) {
      let offset = this.chartCanvas.getBoundingClientRect()
      this.cursorY = event.pageY - offset.top
      this.cursorX = -1
      this.currentType = align
      this.overlay.draw()
    }
  }
  //TODO: если принимать решение по align, то от -1 можно избавиться, а соответственно и от фун-ии с Y на конце
  touchstart(align: AlignType, event: TouchEvent) {
    if (this.overlay) {
      let offset = this.chartCanvas.getBoundingClientRect()
      this.cursorX = event.touches[0].pageX - offset.left
      this.cursorY = -1
      this.currentType = align
      this.overlay.draw()
    }
  }

  touchstartY(align: AlignType, event: TouchEvent) {
    if (this.overlay) {
      let offset = this.chartCanvas.getBoundingClientRect()
      this.cursorY = event.touches[0].pageY - offset.top
      this.cursorX = -1
      this.currentType = align
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
    let text
    if (this.cursorX >= 0) {
      this.cursorXValue = this.getValue(this.cursorX, this.type)
      text = this.cursorXValue !== null ? this.formatter(this.cursorXValue) + '' : ''
    } else {
      this.cursorYValue = this.getValue(this.cursorY, this.currentType, height)
      text = this.cursorYValue !== null ? this.formatter(this.cursorYValue) + '' : ''
    }

    ctx.beginPath()

    ctx.font = TEXT_FONT
    ctx.textAlign = 'center'

    const measText = ctx.measureText(text)
    const textWidth = measText.width + TEXT_PADDING_LR * 2
    const textHeight = measText.actualBoundingBoxAscent + measText.fontBoundingBoxDescent + TEXT_PADDING_TB * 2

    let xr: number, yr: number, xt: number, yt: number
    let wr: number = textWidth
    let hr: number = -(measText.actualBoundingBoxAscent + TEXT_PADDING_TB * 2)

    if (this.cursorX >= 0) {
      xr = this.cursorX + 0.5 - textWidth / 2
      yr = height - 0.5
      xt = this.cursorX + 0.5
      yt = height - 0.5 - TEXT_PADDING_TB
    } else {
      xr = 0
      yr = this.cursorY + 0.5 + textHeight / 2
      xt = textWidth / 2 + 0.5
      yt = this.cursorY + textHeight / 2 - TEXT_PADDING_TB
    }

    ctx.fillStyle = TEXT_BG
    ctx.strokeStyle = TEXT_BORDER_COLOR

    ctx.fillRect(xr, yr, wr, hr)
    ctx.rect(xr, yr, wr, hr)

    ctx.stroke()
    ctx.fillStyle = TEXT_COLOR
    ctx.fillText(text, xt, yt)

    ctx.strokeStyle = '#fff'
  }

  getValue(coord: number, type: RefX | RefY, height?: number) {
    if (type === 'bottom' || type === 'top') {
      for (let a = 0; a < this.axes.length; a++) {
        let axis = this.axes[a]
        if (axis.axisOptions.align === type) {
          const { scale, min } = axis
          return coord / scale[0] + min[0]
        }
      }
    } else {
      if (height) {
        for (let a = 0; a < this.axes.length; a++) {
          let axis = this.axes[a]
          if (axis.axisOptions.align === type) {
            const { scale, min, max, translate } = axis
            const axisHeight = height / axis.scale.length
            const i = Math.floor(coord / axisHeight)
            //для каждого scale
            if (axis.constructor.name === 'AxisControlSplit') {
              return (height / 2 - translate[i] - coord) / scale[i]
            } else {
              const translateY = -(max[0] - min[0]) / 2 - min[0]
              return height / (2 * scale[0]) - translateY - coord / scale[0]
            }
          }
        }
      }
    }
    return null
  }

  setEnabled(set: boolean) {
    this.enabled = set
  }
}
