import React, { useState } from 'react'
import { Area, Axis, Grid, Lines, Title } from '../src'
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
  const handleSplitChange = () => setSplit((prev) => !prev)

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
        <Axis domain={[0, 1850]} />
        <Axis align="left" split={split} />
        <Lines series={series} />
        <Grid refY="left" />
        <TestTooltip />
      </Area>
      <div className="align-button" onClick={handleSplitChange}>
        {split ? 'merge' : 'split'}
      </div>
    </div>
  )
}

export default App
