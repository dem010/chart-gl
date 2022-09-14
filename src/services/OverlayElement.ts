export default interface OverlayElement {
  draw: (ctx: CanvasRenderingContext2D, { width, height }: HTMLCanvasElement) => void
}
