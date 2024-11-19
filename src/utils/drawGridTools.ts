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

// draw a single hexagon outline given an x, y center and a radius
function drawHexagonOutline(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  const angle = Math.PI / 3 // 60 degrees in radians

  c.beginPath()
  for (let i = 0; i < 6; i++) {
    c.lineTo(x + r * Math.cos(angle * i), y + r * Math.sin(angle * i))
  }
  c.closePath()
  c.strokeStyle = color
  c.stroke()
}

// draw a hexagon grid given a radius of the hexagons
// adjusted from: https://eperezcosano.github.io/hex-grid/
function drawHexGrid(
  canvas: HTMLCanvasElement,
  hexRadius: number,
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

  const a = Math.PI / 3 // 60 degrees in radians
  const xOffset = hexRadius * (1 + Math.cos(a))
  const hexHeight = hexRadius * Math.sqrt(3)

  let gridX = 0
  let gridY = 0

  // this keeps the grid from being cut off at the top
  const canvasTopOffset = 5

  for (
    let startY = hexHeight / 2 + canvasTopOffset;
    startY + hexHeight < height;
    startY += hexHeight, gridY++
  ) {
    gridX = 0
    for (
      let x = hexRadius, j = 0, y = startY;
      x + xOffset / 2 < width;
      x += xOffset, y += (-1) ** j++ * hexRadius * Math.sin(a), gridX++
    ) {
      shapes.push({ type: GridShape.Hexagon, x, y, gridX, gridY })
      drawHexagonOutline(c, x, y, hexRadius, color)
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
  return drawHexGrid(canvas, size, color)
}

export function drawShapeOutline(
  c: CanvasRenderingContext2D,
  shape: string,
  x: number,
  y: number,
  shapeSize: number,
  color: string,
) {
  if (shape === GridShape.Square) {
    c.strokeRect(x, y, shapeSize, shapeSize)
  } else {
    drawHexagonOutline(c, x, y, shapeSize, color)
  }
}
