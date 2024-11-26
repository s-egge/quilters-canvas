import { GridShape, Shape } from './interfaces'

// somewhat arbitrary min sizes based on testing what looks good, might change later
const MIN_SQUARE_SIZE = 50
const MIN_HEX_SIZE = 35

function getMinimumSquareSize(
  gridWidth: number,
  gridHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): number {
  const squareWidth = Math.floor(canvasWidth / gridWidth)
  const squareHeight = Math.floor(canvasHeight / gridHeight)
  const squareSize = Math.min(squareWidth, squareHeight)
  return Math.max(squareSize, MIN_SQUARE_SIZE)
}

function getMinimumHexSize(
  gridWidth: number,
  gridHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): number {
  const hexWidthRadius = Math.floor(canvasWidth / (2 + 1.5 * (gridWidth - 1)))
  const hexHeightRadius = Math.floor(canvasHeight / gridHeight / 2)
  const hexSize = Math.min(hexWidthRadius, hexHeightRadius)
  return Math.max(hexSize, MIN_HEX_SIZE)
}

export function getMinimumShapeSize(
  gridShape: GridShape,
  gridWidth: number,
  gridHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): number {
  if (gridShape === GridShape.Square) {
    return getMinimumSquareSize(
      gridWidth,
      gridHeight,
      canvasWidth,
      canvasHeight,
    )
  }

  return getMinimumHexSize(gridWidth, gridHeight, canvasWidth, canvasHeight)
}

export function findClosestSquare(
  x: number,
  y: number,
  gridWidth: number,
  squareSize: number,
  shapes: Shape[],
): Shape | undefined {
  const gridX = Math.floor(x / squareSize)
  const gridY = Math.floor(y / squareSize)

  // calculate array position
  const index = gridY * gridWidth + gridX

  return shapes[index]
}

function isPointInHexagon(
  x: number,
  y: number,
  r: number,
  hexagon: Shape,
): boolean {
  const angle = Math.PI / 3 // 60 degrees in radians
  const points = []

  for (let i = 0; i < 6; i++) {
    points.push({
      x: hexagon.x + r * Math.cos(angle * i),
      y: hexagon.y + r * Math.sin(angle * i),
    })
  }

  // adapted from https://stackoverflow.com/questions/11716268/point-in-polygon-algorithm
  let isInside = false

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    if (
      points[i].y >= y != points[j].y >= y &&
      x <=
        ((points[j].x - points[i].x) * (y - points[i].y)) /
          (points[j].y - points[i].y) +
          points[i].x
    ) {
      isInside = !isInside
    }
  }

  if (isInside) {
    return true
  }

  return false
}

export function findClosestHexagon(
  x: number,
  y: number,
  gridWidth: number,
  hexSize: number,
  shapes: Shape[],
): Shape | undefined {
  const a = Math.PI / 3 // 60 degrees in radians
  const xOffset = hexSize * (1 + Math.cos(a))
  const hexHeight = hexSize * Math.sqrt(3)

  const gridY = Math.floor(y / hexHeight)
  const gridX = Math.floor(x / xOffset)

  // calculate approximate grid/array position
  const index = gridY * gridWidth + gridX
  const surroundingIndices = [
    index - gridWidth - 1,
    index - gridWidth,
    index - gridWidth + 1,
    index - 1,
    index,
    index + 1,
    index + gridWidth,
    index + gridWidth + 1,
    index + gridWidth - 1,
  ]

  // check all surrounding hexagons to see if point is in any of them
  for (const i of surroundingIndices) {
    const shape = shapes[i]

    if (shape && isPointInHexagon(x, y, hexSize, shape)) {
      return shape
    }
  }
}

export function findClosestShape(
  x: number,
  y: number,
  gridShape: GridShape,
  gridWidth: number,
  shapeSize: number,
  shapes: Shape[],
): Shape | undefined {
  if (gridShape === GridShape.Square) {
    return findClosestSquare(x, y, gridWidth, shapeSize, shapes)
  }

  return findClosestHexagon(x, y, gridWidth, shapeSize, shapes)
}
