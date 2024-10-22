import { GridShape } from './interfaces'

// Hexagon math sourced from https://eperezcosano.github.io/hex-grid/
function drawHexagon(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  img?: HTMLImageElement,
) {
  c.beginPath()

  const a = (2 * Math.PI) / 6

  for (var i = 0; i < 6; i++) {
    c.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i))
  }
  c.closePath()

  if (img) {
    const pattern = c.createPattern(img, 'repeat')
    if (pattern) {
      c.fillStyle = pattern
    }
  } else {
    c.fillStyle = color
  }

  c.fill()
}

function drawSquare(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  img?: HTMLImageElement,
) {
  if (img) {
    const pattern = c.createPattern(img, 'repeat')
    if (pattern) {
      c.fillStyle = pattern
    }
  } else if (color) {
    c.fillStyle = color
  }
  c.fillRect(x, y, r, r)
}

export function drawShape(
  c: CanvasRenderingContext2D,
  shape: GridShape,
  x: number,
  y: number,
  r: number,
  color: string,
  img?: HTMLImageElement,
) {
  if (shape === GridShape.Hexagon) {
    drawHexagon(c, x, y, r, color, img)
  } else if (shape === GridShape.Square) {
    drawSquare(c, x, y, r, color, img)
  }
}
