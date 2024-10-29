export function resizeCanvas(
  canvas: HTMLCanvasElement,
  height: number,
  width: number,
) {
  const scale = 3

  height = Math.floor(height)
  width = Math.floor(width)

  canvas.width = width * scale
  canvas.height = height * scale
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  const c = canvas.getContext('2d')

  if (c) {
    c.scale(scale, scale)
  }
}
