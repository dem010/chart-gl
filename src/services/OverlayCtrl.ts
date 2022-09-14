import OverlayElement from './OverlayElement'

export default class OverlayCtrl {
  static instance: OverlayCtrl
  static getInstance() {
    if (!OverlayCtrl.instance) OverlayCtrl.instance = new OverlayCtrl()
    return OverlayCtrl.instance
  }

  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null

  private overlayElements: Set<OverlayElement> = new Set()

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.resizeCanvasToDisplaySize()
  }

  add(element: OverlayElement) {
    this.overlayElements.add(element)
  }

  remove(element: OverlayElement) {
    this.overlayElements.delete(element)
  }

  draw() {
    window.requestAnimationFrame(
      (() => {
        if (!this.ctx || !this.canvas) return

        const ctx = this.ctx
        const { width, height } = this.canvas
        ctx.clearRect(0, 0, width, height)

        this.overlayElements.forEach((element) => element.draw(ctx, this.canvas!))
      }).bind(this)
    )
  }

  update() {
    this.draw()
  }

  resize(size?: [number, number]) {
    this.resizeCanvasToDisplaySize()
    this.draw()
  }

  resizeCanvasToDisplaySize(multiplier?: number) {
    multiplier = multiplier || 1
    if (this.canvas) {
      const width = (this.canvas.clientWidth * multiplier) | 0
      const height = (this.canvas.clientHeight * multiplier) | 0

      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width
        this.canvas.height = height
        return true
      }
    }
    return false
  }
}
