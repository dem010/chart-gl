import Chart from './Chart'
import PanScale from './PanScale'

export default class PanScaleChart extends PanScale {
  private offset: DOMRect = new DOMRect(0, 0, 0, 0)

  constructor(chart: Chart) {
    super(chart, chart.axesMatricesCtrl)

    this.bindHandlers()
  }

  bindHandlers() {
    this.handlerMouseDown = this.handlerMouseDown.bind(this)
    this.handlerMouseMove = this.handlerMouseMove.bind(this)
    this.handlerMouseUp = this.handlerMouseUp.bind(this)
    this.handlerWheel = this.handlerWheel.bind(this)
    this.handlerTouchStart = this.handlerTouchStart.bind(this)
    this.handlerTouchMove = this.handlerTouchMove.bind(this)
    this.handlerTouchEnd = this.handlerTouchEnd.bind(this)

    this.chart.canvas.addEventListener<'mousedown'>('mousedown', this.handlerMouseDown)
    this.chart.canvas.addEventListener<'wheel'>('wheel', this.handlerWheel)
    this.chart.canvas.addEventListener<'touchstart'>('touchstart', this.handlerTouchStart)
    this.chart.canvas.addEventListener<'touchmove'>('touchmove', this.handlerTouchMove)
    this.chart.canvas.addEventListener<'touchend'>('touchend', this.handlerTouchEnd)
    this.offset = this.chart.canvas.getBoundingClientRect()
  }

  unbindHandlers() {
    this.chart.canvas.removeEventListener<'mousedown'>('mousedown', this.handlerMouseDown)
    this.chart.canvas.removeEventListener<'wheel'>('wheel', this.handlerWheel)
    this.chart.canvas.removeEventListener<'touchstart'>('touchstart', this.handlerTouchStart)
    this.chart.canvas.removeEventListener<'touchmove'>('touchmove', this.handlerTouchMove)
    this.chart.canvas.removeEventListener<'touchend'>('touchend', this.handlerTouchEnd)
  }

  handlerMouseDown(event: MouseEvent) {
    this.panStart({ clientX: event.pageX - this.offset.left, clientY: event.pageY - this.offset.top })
    document.addEventListener<'mousemove'>('mousemove', this.handlerMouseMove)
    document.addEventListener<'mouseup'>('mouseup', this.handlerMouseUp)
  }

  handlerMouseMove(event: MouseEvent) {
    if (this.isTranslate) {
      this.pan({ clientX: event.pageX - this.offset.left, clientY: event.pageY - this.offset.top })
      this.chart.options.axes.forEach((axis) => axis.update())
    }
  }

  handlerMouseUp(event: MouseEvent) {
    if (this.isTranslate) {
      this.panEnd({ clientX: event.pageX - this.offset.left, clientY: event.pageY - this.offset.top })
      document.removeEventListener('mousemove', this.handlerMouseMove)
      document.removeEventListener('mouseup', this.handlerMouseUp)
    }
  }

  handlerWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      this.matricesCtrl.forEach((mCtrl) =>
        mCtrl.zoomOut(
          !event.shiftKey ? 0.1 : 0,
          event.shiftKey ? 0.1 : 0,
          event.pageX - this.offset.left,
          event.pageY - this.offset.top - this.chart.canvas.height / 2
        )
      )
      this.chart.options.axes.forEach((axis) => axis.update())
    } else {
      this.matricesCtrl.forEach((mCtrl) =>
        mCtrl.zoomIn(
          !event.shiftKey ? 0.1 : 0,
          event.shiftKey ? 0.1 : 0,
          event.pageX - this.offset.left,
          event.pageY - this.offset.top - this.chart.canvas.height / 2
        )
      )
      this.chart.options.axes.forEach((axis) => axis.update())
    }
  }

  handlerTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) this.panStart(event.touches[0])
    if (event.touches.length > 1) {
      this.panEnd(event.touches[0])
      this.scaleStart(event.touches)
    }
  }

  handlerTouchMove(event: TouchEvent) {
    if (event.touches.length > 0) {
      if (this.isTranslate && event.touches.length === 1) this.pan(event.touches[0])
      if (event.touches.length > 1) {
        this.scaleTo(event.touches)
      }
      this.chart.options.axes.forEach((axis) => axis.update())
    }
  }
  handlerTouchEnd(event: TouchEvent) {
    if (this.isTranslate && event.changedTouches.length === 1) this.panEnd(event.changedTouches[0])
    if (event.touches.length && event.touches.length < 2) this.scaleStop(event.touches)
  }
}
