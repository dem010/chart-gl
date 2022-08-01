import { AxisTypeType } from '../types/chart'
import { AxisControl } from './AxisControl'
import Chart from './Chart'
import PanScale from './PanScale'

export default class PanScaleAxis extends PanScale {
  private offset: DOMRect = new DOMRect(0, 0, 0, 0)

  private axis: AxisControl
  private canvas: HTMLCanvasElement
  private type: AxisTypeType

  constructor(axis: AxisControl, chart: Chart) {
    super(chart, chart.axesMatricesCtrl)
    this.axis = axis
    this.canvas = axis.canvas
    this.type = axis.type

    this.bindHandlers()
  }

  //! для touch двигать и масштабировать сделать настраиваемым, либо двигать/масштабировать, либо движение курсора
  bindHandlers() {
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.handlerWheel = this.handlerWheel.bind(this)
    this.handlerTouchStart = this.handlerTouchStart.bind(this)
    this.handlerTouchMove = this.handlerTouchMove.bind(this)
    this.handlerTouchEnd = this.handlerTouchEnd.bind(this)

    this.canvas.addEventListener<'mousedown'>('mousedown', this.onMouseDown)
    this.canvas.addEventListener<'wheel'>('wheel', this.handlerWheel)
    this.canvas.addEventListener<'touchstart'>('touchstart', this.handlerTouchStart)
    this.canvas.addEventListener<'touchmove'>('touchmove', this.handlerTouchMove)
    this.canvas.addEventListener<'touchend'>('touchend', this.handlerTouchEnd)
    this.offset = this.canvas.getBoundingClientRect()
  }

  unbindHandlers() {
    this.canvas.removeEventListener<'mousedown'>('mousedown', this.onMouseDown)
    this.canvas.removeEventListener<'wheel'>('wheel', this.handlerWheel)
    this.canvas.removeEventListener<'touchstart'>('touchstart', this.handlerTouchStart)
    this.canvas.removeEventListener<'touchmove'>('touchmove', this.handlerTouchMove)
    this.canvas.removeEventListener<'touchend'>('touchend', this.handlerTouchEnd)
  }

  onMouseDown(event: MouseEvent) {
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
    this.panStart({
      clientX: this.type === 'x' ? event.pageX - this.offset.left : 0,
      clientY: this.type === 'y' ? event.pageY - this.offset.top : 0,
    })
  }
  onMouseMove(event: MouseEvent) {
    if (this.isTranslate) {
      this.pan(
        {
          clientX: this.type === 'x' ? event.pageX - this.offset.left : 0,
          clientY: this.type === 'y' ? event.pageY - this.offset.top : 0,
        },
        this.axis.type,
        this.axis.axisOptions.align
      )
      this.axis.update()
    }
  }
  onMouseUp(event: MouseEvent) {
    if (this.isTranslate) {
      this.panEnd(
        {
          clientX: this.type === 'x' ? event.pageX - this.offset.left : 0,
          clientY: this.type === 'y' ? event.pageY - this.offset.top : 0,
        },
        this.axis.type,
        this.axis.axisOptions.align
      )
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  }

  handlerWheel(event: WheelEvent) {
    let leftOffset = parseInt(this.chart.options.areaGrid.leftAxis)
    leftOffset = isNaN(leftOffset) ? 0 : leftOffset

    if (event.deltaY > 0) {
      this.matricesCtrl.forEach(
        (mCtrl) =>
          mCtrl.zoomOut(
            this.type === 'x' ? 0.1 : 0,
            this.type === 'y' ? 0.1 : 0,
            event.pageX - this.offset.left - leftOffset,
            event.pageY - this.offset.top - this.chart.canvas.height / 2
          ),
        this.axis.type,
        this.axis.axisOptions.align
      )
      this.axis.update()
    } else {
      this.matricesCtrl.forEach(
        (mCtrl) =>
          mCtrl.zoomIn(
            this.type === 'x' ? 0.1 : 0,
            this.type === 'y' ? 0.1 : 0,
            event.pageX - this.offset.left - leftOffset,
            event.pageY - this.offset.top - this.chart.canvas.height / 2
          ),
        this.axis.type,
        this.axis.axisOptions.align
      )
      this.axis.update()
    }
  }

  handlerTouchStart(event: TouchEvent) {
    const touches = {
      clientX: this.type === 'x' ? event.touches[0].clientX : 0,
      clientY: this.type === 'y' ? event.touches[0].clientY : 0,
    }
    if (event.touches.length === 1) this.panStart(touches)
    if (event.touches.length > 1) {
      this.panEnd(touches, this.axis.type, this.axis.axisOptions.align)
      //this.scaleStart(event.touches)
    }
  }

  handlerTouchMove(event: TouchEvent) {
    if (event.touches.length > 0) {
      if (this.isTranslate && event.touches.length === 1)
        this.pan(
          {
            clientX: this.type === 'x' ? event.touches[0].clientX : 0,
            clientY: this.type === 'y' ? event.touches[0].clientY : 0,
          },
          this.axis.type,
          this.axis.axisOptions.align
        )
      /*if (event.touches.length > 1) {
        this.scaleTo(event.touches)
      }*/
      this.axis.update()
    }
  }
  handlerTouchEnd(event: TouchEvent) {
    if (this.isTranslate && event.changedTouches.length === 1)
      this.panEnd(
        {
          clientX: this.type === 'x' ? event.changedTouches[0].clientX : 0,
          clientY: this.type === 'y' ? event.changedTouches[0].clientY : 0,
        },
        this.axis.type,
        this.axis.axisOptions.align
      )
    //if (event.touches.length && event.touches.length < 2) this.scaleStop(event.touches, this.axis.type)
  }
}
