import React, { useState } from 'react'
import { Area, Axis, Overlay, Lines, Title, Grid, Cursor } from '../src'
import { Series } from '../src/types/chart'
import { genData2, genData3 } from './genData'
import './app.css'
import TestTooltip from './TestTooltip'

//TODO: если есть ось, но нет к ней привязки, то ось не должна рисовать тики
//refY - по умолчанию left. Задает принадлежность к оси
const series: Series[] = [
  { data: genData2(500000, 0, 200, true), color: '#ec32eccc', refY: 'left' /*, refX: 'top'*/, label: 'Фаза А' },
  { data: genData2(500000, 120, 220, true), color: '#fb240ecc' /*refY: 'right', refX: 'top'*/, label: 'Фаза B' },
  { data: genData2(500000, 240, 180, true), color: '#93c3ffcc', refX: 'bottom', label: 'Фаза C' },
  //{ data: genData4(40000), color: 'green', refX: 'bottom' },
  // { data: genData4(40000), color: '#7f7', refX: 'bottom' },
  //{ data: genData3(), color: '#7f7', refX: 'bottom', label: 'Произвольная линия' },
  // { data: genData4(40000), color: '#77f', refX: 'bottom' },
]

const series2: Series[] = [
  { data: genData2(500000, 240, 100, true), color: 'red', refY: 'left' /*, refX: 'top'*/, label: 'Фаза А' },
  { data: genData2(500000, 120, 110, true), color: 'yellow' /*refY: 'right', refX: 'top'*/, label: 'Фаза B' },
  { data: genData2(500000, 0, 90, true), color: 'green', refX: 'bottom', label: 'Фаза C' },
  //{ data: genData4(40000), color: 'green', refX: 'bottom' },
  // { data: genData4(40000), color: '#7f7', refX: 'bottom' },
  //{ data: genData3(), color: '#7f7', refX: 'bottom', label: 'Произвольная линия' },
  // { data: genData4(40000), color: '#77f', refX: 'bottom' },
]

/** Добавляет 0-ли перед цифрами если общее кол-во цифр меньше num */
/*const pos = (num, value) => {
  const sZero = new Array(num).fill('0').join('')
  return (sZero + value).slice(-num)
}
const DATE_OFFSET = Date.now()
const xFormat = (v) => {
  let dt = new Date(v + DATE_OFFSET)
  return `${pos(2, dt.getDate())}.${pos(2, dt.getMonth() + 1)}.${pos(2, dt.getYear())}\n${pos(2, dt.getHours())}:${pos(
    2,
    dt.getMinutes()
  )}:${pos(2, dt.getSeconds())}.${pos(3, dt.getMilliseconds())}`
}*/

//TODO: добавить проверку, что если присутствует split, то несколько осей (left/right) запрещено
function App() {
  const [split, setSplit] = useState(false)
  const [changeSer, setChangeSer] = useState(1)
  const [cursor, setCursor] = useState(true)
  const handleSplitChange = () => setSplit((prev) => !prev)
  const handleChangeSeries = () => setChangeSer((prev) => (prev === 1 ? 2 : 1))
  const handleChangeCursor = () => setCursor((prev) => !prev)

  const cursorFormatter = (value: number) => `value = ${Number(value.toFixed(3))}`

  return (
    <div className="chart-wrapper">
      <Area>
        <Title align="top" style={{ color: '#fff' }}>
          Подпись графика
        </Title>
        <Title align="left" style={{ color: '#fff' }}>
          Ось Y
        </Title>
        <Title align="bottom" style={{ color: '#fff' }}>
          Ось X
        </Title>
        <Axis domain={[2000, 4000]} keepDomain />
        <Axis align="left" split={split} />
        <Lines series={changeSer === 1 ? series : series2} />
        <Overlay>
          <Grid refY="left" />
          <Cursor enabled={cursor} color="#88ccff66" bottom_formatter={cursorFormatter} />
        </Overlay>
        <TestTooltip />
      </Area>
      <div className="align-buttons">
        <div className="button ml10" onClick={handleSplitChange}>
          {split ? 'merge' : 'split'}
        </div>
        <div className="button ml10" onClick={handleChangeSeries}>
          {changeSer === 1 ? '2 series' : '1 series'}
        </div>
        <div className="button ml10" onClick={handleChangeCursor}>
          {cursor ? 'turn off cursor' : 'turn on cursor'}
        </div>
      </div>
    </div>
  )
}

export default App
