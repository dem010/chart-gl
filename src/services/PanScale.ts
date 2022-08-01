import { AlignType, AxisTypeType, PanType } from '../types/chart'
import AxesMatricesCtrl from './AxesMatricesCtrl'
import Chart from './Chart'

export default class PanScale {
  protected chart: Chart
  protected matricesCtrl: AxesMatricesCtrl
  protected isTranslate = false
  protected mouseStartTranslate: [number, number] = [0, 0]
  //предыдущий центр между пальцами
  prevCenter = 0
  //предыдущая дистанция между пальцами
  prevDistance = 1

  constructor(chart: Chart, matricesCtrl: AxesMatricesCtrl) {
    this.chart = chart
    this.matricesCtrl = matricesCtrl
  }

  destroy() {
    this.unbindHandlers()
  }

  unbindHandlers() {}

  panStart({ clientX, clientY }: PanType) {
    this.isTranslate = true
    this.mouseStartTranslate = [clientX, clientY]
  }

  //...добавить type, align, и как-то перебирать то что надо
  pan({ clientX, clientY }: PanType, type?: AxisTypeType, align?: AlignType) {
    this.matricesCtrl.forEach(
      (mCtrl) => {
        mCtrl.move(clientX - this.mouseStartTranslate[0], clientY - this.mouseStartTranslate[1])
      },
      type,
      align
    )
  }

  panEnd({ clientX, clientY }: PanType, type?: AxisTypeType, align?: AlignType) {
    this.isTranslate = false
    this.matricesCtrl.forEach(
      (mCtrl) => mCtrl.stopmove(clientX - this.mouseStartTranslate[0], clientY - this.mouseStartTranslate[1]),
      type,
      align
    )
  }

  scaleStart(touches: TouchList) {
    //сохраняю начальную дистанцию между пальцами
    this.prevDistance = calcXDistance(touches)
    //сохраняю начальный центр
    this.prevCenter = calcXCenter(touches, this.chart.canvas.offsetLeft)
  }

  scaleTo(touches: TouchList) {
    //нахожу новый центр
    //нахожу изменение масштаба
    const offset = this.chart.canvas.offsetLeft
    const newDistance = calcXDistance(touches)
    const zoom = newDistance / this.prevDistance
    const newCenter = calcXCenter(touches, offset)

    //this.matrixCtrl.touchScale(zoom, newCenter, newCenter - this.prevCenter)
    this.matricesCtrl.forEach((mCtrl) => mCtrl.touchScale(zoom, newCenter, newCenter - this.prevCenter))

    this.prevDistance = newDistance
    this.prevCenter = newCenter
  }

  scaleStop(touches: TouchList) {
    const offset = this.chart.canvas.offsetLeft
    const newCenter = calcXCenter(touches, offset)
    //this.matrixCtrl.stopmove(newCenter - this.prevCenter, 0)
    this.matricesCtrl.forEach((mCtrl) => mCtrl.stopmove(newCenter - this.prevCenter, 0))
  }
}

/*function calcDistance(touches) {
  const diffX = touches[0].clientX - touches[1].clientX
  const diffY = touches[0].clientY - touches[1].clientY
  return Math.sqrt(diffX * diffX + diffY * diffY)
}*/
function calcXDistance(touches: TouchList) {
  return Math.abs(touches[0].clientX - touches[1].clientX)
}
function calcXCenter(touches: TouchList, offset: number) {
  return (touches[0].clientX - offset + touches[1].clientX - offset) / 2
}
