import { Shape, GridShape } from './interfaces'

function drawLine(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  x2: number,
  y2: number,
  color: string,
  strokeWidth: number,
) {
  c.beginPath()
  c.moveTo(x, y)
  c.lineTo(x2, y2)
  c.strokeStyle = color
  c.lineWidth = strokeWidth
  c.globalAlpha = 1.0
  c.stroke()
}

function drawSquareGrid(
  canvas: HTMLCanvasElement,
  squareSize: number,
  color: string,
): Shape[] {
  const c = canvas.getContext('2d')

  if (!c) {
    throw new Error('Could not get canvas context while drawing square grid')
  }

  const shapes: Shape[] = []

  const width = canvas.clientWidth
  const height = canvas.clientHeight

  c.clearRect(0, 0, width, height)

  // draw vertical lines
  for (let x = squareSize; x < width; x += squareSize) {
    drawLine(c, x, 0, x, height, color, 1)
  }

  // draw horizontal lines
  for (let y = squareSize; y < height; y += squareSize) {
    drawLine(c, 0, y, width, y, color, 1)
  }

  // populate shapes array with square objects
  let gridY = 0

  for (let y = 0; y < height; y += squareSize, gridY++) {
    let gridX = 0
    for (let x = 0; x < width; x += squareSize, gridX++) {
      shapes.push({
        type: GridShape.Square,
        x,
        y,
        gridX,
        gridY,
      })
    }
  }
  return shapes
}

export function drawShapeGrid(
  canvas: HTMLCanvasElement,
  shape: string,
  size: number,
  color: string,
): Shape[] {
  if (shape === GridShape.Square) {
    return drawSquareGrid(canvas, size, color)
  }
  return []
}
