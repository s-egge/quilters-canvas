export function resizeCanvas(
  canvas: HTMLCanvasElement,
  height: number,
  width: number,
) {
  let scale = 1
  if (height < 3000 && width < 3000) {
    scale = 2
  } else if (height < 1500 && width < 1500) {
    scale = 3
  }

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
