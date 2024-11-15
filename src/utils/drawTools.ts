import { GridShape, Shape, Swatch } from './interfaces'
import { findClosestSquare, findClosestHexagon } from './mathTools'

// Hexagon math sourced from https://eperezcosano.github.io/hex-grid/
function drawHexagon(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  swatch: Swatch,
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
  } else if (swatch.color) {
    c.fillStyle = swatch.color
  }

  c.fill()
}

function drawSquare(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  swatch: Swatch,
  img?: HTMLImageElement,
) {
  if (img) {
    const pattern = c.createPattern(img, 'repeat')
    if (pattern) {
      c.fillStyle = pattern
    }
  } else if (swatch.color) {
    c.fillStyle = swatch.color
  }
  c.fillRect(x, y, r, r)
}

/* commenting out for now to avoid build error, but may need it later
function drawShape(
  c: CanvasRenderingContext2D,
  shape: GridShape,
  x: number,
  y: number,
  r: number,
  swatch: Swatch,
  img?: HTMLImageElement,
) {
  if (shape === GridShape.Hexagon) {
    drawHexagon(c, x, y, r, swatch, img)
  } else if (shape === GridShape.Square) {
    drawSquare(c, x, y, r, swatch, img)
  }
}
  */

export function fillClosestShape(
  c: CanvasRenderingContext2D,
  shapes: Shape[],
  shape: GridShape,
  gridWidth: number,
  shapeSize: number,
  x: number,
  y: number,
  swatch: Swatch,
  img?: HTMLImageElement,
): Shape | undefined {
  let closestShape = null

  if (shape == GridShape.Square) {
    closestShape = findClosestSquare(x, y, gridWidth, shapeSize, shapes)

    if (closestShape) {
      drawSquare(c, closestShape.x, closestShape.y, shapeSize, swatch, img)
      return {
        type: closestShape.type,
        x: closestShape.x,
        y: closestShape.y,
        gridX: closestShape.gridX,
        gridY: closestShape.gridY,
        fill: swatch,
      }
    }
  } else if (shape == GridShape.Hexagon) {
    closestShape = findClosestHexagon(x, y, gridWidth, shapeSize, shapes)
    if (closestShape) {
      drawHexagon(c, closestShape.x, closestShape.y, shapeSize, swatch, img)
      return {
        type: closestShape.type,
        x: closestShape.x,
        y: closestShape.y,
        gridX: closestShape.gridX,
        gridY: closestShape.gridY,
        fill: swatch,
      }
    }
  }
}

// ****************** Erase functions ****************** //
function clearSquare(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  c.clearRect(x, y, r, r)
}

function clearHexagon(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  // save state of canvas
  c.save()

  // clear the hexagon
  c.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    c.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle))
  }
  c.closePath()

  //set clipping region to hexagon
  c.clip()

  // clear the hexagon
  c.clearRect(x - r, y - r, 2 * r, 2 * r)

  // restore state of canvas
  c.restore()
}

export function clearClosestShape(
  c: CanvasRenderingContext2D,
  shapes: Shape[],
  shape: GridShape,
  gridWidth: number,
  shapeSize: number,
  x: number,
  y: number,
): Shape | undefined {
  let closestShape = null

  if (shape == GridShape.Square) {
    closestShape = findClosestSquare(x, y, gridWidth, shapeSize, shapes)

    if (closestShape && closestShape.fill) {
      clearSquare(c, closestShape.x, closestShape.y, shapeSize)
      return {
        type: closestShape.type,
        x: closestShape.x,
        y: closestShape.y,
        gridX: closestShape.gridX,
        gridY: closestShape.gridY,
        fill: undefined,
      }
    }
  } else if (shape == GridShape.Hexagon) {
    closestShape = findClosestHexagon(x, y, gridWidth, shapeSize, shapes)

    if (closestShape && closestShape.fill) {
      clearHexagon(c, closestShape.x, closestShape.y, shapeSize)
      return {
        type: closestShape.type,
        x: closestShape.x,
        y: closestShape.y,
        gridX: closestShape.gridX,
        gridY: closestShape.gridY,
        fill: undefined,
      }
    }
  }
}
