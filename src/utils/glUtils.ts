export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram()
  if (program) {
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
      return program
    }

    gl.deleteProgram(program)
  }
  return null
}

export function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type) // создание шейдера
  if (shader) {
    gl.shaderSource(shader, source) // устанавливаем шейдеру его программный код
    gl.compileShader(shader) // компилируем шейдер
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
      // если компиляция прошла успешно - возвращаем шейдер
      return shader
    }
  }

  gl.deleteShader(shader)
  return null
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier?: number) {
  multiplier = multiplier || 1
  const width = (canvas.clientWidth * multiplier) | 0
  const height = (canvas.clientHeight * multiplier) | 0
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    return true
  }
  return false
}
