import { RefX, RefY } from '../types/chart'
import Overlay from './Overlay'

export default class Cursor {
  private offset: DOMRect = new DOMRect(0, 0, 0, 0)
  private cursorX: number = 0

  constructor(
    private canvas: HTMLCanvasElement,
    private overlay: Overlay,
    private color: string = '#fff',
    private type: RefX | RefY = 'bottom'
  ) {
    this.bindHandlers()
  }

  destroy() {
    this.unbindHandlers()
  }

  bindHandlers() {
    this.mousemove = this.mousemove.bind(this)

    this.canvas.addEventListener<'mousemove'>('mousemove', this.mousemove)

    this.offset = this.canvas.getBoundingClientRect()
  }

  unbindHandlers() {
    this.canvas.removeEventListener<'mousemove'>('mousemove', this.mousemove)
  }

  mousemove(event: MouseEvent) {
    if (this.overlay) {
      this.cursorX = event.pageX - this.offset.left
      this.overlay.draw()
    }
  }

  draw(ctx: CanvasRenderingContext2D, height: number) {
    ctx.beginPath()

    ctx.setLineDash([5, 5])
    ctx.strokeStyle = this.color
    ctx.moveTo(this.cursorX + 0.5, 0)
    ctx.lineTo(this.cursorX + 0.5, height)

    ctx.stroke()
    ctx.strokeStyle = '#fff'
  }
}
