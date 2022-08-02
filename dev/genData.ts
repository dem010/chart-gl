export function genData(count: number, offsetX: number, scale: number) {
  const ret = new Float32Array(count * 2)
  const startTime = 0
  const interval = 32
  for (let i = 0; i < count; i++) {
    ret[i * 2] = startTime + i * interval
    ret[i * 2 + 1] = Math.sin((((i + offsetX) % 360) * Math.PI) / 180) * scale
  }
  return ret
}

export function genData2(count: number, offsetX: number, scale: number, flow: boolean): Float32Array {
  const ret = new Float32Array(count * 2)
  let low = true
  let sc = scale
  for (let i = 0; i < count; i++) {
    ret[i * 2] = i * 1
    ret[i * 2 + 1] = Math.sin((((i + offsetX) % 360) * Math.PI) / 180) * sc
    if (flow) {
      if ((i + 1 + offsetX) % 360 === 0 && low) {
        sc -= 10
      }
      if ((i + 1 + offsetX) % 360 === 0 && !low) {
        sc += 10
      }
      if ((low && sc < scale - scale * 0.8) || (!low && sc > scale)) low = !low
    }
  }
  return ret
}

export function genData3() {
  const positions = [-100, -100, 0, 0, 100, 100, 200, 100, 500, 200, 1000, 300, 1810, 400]
  return new Float32Array(positions)
}

export function genData4(count: number) {
  const positions: number[] = []
  for (var i = 0; i < count * 10; i += 10) {
    positions.push(i)
    positions.push(Math.random() * 20 /* - 10*/)
  }
  return new Float32Array(positions)
}
