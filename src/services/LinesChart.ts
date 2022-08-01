import Chart from './Chart'
import fragmentShaderSource from '../Shaders/fragmentShader.frag'
import vertexShaderSource from '../Shaders/vertexShader.vert'
import { createProgram, createShader } from '../utils/glUtils'
import { ChartProperties } from '../types/chart'

export default class LinesChart extends Chart {
  constructor(canvas: HTMLCanvasElement, chartProperties: ChartProperties) {
    super(canvas, chartProperties)

    if (!this.gl) return
    this.primitiveType = this.gl.LINE_STRIP
    //this.primitiveType = this.gl.POINTS

    this.initGl()
    this.setSize()
  }

  initGl() {
    const { gl } = this

    if (!gl) return

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader) {
      console.log('(WebGL) Шейдер не создан(vertex)')
      return
    }
    if (!fragmentShader) {
      console.log('(WebGL) Шейдер не создан(fragment)')
      return
    }
    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) {
      console.log('(WebGL) Программа не создана')
      return
    }

    this.positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    this.matrixLocation = gl.getUniformLocation(program, 'u_matrix')
    this.colorUniformLocation = gl.getUniformLocation(program, 'u_color')

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // говорим использовать нашу программу (пару шейдеров)
    gl.useProgram(program)

    gl.enableVertexAttribArray(this.positionAttributeLocation)
    // Привязываем буфер положений
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  }

  /**
   * Задаю массив точек
   * @param {Float32Array} data набор точек
   */
  setData(data: Float32Array) {
    const { gl, positionAttributeLocation } = this

    if (!gl || positionAttributeLocation === null) return

    this.dataCount = data.length / 2
    // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
    const size = 2 // 2 компоненты на итерацию
    const type = gl.FLOAT // наши данные - 32-битные числа с плавающей точкой
    const normalize = false // не нормализовать данные
    const stride = 0 // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
    const offset = 0 // начинать с начала буфера
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  }
}
