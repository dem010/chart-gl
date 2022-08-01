export interface IMinmax {
  min: number
  max: number
}

export class ChartData {
  data: Float32Array
  minmaxX: IMinmax
  minmaxY: IMinmax

  constructor(data: Float32Array | Array<number>) {
    if (data.constructor.name === 'Array') this.data = new Float32Array(data)
    else this.data = data as Float32Array

    let mmX: IMinmax, mmY: IMinmax
    if (this.data.length > 2) {
      mmX = { min: this.data[0], max: this.data[0] }
      mmY = { min: this.data[1], max: this.data[1] }
      for (let i = 2; i < this.data.length; i += 2) {
        mmX.min = Math.min(mmX.min, this.data[i])
        mmX.max = Math.max(mmX.max, this.data[i])
        mmY.min = Math.min(mmY.min, this.data[i + 1])
        mmY.max = Math.max(mmY.max, this.data[i + 1])
      }
      this.minmaxX = mmX
      this.minmaxY = mmY
    } else {
      this.minmaxX = { min: 0, max: 0 }
      this.minmaxY = { min: 0, max: 0 }
    }
  }

  getData(): Float32Array {
    return this.data
  }
}
